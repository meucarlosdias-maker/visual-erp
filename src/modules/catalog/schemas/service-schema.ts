import { z } from 'zod/v4';
import type { ComponentSchemaType } from './component-schema';

export const serviceSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  subcategoryId: z.string().nullable().optional().default(null),
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  image: z.string().optional().default(''),
  version: z.string().default('1.0.0'),
  averageProductionTime: z.number().positive().nullable().optional().default(null),
  requiresVisit: z.boolean().default(false),
  requiresApproval: z.boolean().default(false),
  requiresArt: z.boolean().default(false),
  hasPrinting: z.boolean().default(false),
  hasInstallation: z.boolean().default(false),
  hasPainting: z.boolean().default(false),
  hasTransport: z.boolean().default(false),
  defaultMargin: z.number().min(0).max(100).default(0),
  minimumMargin: z.number().min(0).max(100).default(0),
  maximumMargin: z.number().min(0).max(100).default(100),
  commission: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  markup: z.number().min(0).default(0),
  minimumCost: z.number().min(0).default(0),
  active: z.boolean().default(true),
  companyId: z.string(),

  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  updatedAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  deletedAt: z.instanceof(Date).nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});

export type ServiceSchemaType = z.infer<typeof serviceSchema>;

export const serviceFormSchema = serviceSchema.omit({
  id: true, companyId: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});

export type ServiceFormType = z.infer<typeof serviceFormSchema>;

export interface ServiceWithComponents extends ServiceSchemaType {
  components?: ComponentSchemaType[];
}
