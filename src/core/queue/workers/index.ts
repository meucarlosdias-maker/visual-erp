import type { WorkerDefinition, JobType, JobDefinition, ExecutionStatus } from '../types';
import type { JobExecutionRecord } from '../types';

const workers: Map<string, WorkerDefinition> = new Map();

export function registerWorker(name: string, queue: JobType[], version = '1.0.0'): WorkerDefinition {
  const worker: WorkerDefinition = {
    name, status: 'idle', version, queue, lastActivity: null,
  };
  workers.set(name, worker);
  return worker;
}

export function getWorker(name: string): WorkerDefinition | undefined {
  return workers.get(name);
}

export function listWorkers(): WorkerDefinition[] {
  return Array.from(workers.values());
}

export function updateWorkerStatus(name: string, status: WorkerDefinition['status']): void {
  const w = workers.get(name);
  if (w) {
    w.status = status;
    w.lastActivity = new Date();
  }
}

export function findWorkerForJob(jobType: JobType): WorkerDefinition | undefined {
  return Array.from(workers.values()).find(
    (w) => w.status === 'idle' && w.queue.includes(jobType),
  );
}

export function removeWorker(name: string): boolean {
  return workers.delete(name);
}

export function resetWorkers(): void {
  workers.clear();
}
