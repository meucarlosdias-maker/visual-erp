import { BaseService } from '@/lib/service-base';
import { NotFoundError } from '@/lib/errors';
import { JobRepository } from '../repository';
import type { Job, JobExecution, ScheduledJob, EventLog } from '../types';
import type { JobInput, JobUpdate, ScheduledJobInput } from '../schemas';

const repository = new JobRepository();

export class JobModuleService {
  async listJobs(): Promise<Job[]> { return repository.findAllJobs(); }
  async getJob(id: string): Promise<Job> {
    const job = await repository.findJobById(id);
    if (!job) throw new NotFoundError('Job', id);
    return job;
  }
  async createJob(input: JobInput): Promise<Job> { return repository.createJob(input); }
  async updateJob(id: string, input: JobUpdate): Promise<Job> {
    await this.getJob(id);
    return repository.updateJob(id, input);
  }
  async deleteJob(id: string): Promise<boolean> {
    await this.getJob(id);
    return repository.deleteJob(id);
  }

  async listExecutions(jobId?: string): Promise<JobExecution[]> {
    if (jobId) return repository.findExecutionsByJobId(jobId);
    return repository.findAllExecutions();
  }

  async listSchedules(): Promise<ScheduledJob[]> { return repository.findAllSchedules(); }
  async getSchedule(id: string): Promise<ScheduledJob> {
    const sch = await repository.findScheduleById(id);
    if (!sch) throw new NotFoundError('Agendamento', id);
    return sch;
  }
  async createSchedule(input: ScheduledJobInput): Promise<ScheduledJob> { return repository.createSchedule(input); }
  async updateSchedule(id: string, input: Partial<ScheduledJobInput>): Promise<ScheduledJob> {
    await this.getSchedule(id);
    return repository.updateSchedule(id, input);
  }
  async deleteSchedule(id: string): Promise<boolean> {
    await this.getSchedule(id);
    return repository.deleteSchedule(id);
  }

  async listEvents(): Promise<EventLog[]> { return repository.findAllEvents(); }
}

export const jobModuleService = new JobModuleService();
