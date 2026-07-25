import type { RetryPolicy, JobDefinition } from '../types';

export interface RetryResult {
  shouldRetry: boolean;
  delay: number;
  nextAttempt: number;
}

export function evaluateRetry(job: JobDefinition): RetryResult {
  const nextAttempt = job.attempts + 1;
  if (nextAttempt > job.maxAttempts) {
    return { shouldRetry: false, delay: 0, nextAttempt };
  }
  const delay = calculateDelay(job.retryPolicy, job.retryDelay, job.attempts);
  return { shouldRetry: true, delay, nextAttempt };
}

function calculateDelay(policy: RetryPolicy, baseDelay: number, attempt: number): number {
  switch (policy) {
    case 'linear':
      return baseDelay * (attempt + 1);
    case 'exponential':
      return baseDelay * Math.pow(2, attempt);
    case 'custom':
      return baseDelay;
    case 'none':
    default:
      return 0;
  }
}
