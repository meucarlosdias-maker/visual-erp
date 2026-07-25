import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));

export const calendarEventTypeSchema = z.enum([
  'VISIT', 'MEETING', 'INSTALLATION', 'PRODUCTION', 'DELIVERY',
  'PAYMENT', 'RECEIPT', 'INTERNAL', 'REMINDER', 'OTHER',
]);
export type CalendarEventType = z.infer<typeof calendarEventTypeSchema>;

export const calendarStatusSchema = z.enum([
  'SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED',
]);
export type CalendarStatus = z.infer<typeof calendarStatusSchema>;

export const calendarEventSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  type: calendarEventTypeSchema.default('OTHER'),
  status: calendarStatusSchema.default('SCHEDULED'),
  startDate: dateField,
  endDate: dateField,
  allDay: z.boolean().default(false),
  location: z.string().optional().default(''),
  color: z.string().optional().default(''),
  icon: z.string().optional().default(''),
  clientId: z.string().nullable().optional().default(null),
  leadId: z.string().nullable().optional().default(null),
  projectId: z.string().nullable().optional().default(null),
  workOrderId: z.string().nullable().optional().default(null),
  productionOrderId: z.string().nullable().optional().default(null),
  installationId: z.string().nullable().optional().default(null),
  financialId: z.string().nullable().optional().default(null),
  assignedUserId: z.string().nullable().optional().default(null),
  assignedTeamId: z.string().nullable().optional().default(null),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
  createdBy: z.string().optional().default(''),
  updatedBy: z.string().optional().default(''),
  deletedBy: z.string().nullable().optional().default(null),
});
export type CalendarEventSchemaType = z.infer<typeof calendarEventSchema>;

export const calendarParticipantSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string(),
  required: z.boolean().default(true),
  confirmed: z.boolean().default(false),
});
export type CalendarParticipantSchemaType = z.infer<typeof calendarParticipantSchema>;

export const calendarEventFormSchema = calendarEventSchema.omit({
  id: true, companyId: true, createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});
export type CalendarEventFormType = z.infer<typeof calendarEventFormSchema>;
