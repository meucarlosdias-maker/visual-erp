import { z } from 'zod/v4';

export const subcategorySchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  image: z.string().optional().default(''),
  sortOrder: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
  companyId: z.string(),

  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  updatedAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  deletedAt: z.instanceof(Date).nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});

export type SubcategorySchemaType = z.infer<typeof subcategorySchema>;

export const subcategoryFormSchema = subcategorySchema.omit({
  id: true, companyId: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});

export type SubcategoryFormType = z.infer<typeof subcategoryFormSchema>;
