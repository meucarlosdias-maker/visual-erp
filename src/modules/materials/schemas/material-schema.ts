import { z } from 'zod/v4';

export const unitOfMeasureSchema = z.enum([
  'UN', 'M2', 'M', 'CM', 'MM', 'KG', 'G', 'L', 'ML',
  'ROLO', 'CHAPA', 'CAIXA', 'PACOTE', 'KIT',
]);

export type UnitOfMeasure = z.infer<typeof unitOfMeasureSchema>;

export const UNIT_LABELS: Record<string, string> = {
  UN: 'Unidade',
  M2: 'Metro Quadrado',
  M: 'Metro',
  CM: 'Centímetro',
  MM: 'Milímetro',
  KG: 'Quilograma',
  G: 'Grama',
  L: 'Litro',
  ML: 'Mililitro',
  ROLO: 'Rolo',
  CHAPA: 'Chapa',
  CAIXA: 'Caixa',
  PACOTE: 'Pacote',
  KIT: 'Kit',
};

export const materialSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  brand: z.string().optional().default(''),
  manufacturer: z.string().optional().default(''),
  supplier: z.string().optional().default(''),
  unit: unitOfMeasureSchema,
  cost: z.coerce.number().positive('Custo deve ser maior que zero'),
  salePrice: z.coerce.number().min(0).default(0),
  lossPercent: z.coerce.number().min(0).max(100, 'Perda deve estar entre 0 e 100').default(0),
  minimumStock: z.coerce.number().int().min(0).default(0),
  currentStock: z.coerce.number().int().min(0).default(0),
  weight: z.coerce.number().min(0).nullable().optional().default(null),
  width: z.coerce.number().min(0).nullable().optional().default(null),
  height: z.coerce.number().min(0).nullable().optional().default(null),
  thickness: z.coerce.number().min(0).nullable().optional().default(null),
  color: z.string().optional().default(''),
  reference: z.string().optional().default(''),
  barcode: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  active: z.boolean().default(true),
  companyId: z.string(),

  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  updatedAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  deletedAt: z.instanceof(Date).nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});

export type MaterialSchemaType = z.infer<typeof materialSchema>;

export const materialFormSchema = materialSchema.omit({
  id: true, companyId: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});

export type MaterialFormType = z.infer<typeof materialFormSchema>;
