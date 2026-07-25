import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));

export const leadStatusSchema = z.enum([
  'NEW', 'CONTACTED', 'QUALIFIED', 'VISIT_SCHEDULED', 'VISITED',
  'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'ARCHIVED',
]);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const leadTemperatureSchema = z.enum(['COLD', 'WARM', 'HOT']);
export type LeadTemperature = z.infer<typeof leadTemperatureSchema>;

export const activityTypeSchema = z.enum([
  'CALL', 'EMAIL', 'WHATSAPP', 'MEETING', 'VISIT', 'NOTE',
]);
export type ActivityType = z.infer<typeof activityTypeSchema>;

export const visitStatusSchema = z.enum([
  'SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED',
]);
export type VisitStatus = z.infer<typeof visitStatusSchema>;

export const leadSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  number: z.string().min(1, 'Número é obrigatório'),
  origin: z.string().optional().default(''),
  status: leadStatusSchema.default('NEW'),
  temperature: leadTemperatureSchema.default('COLD'),
  companyName: z.string().optional().default(''),
  contactName: z.string().min(2, 'Nome do contato é obrigatório'),
  phone: z.string().optional().default(''),
  email: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  assignedUserId: z.string().nullable().optional().default(null),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
  createdBy: z.string().optional().default(''),
  updatedBy: z.string().optional().default(''),
  deletedBy: z.string().nullable().optional().default(null),
});
export type LeadSchemaType = z.infer<typeof leadSchema>;

export const leadActivitySchema = z.object({
  id: z.string(),
  leadId: z.string(),
  type: activityTypeSchema,
  description: z.string().min(1, 'Descrição é obrigatória'),
  scheduledAt: dateField.nullable().optional().default(null),
  completedAt: dateField.nullable().optional().default(null),
  userId: z.string().optional().default(''),
  createdAt: dateField,
});
export type LeadActivitySchemaType = z.infer<typeof leadActivitySchema>;

export const measurementSchema = z.object({
  id: z.string(),
  width: z.coerce.number().min(0).default(0),
  height: z.coerce.number().min(0).default(0),
  quantity: z.coerce.number().min(1).default(1),
  unit: z.string().optional().default('m'),
  notes: z.string().optional().default(''),
});
export type MeasurementSchemaType = z.infer<typeof measurementSchema>;

export const visitSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  clientId: z.string().nullable().optional().default(null),
  sellerId: z.string().optional().default(''),
  status: visitStatusSchema.default('SCHEDULED'),
  scheduledDate: dateField,
  startDate: dateField.nullable().optional().default(null),
  endDate: dateField.nullable().optional().default(null),
  address: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  zipCode: z.string().optional().default(''),
  contactName: z.string().optional().default(''),
  contactPhone: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  measurements: z.array(measurementSchema).optional().default([]),
  collectedInfo: z.string().optional().default(''),
  createdAt: dateField,
  updatedAt: dateField,
});
export type VisitSchemaType = z.infer<typeof visitSchema>;

export const visitAttachmentSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  fileName: z.string().min(1, 'Nome do arquivo é obrigatório'),
  fileUrl: z.string().optional().default(''),
  type: z.string().optional().default(''),
  createdAt: dateField,
});
export type VisitAttachmentSchemaType = z.infer<typeof visitAttachmentSchema>;

export const leadFormSchema = leadSchema.omit({
  id: true, companyId: true, number: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});
export type LeadFormType = z.infer<typeof leadFormSchema>;

export const leadActivityFormSchema = leadActivitySchema.omit({
  id: true, createdAt: true,
});
export type LeadActivityFormType = z.infer<typeof leadActivityFormSchema>;

export const visitFormSchema = visitSchema.omit({
  id: true, createdAt: true, updatedAt: true,
});
export type VisitFormType = z.infer<typeof visitFormSchema>;
