import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));

export const installationStatusSchema = z.enum([
  'PLANNING', 'SCHEDULED', 'ON_ROUTE', 'IN_PROGRESS',
  'PAUSED', 'FINISHED', 'DELIVERED', 'CANCELLED',
]);
export type InstallationStatus = z.infer<typeof installationStatusSchema>;

export const installationEquipmentSchema = z.object({
  id: z.string(),
  installationId: z.string(),
  equipmentId: z.string(),
  quantity: z.coerce.number().int().min(1).default(1),
});
export type InstallationEquipmentSchemaType = z.infer<typeof installationEquipmentSchema>;

export const installationVehicleSchema = z.object({
  id: z.string(),
  installationId: z.string(),
  vehicle: z.string().min(1, 'Veículo é obrigatório'),
  driver: z.string().optional().default(''),
  plate: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});
export type InstallationVehicleSchemaType = z.infer<typeof installationVehicleSchema>;

export const installationTeamSchema = z.object({
  id: z.string(),
  installationId: z.string(),
  teamId: z.string(),
  leaderId: z.string().nullable().optional().default(null),
  estimatedHours: z.coerce.number().min(0).nullable().optional().default(null),
  actualHours: z.coerce.number().min(0).nullable().optional().default(null),
});
export type InstallationTeamSchemaType = z.infer<typeof installationTeamSchema>;

export const installationSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  clientId: z.string().nullable().optional().default(null),
  number: z.string().min(1, 'Número é obrigatório'),
  status: installationStatusSchema.default('PLANNING'),
  scheduledDate: dateField.nullable().optional().default(null),
  startDate: dateField.nullable().optional().default(null),
  endDate: dateField.nullable().optional().default(null),
  address: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  zipCode: z.string().optional().default(''),
  latitude: z.string().nullable().optional().default(null),
  longitude: z.string().nullable().optional().default(null),
  contactName: z.string().optional().default(''),
  contactPhone: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  teams: z.array(installationTeamSchema).default([]),
  equipments: z.array(installationEquipmentSchema).default([]),
  vehicles: z.array(installationVehicleSchema).default([]),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});
export type InstallationSchemaType = z.infer<typeof installationSchema>;

export const installationFormSchema = installationSchema.omit({
  id: true, projectId: true, number: true,
  teams: true, equipments: true, vehicles: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});
export type InstallationFormType = z.infer<typeof installationFormSchema>;
