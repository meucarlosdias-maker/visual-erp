import type { ScheduledJobDefinition, ScheduleType } from '../types';

const scheduledJobs: Map<string, ScheduledJobDefinition> = new Map();

export function registerSchedule(job: ScheduledJobDefinition): void {
  scheduledJobs.set(job.id, job);
}

export function getSchedule(id: string): ScheduledJobDefinition | undefined {
  return scheduledJobs.get(id);
}

export function listSchedules(): ScheduledJobDefinition[] {
  return Array.from(scheduledJobs.values());
}

export function updateSchedule(id: string, updates: Partial<ScheduledJobDefinition>): void {
  const existing = scheduledJobs.get(id);
  if (existing) {
    scheduledJobs.set(id, { ...existing, ...updates, updatedAt: new Date() });
  }
}

export function removeSchedule(id: string): boolean {
  return scheduledJobs.delete(id);
}

export function calculateNextExecution(job: ScheduledJobDefinition): Date | null {
  if (!job.active) return null;
  const now = new Date();
  switch (job.type) {
    case 'one_time':
      return job.lastExecution ? null : now;
    case 'interval':
      if (job.interval && job.lastExecution) {
        return new Date(job.lastExecution.getTime() + job.interval);
      }
      return now;
    case 'cron':
    case 'manual':
      return null;
    default:
      return null;
  }
}
