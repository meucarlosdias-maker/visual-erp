import { z } from 'zod/v4';

const unknownRecord = z.object({}).passthrough();

export const auditSchema = z.object({
  userId: z.string().nullable().optional(),
  entity: z.string().min(1, 'Entidade é obrigatória'),
  entityId: z.string().nullable().optional(),
  action: z.enum([
    'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE',
    'PERMISSION_CHANGE', 'PASSWORD_CHANGE', 'EXPORT', 'IMPORT',
    'UPLOAD', 'WORKFLOW_EXECUTE', 'AI_EXECUTE', 'FINANCIAL_CHANGE',
  ]),
  oldValues: unknownRecord.nullable().optional(),
  newValues: unknownRecord.nullable().optional(),
  ip: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
});

export type AuditInput = z.infer<typeof auditSchema>;

export const policySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().nullable().optional(),
  rules: z.array(z.object({
    type: z.string(),
    effect: z.string(),
    conditions: unknownRecord.default({}),
    priority: z.number().int().default(0),
  })).default([]),
  active: z.boolean().default(true),
});

export type PolicyInput = z.infer<typeof policySchema>;

export const policyUpdateSchema = policySchema.partial();
export type PolicyUpdate = z.infer<typeof policyUpdateSchema>;

export const accessLogSchema = z.object({
  userId: z.string().nullable().optional(),
  action: z.string().min(1),
  resource: z.string().min(1),
  status: z.string(),
  ip: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});

export type AccessLogInput = z.infer<typeof accessLogSchema>;

export const retentionSchema = z.object({
  entity: z.string().min(1),
  retentionDays: z.number().int().min(1),
  archiveAfter: z.number().int().nullable().optional(),
  deleteAfter: z.number().int().nullable().optional(),
  active: z.boolean().default(true),
});

export type RetentionInput = z.infer<typeof retentionSchema>;

export const retentionUpdateSchema = retentionSchema.partial();
export type RetentionUpdate = z.infer<typeof retentionUpdateSchema>;
