import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));

export const projectStatusSchema = z.enum([
  'WAITING', 'PLANNING', 'IN_PRODUCTION', 'WAITING_INSTALLATION',
  'INSTALLING', 'FINISHED', 'DELIVERED', 'CANCELLED',
]);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const taskStatusSchema = z.enum([
  'PENDING', 'WAITING', 'IN_PROGRESS', 'PAUSED', 'FINISHED', 'CANCELLED',
]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const departmentSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  color: z.string().default('#3b82f6'),
  icon: z.string().default('Building2'),
  sortOrder: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});
export type DepartmentSchemaType = z.infer<typeof departmentSchema>;

export const projectTaskSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  departmentId: z.string().nullable().optional().default(null),
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  sequence: z.coerce.number().int().min(0).default(0),
  status: taskStatusSchema.default('PENDING'),
  estimatedHours: z.coerce.number().min(0).nullable().optional().default(null),
  actualHours: z.coerce.number().min(0).nullable().optional().default(null),
  assignedTeamId: z.string().nullable().optional().default(null),
  dependsOnTaskId: z.string().nullable().optional().default(null),
  startedAt: dateField.nullable().optional().default(null),
  finishedAt: dateField.nullable().optional().default(null),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});
export type ProjectTaskSchemaType = z.infer<typeof projectTaskSchema>;

export const projectSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  quotationId: z.string().nullable().optional().default(null),
  clientId: z.string().nullable().optional().default(null),
  number: z.string().min(1, 'Número é obrigatório'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  status: projectStatusSchema.default('WAITING'),
  priority: z.string().default('normal'),
  expectedStartDate: dateField.nullable().optional().default(null),
  expectedEndDate: dateField.nullable().optional().default(null),
  actualStartDate: dateField.nullable().optional().default(null),
  actualEndDate: dateField.nullable().optional().default(null),
  notes: z.string().optional().default(''),
  tasks: z.array(projectTaskSchema).default([]),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});
export type ProjectSchemaType = z.infer<typeof projectSchema>;

export const projectFormSchema = projectSchema.omit({
  id: true, companyId: true, number: true,
  tasks: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});
export type ProjectFormType = z.infer<typeof projectFormSchema>;

export const projectCreateSchema = z.object({
  quotationId: z.string().nullable().optional().default(null),
  clientId: z.string().nullable().optional().default(null),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  priority: z.string().default('normal'),
  expectedStartDate: z.string().nullable().optional().default(null),
  expectedEndDate: z.string().nullable().optional().default(null),
  notes: z.string().optional().default(''),
});
export type ProjectCreateType = z.infer<typeof projectCreateSchema>;
