import { z } from 'zod/v4';

export const teamProductivitySchema = z.object({
  id: z.string(),
  companyId: z.string(),
  teamId: z.string(),
  serviceType: z.string().min(1, 'Tipo de serviço é obrigatório'),
  unit: z.string().optional().default(''),
  productionPerHour: z.coerce.number().positive('Produção por hora deve ser maior que zero'),
  installationPerHour: z.coerce.number().positive('Instalação por hora deve ser maior que zero'),

  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  updatedAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
});

export type TeamProductivitySchemaType = z.infer<typeof teamProductivitySchema>;

export const teamProductivityFormSchema = teamProductivitySchema.omit({
  id: true, companyId: true,
  createdAt: true, updatedAt: true,
});

export type TeamProductivityFormType = z.infer<typeof teamProductivityFormSchema>;
