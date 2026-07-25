import { z } from 'zod/v4';

export const teamSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  hourCost: z.coerce.number().positive('Custo hora deve ser maior que zero'),
  dailyCost: z.coerce.number().min(0).default(0),
  defaultMargin: z.coerce.number().min(0).max(100).default(0),
  active: z.boolean().default(true),

  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  updatedAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  deletedAt: z.instanceof(Date).nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});

export type TeamSchemaType = z.infer<typeof teamSchema>;

export const teamFormSchema = teamSchema.omit({
  id: true, companyId: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});

export type TeamFormType = z.infer<typeof teamFormSchema>;
