import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));

export const workOrderStatusSchema = z.enum([
  'OPEN', 'WAITING_APPROVAL', 'APPROVED', 'IN_PRODUCTION',
  'WAITING_INSTALLATION', 'INSTALLING', 'FINISHED', 'DELIVERED', 'CANCELLED',
]);
export type WorkOrderStatus = z.infer<typeof workOrderStatusSchema>;

export const workOrderItemSchema = z.object({
  id: z.string(),
  workOrderId: z.string(),
  serviceId: z.string().nullable().optional().default(null),
  description: z.string().min(1, 'Descrição é obrigatória'),
  quantity: z.coerce.number().min(0).default(1),
  unit: z.string().optional().default('m2'),
  width: z.coerce.number().min(0).default(0),
  height: z.coerce.number().min(0).default(0),
  area: z.coerce.number().min(0).default(0),
  perimeter: z.coerce.number().min(0).default(0),
  unitPrice: z.coerce.number().min(0).default(0),
  totalPrice: z.coerce.number().min(0).default(0),
  productionSector: z.string().optional().default(''),
  installationRequired: z.boolean().default(false),
  notes: z.string().optional().default(''),
  sortOrder: z.coerce.number().default(0),
});
export type WorkOrderItemSchemaType = z.infer<typeof workOrderItemSchema>;

export const workOrderAttachmentSchema = z.object({
  id: z.string(),
  workOrderId: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  fileUrl: z.string().optional().default(''),
  type: z.string().optional().default(''),
  description: z.string().optional().default(''),
  createdAt: dateField,
});
export type WorkOrderAttachmentSchemaType = z.infer<typeof workOrderAttachmentSchema>;

export const workOrderEventSchema = z.object({
  id: z.string(),
  workOrderId: z.string(),
  type: z.string().min(1, 'Tipo é obrigatório'),
  description: z.string().optional().default(''),
  userId: z.string().optional().default(''),
  createdAt: dateField,
});
export type WorkOrderEventSchemaType = z.infer<typeof workOrderEventSchema>;

export const workOrderSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  number: z.string().min(1, 'Número é obrigatório'),
  projectId: z.string().nullable().optional().default(null),
  quotationId: z.string().nullable().optional().default(null),
  clientId: z.string().nullable().optional().default(null),
  visitId: z.string().nullable().optional().default(null),
  installationId: z.string().nullable().optional().default(null),
  status: workOrderStatusSchema.default('OPEN'),
  priority: z.string().optional().default('NORMAL'),
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  startDate: dateField.nullable().optional().default(null),
  expectedEndDate: dateField.nullable().optional().default(null),
  finishedDate: dateField.nullable().optional().default(null),
  totalValue: z.coerce.number().min(0).default(0),
  notes: z.string().optional().default(''),
  internalNotes: z.string().optional().default(''),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
  createdBy: z.string().optional().default(''),
  updatedBy: z.string().optional().default(''),
  deletedBy: z.string().nullable().optional().default(null),
});
export type WorkOrderSchemaType = z.infer<typeof workOrderSchema>;

export const workOrderFormSchema = workOrderSchema.omit({
  id: true, companyId: true, number: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});
export type WorkOrderFormType = z.infer<typeof workOrderFormSchema>;

export const workOrderItemFormSchema = workOrderItemSchema.omit({
  id: true, workOrderId: true,
});
export type WorkOrderItemFormType = z.infer<typeof workOrderItemFormSchema>;
