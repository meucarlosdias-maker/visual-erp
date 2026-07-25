import { z } from 'zod/v4';

const hexColor = /^#[0-9a-fA-F]{6}$/;

export const equipmentCategorySchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  icon: z.string().optional().default(''),
  color: z.string().regex(hexColor, 'Cor inválida').optional().default('#6b7280'),
  sortOrder: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),

  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  updatedAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  deletedAt: z.instanceof(Date).nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});

export type EquipmentCategorySchemaType = z.infer<typeof equipmentCategorySchema>;

export const equipmentCategoryFormSchema = equipmentCategorySchema.omit({
  id: true, companyId: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});

export type EquipmentCategoryFormType = z.infer<typeof equipmentCategoryFormSchema>;
