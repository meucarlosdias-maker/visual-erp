import type { JobPriority, JobStatus, JobType, RetryPolicy, ScheduleType, ExecutionStatus } from '@/core/queue';

export interface Job {
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

export interface JobExecution {
  id: string;
  jobId: string;
  worker: string;
  duration: number | null;
  status: ExecutionStatus;
  error: string | null;
  logs: string[] | null;
  createdAt: Date;
}

export interface ScheduledJob {
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

export interface EventLog {
  id: string;
  companyId: string;
  event: string;
  payload: Record<string, unknown> | null;
  publisher: string;
  status: string;
  createdAt: Date;
}

export const JOB_PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Baixa', color: 'text-muted-foreground' },
  { value: 'NORMAL', label: 'Normal', color: 'text-blue-500' },
  { value: 'HIGH', label: 'Alta', color: 'text-orange-500' },
  { value: 'URGENT', label: 'Urgente', color: 'text-red-500' },
] as const;

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  import: 'Importação',
  export: 'Exportação',
  pdf: 'Gerar PDF',
  email: 'Enviar E-mail',
  image: 'Processar Imagem',
  sync: 'Sincronização',
  cleanup: 'Limpeza de Dados',
  batch_update: 'Atualização em Lote',
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  pending: 'Pendente',
  running: 'Executando',
  completed: 'Concluído',
  failed: 'Falhou',
  cancelled: 'Cancelado',
};

export const SCHEDULE_TYPE_LABELS: Record<ScheduleType, string> = {
  cron: 'Cron',
  interval: 'Intervalo',
  one_time: 'Uma vez',
  manual: 'Manual',
};
