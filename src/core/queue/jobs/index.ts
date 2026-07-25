import type { JobDefinition, JobPriority, JobStatus, JobType, RetryPolicy } from '../types';

export function createJob(overrides?: Partial<JobDefinition>): JobDefinition {
  return {
    id: crypto.randomUUID(),
    companyId: '',
    name: '',
    type: 'import',
    payload: null,
    priority: 'NORMAL',
    status: 'pending',
    attempts: 0,
    maxAttempts: 1,
    retryPolicy: 'none',
    retryDelay: 0,
    scheduledAt: null,
    startedAt: null,
    finishedAt: null,
    createdAt: new Date(),
    ...overrides,
  };
}

export function canRetry(job: JobDefinition): boolean {
  return job.attempts < job.maxAttempts && job.status === 'failed';
}

export function nextRetryDelay(job: JobDefinition): number {
  switch (job.retryPolicy) {
    case 'linear':
      return job.retryDelay * (job.attempts + 1);
    case 'exponential':
      return job.retryDelay * Math.pow(2, job.attempts);
    case 'custom':
      return job.retryDelay;
    default:
      return 0;
  }
}

export function sortByPriority(jobs: JobDefinition[]): JobDefinition[] {
  const order: Record<JobPriority, number> = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
  return [...jobs].sort((a, b) => order[a.priority] - order[b.priority]);
}
