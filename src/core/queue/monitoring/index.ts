import type { JobDefinition, MonitoringData, WorkerDefinition } from '../types';

export function buildMonitoringData(
  jobs: JobDefinition[],
  workers: WorkerDefinition[],
): MonitoringData {
  const completed = jobs.filter((j) => j.status === 'completed').length;
  const failed = jobs.filter((j) => j.status === 'failed').length;
  const totalFinished = completed + failed;

  const completedJobs = jobs.filter((j) => j.status === 'completed' && j.startedAt && j.finishedAt);
  const totalDuration = completedJobs.reduce((sum, j) => {
    return sum + (j.finishedAt!.getTime() - j.startedAt!.getTime());
  }, 0);
  const avgDuration = completedJobs.length > 0 ? totalDuration / completedJobs.length : 0;

  return {
    pending: jobs.filter((j) => j.status === 'pending').length,
    running: jobs.filter((j) => j.status === 'running').length,
    completed,
    failed,
    avgDuration,
    successRate: totalFinished > 0 ? (completed / totalFinished) * 100 : 100,
    workers,
  };
}
