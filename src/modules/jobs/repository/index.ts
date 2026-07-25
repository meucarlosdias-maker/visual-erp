import type { Job, JobExecution, ScheduledJob, EventLog } from '../types';
import type { JobInput, JobUpdate, ScheduledJobInput } from '../schemas';
import type { JobPriority, RetryPolicy, ScheduleType } from '@/core/queue';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockJobs: Job[] = [
  {
    id: 'job-001', companyId: COMPANY_ID, name: 'Importar clientes', type: 'import',
    payload: { file: 'clientes.csv' }, priority: 'HIGH', status: 'completed',
    attempts: 1, maxAttempts: 3, retryPolicy: 'exponential', retryDelay: 5000,
    scheduledAt: null, startedAt: new Date('2026-07-20T10:00:00'), finishedAt: new Date('2026-07-20T10:02:30'),
    createdAt: new Date('2026-07-20T09:00:00'),
  },
  {
    id: 'job-002', companyId: COMPANY_ID, name: 'Exportar relatório financeiro', type: 'export',
    payload: { format: 'xlsx' }, priority: 'NORMAL', status: 'running',
    attempts: 1, maxAttempts: 1, retryPolicy: 'none', retryDelay: 0,
    scheduledAt: null, startedAt: new Date('2026-07-20T11:00:00'), finishedAt: null,
    createdAt: new Date('2026-07-20T10:30:00'),
  },
  {
    id: 'job-003', companyId: COMPANY_ID, name: 'Gerar PDF orçamento #1024', type: 'pdf',
    payload: { quoteId: '1024' }, priority: 'URGENT', status: 'failed',
    attempts: 2, maxAttempts: 3, retryPolicy: 'exponential', retryDelay: 10000,
    scheduledAt: null, startedAt: new Date('2026-07-20T11:30:00'), finishedAt: new Date('2026-07-20T11:30:45'),
    createdAt: new Date('2026-07-20T11:00:00'),
  },
  {
    id: 'job-004', companyId: COMPANY_ID, name: 'Enviar e-mail marketing', type: 'email',
    payload: { template: 'newsletter_julho' }, priority: 'LOW', status: 'pending',
    attempts: 0, maxAttempts: 1, retryPolicy: 'none', retryDelay: 0,
    scheduledAt: new Date('2026-07-25T08:00:00'), startedAt: null, finishedAt: null,
    createdAt: new Date('2026-07-19T14:00:00'),
  },
  {
    id: 'job-005', companyId: COMPANY_ID, name: 'Limpeza de logs antigos', type: 'cleanup',
    payload: { daysOld: 90 }, priority: 'NORMAL', status: 'pending',
    attempts: 0, maxAttempts: 1, retryPolicy: 'none', retryDelay: 0,
    scheduledAt: null, startedAt: null, finishedAt: null,
    createdAt: new Date('2026-07-18T00:00:00'),
  },
];

const mockExecutions: JobExecution[] = [
  {
    id: 'exec-001', jobId: 'job-001', worker: 'default-worker',
    duration: 150000, status: 'completed', error: null,
    logs: ['Iniciando importação...', 'Processados 150 registros', 'Importação concluída'],
    createdAt: new Date('2026-07-20T10:00:00'),
  },
  {
    id: 'exec-002', jobId: 'job-003', worker: 'pdf-worker',
    duration: 15000, status: 'failed', error: 'Falha ao conectar no serviço de PDF',
    logs: ['Iniciando geração de PDF...', 'Erro: conexão recusada'],
    createdAt: new Date('2026-07-20T11:30:00'),
  },
  {
    id: 'exec-003', jobId: 'job-003', worker: 'pdf-worker',
    duration: 12000, status: 'failed', error: 'Timeout ao gerar PDF',
    logs: ['Tentativa 2...', 'Erro: timeout'],
    createdAt: new Date('2026-07-20T11:30:30'),
  },
];

const mockSchedules: ScheduledJob[] = [
  {
    id: 'sch-001', companyId: COMPANY_ID, name: 'Limpeza noturna', type: 'cron',
    cron: '0 2 * * *', interval: null,
    config: { type: 'cleanup', payload: { daysOld: 30 } },
    active: true, lastExecution: new Date('2026-07-20T02:00:00'),
    nextExecution: new Date('2026-07-21T02:00:00'),
    createdAt: new Date('2026-07-01T00:00:00'), updatedAt: new Date('2026-07-01T00:00:00'),
  },
  {
    id: 'sch-002', companyId: COMPANY_ID, name: 'Sincronização estoque', type: 'interval',
    cron: null, interval: 3600000,
    config: { type: 'sync', payload: {} },
    active: true, lastExecution: new Date('2026-07-20T11:00:00'),
    nextExecution: new Date('2026-07-20T12:00:00'),
    createdAt: new Date('2026-07-01T00:00:00'), updatedAt: new Date('2026-07-01T00:00:00'),
  },
  {
    id: 'sch-003', companyId: COMPANY_ID, name: 'Gerar relatório mensal', type: 'one_time',
    cron: null, interval: null,
    config: { type: 'export', payload: { format: 'xlsx' } },
    active: false, lastExecution: null, nextExecution: null,
    createdAt: new Date('2026-07-15T00:00:00'), updatedAt: new Date('2026-07-15T00:00:00'),
  },
];

const mockEvents: EventLog[] = [
  {
    id: 'evt-001', companyId: COMPANY_ID, event: 'ClientCreated',
    payload: { clientId: 'cli-123', name: 'Empresa ABC' }, publisher: 'crm',
    status: 'processed', createdAt: new Date('2026-07-20T09:00:00'),
  },
  {
    id: 'evt-002', companyId: COMPANY_ID, event: 'QuoteApproved',
    payload: { quoteId: 'orc-1024', value: 15000 }, publisher: 'commercial',
    status: 'processed', createdAt: new Date('2026-07-20T09:30:00'),
  },
  {
    id: 'evt-003', companyId: COMPANY_ID, event: 'ProjectCreated',
    payload: { projectId: 'proj-456', name: 'Instalação Sala Comercial' }, publisher: 'projects',
    status: 'processed', createdAt: new Date('2026-07-20T10:00:00'),
  },
  {
    id: 'evt-004', companyId: COMPANY_ID, event: 'FinancialReceived',
    payload: { amount: 5000, account: 'Banco ABC' }, publisher: 'financial',
    status: 'processed', createdAt: new Date('2026-07-20T10:30:00'),
  },
  {
    id: 'evt-005', companyId: COMPANY_ID, event: 'UserCreated',
    payload: { userId: 'usr-789', email: 'novo@email.com' }, publisher: 'users',
    status: 'failed', createdAt: new Date('2026-07-20T11:00:00'),
  },
];

function toJob(row: typeof mockJobs[0]): Job { return { ...row }; }
function toExecution(row: typeof mockExecutions[0]): JobExecution { return { ...row }; }
function toSchedule(row: typeof mockSchedules[0]): ScheduledJob { return { ...row }; }
function toEvent(row: typeof mockEvents[0]): EventLog { return { ...row }; }

export class JobRepository {
  async findAllJobs(): Promise<Job[]> { return mockJobs.map(toJob); }
  async findJobById(id: string): Promise<Job | null> { return mockJobs.find((j) => j.id === id) ?? null; }
  async createJob(input: JobInput): Promise<Job> {
    const job: Job = {
      id: crypto.randomUUID(), companyId: COMPANY_ID,
      name: input.name, type: input.type as Job['type'],
      payload: (input.payload as Record<string, unknown>) ?? null,
      priority: input.priority as JobPriority, status: 'pending',
      attempts: 0, maxAttempts: input.maxAttempts ?? 1,
      retryPolicy: input.retryPolicy as RetryPolicy, retryDelay: input.retryDelay ?? 0,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
      startedAt: null, finishedAt: null, createdAt: new Date(),
    };
    mockJobs.push(job);
    return job;
  }
  async updateJob(id: string, input: JobUpdate): Promise<Job> {
    const idx = mockJobs.findIndex((j) => j.id === id);
    if (idx === -1) throw new Error('Job não encontrado');
    const { scheduledAt, ...rest } = input;
    const updated = { ...mockJobs[idx], ...rest, scheduledAt: scheduledAt ? new Date(scheduledAt) : mockJobs[idx].scheduledAt };
    mockJobs[idx] = updated as Job;
    return mockJobs[idx];
  }
  async deleteJob(id: string): Promise<boolean> {
    const idx = mockJobs.findIndex((j) => j.id === id);
    if (idx !== -1) { mockJobs.splice(idx, 1); return true; }
    return false;
  }

  async findAllExecutions(): Promise<JobExecution[]> { return mockExecutions.map(toExecution); }
  async findExecutionsByJobId(jobId: string): Promise<JobExecution[]> {
    return mockExecutions.filter((e) => e.jobId === jobId).map(toExecution);
  }

  async findAllSchedules(): Promise<ScheduledJob[]> { return mockSchedules.map(toSchedule); }
  async findScheduleById(id: string): Promise<ScheduledJob | null> { return mockSchedules.find((s) => s.id === id) ?? null; }
  async createSchedule(input: ScheduledJobInput): Promise<ScheduledJob> {
    const schedule: ScheduledJob = {
      id: crypto.randomUUID(), companyId: COMPANY_ID,
      name: input.name, type: input.type as ScheduleType,
      cron: input.cron ?? null, interval: input.interval ?? null,
      config: (input.config as Record<string, unknown>) ?? null,
      active: input.active, lastExecution: null, nextExecution: null,
      createdAt: new Date(), updatedAt: new Date(),
    };
    mockSchedules.push(schedule);
    return schedule;
  }
  async updateSchedule(id: string, input: Partial<ScheduledJobInput>): Promise<ScheduledJob> {
    const idx = mockSchedules.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Agendamento não encontrado');
    mockSchedules[idx] = { ...mockSchedules[idx], ...input, updatedAt: new Date() } as ScheduledJob;
    return mockSchedules[idx];
  }
  async deleteSchedule(id: string): Promise<boolean> {
    const idx = mockSchedules.findIndex((s) => s.id === id);
    if (idx !== -1) { mockSchedules.splice(idx, 1); return true; }
    return false;
  }

  async findAllEvents(): Promise<EventLog[]> { return mockEvents.map(toEvent); }
  async createEventLog(input: { event: string; payload?: Record<string, unknown> | null; publisher: string }): Promise<EventLog> {
    const entry: EventLog = {
      id: crypto.randomUUID(), companyId: COMPANY_ID,
      event: input.event, payload: input.payload ?? null,
      publisher: input.publisher, status: 'processed', createdAt: new Date(),
    };
    mockEvents.push(entry);
    return entry;
  }
}
