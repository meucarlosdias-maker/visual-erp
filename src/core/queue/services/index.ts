import type { JobDefinition, JobPriority, JobStatus, JobType, ScheduledJobDefinition, ScheduleType, WorkerDefinition, ExecutionStatus, JobExecutionRecord, MonitoringData } from '../types';
import { createJob, canRetry, nextRetryDelay, sortByPriority } from '../jobs';
import { registerWorker, getWorker, listWorkers, updateWorkerStatus, findWorkerForJob, removeWorker, resetWorkers } from '../workers';
import { registerSchedule, getSchedule, listSchedules, updateSchedule, removeSchedule, calculateNextExecution } from '../scheduler';
import { evaluateRetry } from '../retry';
import { buildMonitoringData } from '../monitoring';

export class QueueService {
  private jobs: JobDefinition[] = [];
  private executions: JobExecutionRecord[] = [];

  enqueue(input: {
    companyId: string; name: string; type: JobType; priority?: JobPriority;
    payload?: Record<string, unknown>; maxAttempts?: number;
    retryPolicy?: 'none' | 'linear' | 'exponential' | 'custom'; retryDelay?: number;
    scheduledAt?: Date;
  }): JobDefinition {
    const job = createJob({
      companyId: input.companyId,
      name: input.name,
      type: input.type,
      priority: input.priority ?? 'NORMAL',
      payload: input.payload ?? null,
      maxAttempts: input.maxAttempts ?? 1,
      retryPolicy: input.retryPolicy ?? 'none',
      retryDelay: input.retryDelay ?? 0,
      scheduledAt: input.scheduledAt ?? null,
    });
    this.jobs.push(job);
    return job;
  }

  processNext(): JobDefinition | null {
    const pending = this.jobs.filter((j) => j.status === 'pending' && (!j.scheduledAt || j.scheduledAt <= new Date()));
    const sorted = sortByPriority(pending);
    const job = sorted[0] ?? null;
    if (job) {
      job.status = 'running';
      job.startedAt = new Date();
      job.attempts++;
    }
    return job;
  }

  complete(jobId: string, worker: string): JobDefinition | null {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    job.status = 'completed';
    job.finishedAt = new Date();
    this.executions.push({
      id: crypto.randomUUID(), jobId, worker, duration: job.startedAt ? new Date().getTime() - job.startedAt.getTime() : null,
      status: 'completed', error: null, logs: null, createdAt: new Date(),
    });
    return job;
  }

  fail(jobId: string, worker: string, error: string): JobDefinition | null {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    const retry = evaluateRetry(job);
    if (retry.shouldRetry) {
      job.status = 'pending';
      job.attempts = retry.nextAttempt;
    } else {
      job.status = 'failed';
      job.finishedAt = new Date();
    }
    this.executions.push({
      id: crypto.randomUUID(), jobId, worker, duration: job.startedAt ? new Date().getTime() - job.startedAt.getTime() : null,
      status: 'failed', error, logs: null, createdAt: new Date(),
    });
    return job;
  }

  cancel(jobId: string): JobDefinition | null {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    job.status = 'cancelled';
    job.finishedAt = new Date();
    return job;
  }

  getJob(jobId: string): JobDefinition | undefined {
    return this.jobs.find((j) => j.id === jobId);
  }

  listJobs(filter?: { status?: JobStatus; type?: JobType; priority?: JobPriority; companyId?: string }): JobDefinition[] {
    let result = [...this.jobs];
    if (filter?.status) result = result.filter((j) => j.status === filter.status);
    if (filter?.type) result = result.filter((j) => j.type === filter.type);
    if (filter?.priority) result = result.filter((j) => j.priority === filter.priority);
    if (filter?.companyId) result = result.filter((j) => j.companyId === filter.companyId);
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getExecutions(jobId?: string): JobExecutionRecord[] {
    if (jobId) return this.executions.filter((e) => e.jobId === jobId);
    return [...this.executions];
  }

  getMonitoringData(): MonitoringData {
    const workers = listWorkers();
    return buildMonitoringData(this.jobs, workers);
  }

  schedule(input: Omit<ScheduledJobDefinition, 'id' | 'createdAt' | 'updatedAt'>): ScheduledJobDefinition {
    const entry: ScheduledJobDefinition = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    entry.nextExecution = calculateNextExecution(entry);
    registerSchedule(entry);
    return entry;
  }

  updateSchedule(id: string, updates: Partial<ScheduledJobDefinition>): ScheduledJobDefinition | undefined {
    const existing = getSchedule(id);
    if (!existing) return undefined;
    const updated: ScheduledJobDefinition = { ...existing, ...updates, updatedAt: new Date() };
    updated.nextExecution = calculateNextExecution(updated);
    updateSchedule(id, updated);
    return updated;
  }

  deleteSchedule(id: string): boolean {
    return removeSchedule(id);
  }

  listSchedules(): ScheduledJobDefinition[] {
    return listSchedules();
  }

  getSchedule(id: string): ScheduledJobDefinition | undefined {
    return getSchedule(id);
  }

  getWorker(name: string): WorkerDefinition | undefined {
    return getWorker(name);
  }

  listWorkers(): WorkerDefinition[] {
    return listWorkers();
  }

  registerWorker(name: string, queue: JobType[], version?: string): WorkerDefinition {
    return registerWorker(name, queue, version);
  }

  updateWorkerStatus(name: string, status: WorkerDefinition['status']): void {
    updateWorkerStatus(name, status);
  }

  removeWorker(name: string): boolean {
    return removeWorker(name);
  }

  findWorkerForJob(jobType: JobType): WorkerDefinition | undefined {
    return findWorkerForJob(jobType);
  }
}

export const queueService = new QueueService();
