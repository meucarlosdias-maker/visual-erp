import { z } from 'zod/v4';

const unknownRecord = z.object({}).passthrough();

const triggerEnum = z.enum([
  'CLIENT_CREATED', 'LEAD_CREATED', 'LEAD_CONVERTED',
  'QUOTE_APPROVED', 'PROJECT_CREATED', 'WORKORDER_CREATED',
  'PRODUCTION_FINISHED', 'INSTALLATION_FINISHED',
  'FINANCIAL_RECEIVED', 'FINANCIAL_PAID', 'USER_CREATED',
]);

const conditionOperatorEnum = z.enum([
  'equals', 'not_equals', 'greater_than', 'less_than',
  'contains', 'date_equals', 'date_before', 'date_after',
  'status_equals', 'user_equals', 'company_equals',
]);

const actionTypeEnum = z.enum([
  'create_record', 'update_record', 'change_status',
  'create_task', 'create_event', 'send_notification',
  'execute_webhook', 'log_entry',
]);

const conditionConfigSchema = z.object({
  field: z.string().min(1, 'Campo é obrigatório'),
  operator: conditionOperatorEnum,
  value: z.unknown(),
});

const stepConfigSchema = z.object({
  conditions: z.array(conditionConfigSchema).default([]),
  actionType: actionTypeEnum,
  actionConfig: unknownRecord.default({}),
});

export const workflowSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().nullable().optional(),
  active: z.boolean().default(true),
  trigger: triggerEnum,
  steps: z.array(stepConfigSchema).default([]),
});

export type WorkflowInput = z.infer<typeof workflowSchema>;

export const workflowUpdateSchema = workflowSchema.partial();

export type WorkflowUpdate = z.infer<typeof workflowUpdateSchema>;

export const workflowStepSchema = z.object({
  workflowId: z.string(),
  order: z.number().int().min(0),
  type: z.string(),
  configuration: unknownRecord.default({}),
});

export type WorkflowStepInput = z.infer<typeof workflowStepSchema>;

export const executionSchema = z.object({
  workflowId: z.string(),
  status: z.enum(['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED']).default('PENDING'),
  startedAt: z.date().nullable().optional(),
  finishedAt: z.date().nullable().optional(),
  duration: z.number().int().nullable().optional(),
  error: z.string().nullable().optional(),
});

export type ExecutionInput = z.infer<typeof executionSchema>;
