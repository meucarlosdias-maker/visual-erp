import { z } from 'zod/v4';

export const componentTypeSchema = z.enum([
  'MATERIAL', 'SERVICE', 'LABOR', 'EQUIPMENT',
  'OUTSOURCED', 'TRANSPORT', 'TAX', 'FINISHING', 'CUSTOM',
]);

export type ComponentType = z.infer<typeof componentTypeSchema>;

export const componentSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  componentType: componentTypeSchema.default('MATERIAL'),
  required: z.boolean().default(true),
  sequence: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),

  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  updatedAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  deletedAt: z.instanceof(Date).nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});

export type ComponentSchemaType = z.infer<typeof componentSchema>;

export const componentFormSchema = componentSchema.omit({
  id: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});

export type ComponentFormType = z.infer<typeof componentFormSchema>;
