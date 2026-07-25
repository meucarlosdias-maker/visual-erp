import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));

export const productionOrderStatusSchema = z.enum([
  'pending', 'approved', 'in_progress', 'paused', 'finished', 'cancelled',
]);
export type ProductionOrderStatus = z.infer<typeof productionOrderStatusSchema>;

export const productionOrderSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  projectId: z.string(),
  projectTaskId: z.string().nullable().optional().default(null),
  departmentId: z.string().nullable().optional().default(null),
  number: z.string().min(1),
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  status: productionOrderStatusSchema.default('pending'),
  priority: z.string().default('normal'),
  assignedTeamId: z.string().nullable().optional().default(null),
  estimatedHours: z.coerce.number().min(0).nullable().optional().default(null),
  actualHours: z.coerce.number().min(0).nullable().optional().default(null),
  startedAt: dateField.nullable().optional().default(null),
  finishedAt: dateField.nullable().optional().default(null),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});
export type ProductionOrderSchemaType = z.infer<typeof productionOrderSchema>;
