import { z } from 'zod/v4';

const unknownRecord = z.object({}).passthrough();

export const systemLogSchema = z.object({
  companyId: z.string().nullable().optional(),
  level: z.enum(['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']).default('INFO'),
  source: z.string().min(1),
  message: z.string().min(1),
  context: unknownRecord.nullable().optional(),
});

export type SystemLogInput = z.infer<typeof systemLogSchema>;

export const healthSchema = z.object({
  service: z.string().min(1),
  status: z.enum(['healthy', 'degraded', 'unhealthy', 'unknown']).default('healthy'),
  responseTime: z.number().int().nullable().optional(),
});

export type HealthInput = z.infer<typeof healthSchema>;

export const deploymentSchema = z.object({
  version: z.string().min(1),
  environment: z.enum(['development', 'staging', 'production', 'sandbox']).default('production'),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'rolled_back']).default('pending'),
  commit: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
});

export type DeploymentInput = z.infer<typeof deploymentSchema>;

export const backupSchema = z.object({
  type: z.enum(['manual', 'scheduled']).default('manual'),
  status: z.enum(['pending', 'running', 'completed', 'failed']).default('pending'),
  size: z.number().int().nullable().optional(),
});

export type BackupInput = z.infer<typeof backupSchema>;
