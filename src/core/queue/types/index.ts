export type JobPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type JobType =
  | 'import'
  | 'export'
  | 'pdf'
  | 'email'
  | 'image'
  | 'sync'
  | 'cleanup'
  | 'batch_update';

export type RetryPolicy = 'none' | 'linear' | 'exponential' | 'custom';

export type ExecutionStatus = 'running' | 'completed' | 'failed';

export type ScheduleType = 'cron' | 'interval' | 'one_time' | 'manual';

export interface JobDefinition {
  id: string;
  companyId: string;
  name: string;
  type: JobType;
  payload: Record<string, unknown> | null;
  priority: JobPriority;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  retryPolicy: RetryPolicy;
  retryDelay: number;
  scheduledAt: Date | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
}

export interface JobExecutionRecord {
  id: string;
  jobId: string;
  worker: string;
  duration: number | null;
  status: ExecutionStatus;
  error: string | null;
  logs: string[] | null;
  createdAt: Date;
}

export interface ScheduledJobDefinition {
  id: string;
  companyId: string;
  name: string;
  type: ScheduleType;
  cron: string | null;
  interval: number | null;
  config: Record<string, unknown> | null;
  active: boolean;
  lastExecution: Date | null;
  nextExecution: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkerDefinition {
  name: string;
  status: 'idle' | 'running' | 'paused' | 'stopped';
  version: string;
  queue: JobType[];
  lastActivity: Date | null;
}

export interface MonitoringData {
  pending: number;
  running: number;
  completed: number;
  failed: number;
  avgDuration: number;
  successRate: number;
  workers: WorkerDefinition[];
}
