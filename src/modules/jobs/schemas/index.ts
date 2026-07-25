import { z } from 'zod/v4';

const unknownRecord = z.object({}).passthrough();

export const jobSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['import', 'export', 'pdf', 'email', 'image', 'sync', 'cleanup', 'batch_update']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  payload: unknownRecord.nullable().optional(),
  maxAttempts: z.number().int().min(1).max(10).default(1),
  retryPolicy: z.enum(['none', 'linear', 'exponential', 'custom']).default('none'),
  retryDelay: z.number().int().min(0).default(0),
  scheduledAt: z.string().nullable().optional(),
});

export type JobInput = z.infer<typeof jobSchema>;

export const jobUpdateSchema = jobSchema.partial();
export type JobUpdate = z.infer<typeof jobUpdateSchema>;

export const scheduledJobSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['cron', 'interval', 'one_time', 'manual']),
  cron: z.string().nullable().optional(),
  interval: z.number().int().min(1000).nullable().optional(),
  config: unknownRecord.nullable().optional(),
  active: z.boolean().default(true),
});

export type ScheduledJobInput = z.infer<typeof scheduledJobSchema>;

export const executionSchema = z.object({
  jobId: z.string(),
  worker: z.string(),
  status: z.enum(['running', 'completed', 'failed']),
  error: z.string().nullable().optional(),
  logs: z.array(z.string()).nullable().optional(),
});

export type ExecutionInput = z.infer<typeof executionSchema>;

export const eventSchema = z.object({
  companyId: z.string(),
  event: z.string(),
  payload: unknownRecord.nullable().optional(),
  publisher: z.string(),
});

export type EventInput = z.infer<typeof eventSchema>;
