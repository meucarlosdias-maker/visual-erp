import { z } from 'zod/v4';

export const equipmentCostTypeSchema = z.enum([
  'HOUR', 'DAY', 'KM', 'UNIT', 'MONTH',
]);

export type EquipmentCostType = z.infer<typeof equipmentCostTypeSchema>;

export const EQUIPMENT_COST_LABELS: Record<string, string> = {
  HOUR: 'Hora',
  DAY: 'Diária',
  KM: 'Quilômetro',
  UNIT: 'Unidade',
  MONTH: 'Mês',
};

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date())).nullable().optional().default(null);

export const equipmentSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  costType: equipmentCostTypeSchema.default('HOUR'),
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  brand: z.string().optional().default(''),
  model: z.string().optional().default(''),
  serialNumber: z.string().optional().default(''),
  patrimonyNumber: z.string().optional().default(''),
  supplier: z.string().optional().default(''),
  purchaseDate: dateField,
  purchaseValue: z.coerce.number().min(0).default(0),
  residualValue: z.coerce.number().min(0).default(0),
  hourCost: z.coerce.number().min(0).default(0),
  dailyCost: z.coerce.number().min(0).default(0),
  kmCost: z.coerce.number().min(0).default(0),
  monthlyCost: z.coerce.number().min(0).default(0),
  fuelConsumption: z.coerce.number().min(0).nullable().optional().default(null),
  capacity: z.coerce.number().min(0).nullable().optional().default(null),
  unit: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  active: z.boolean().default(true),

  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  updatedAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  deletedAt: z.instanceof(Date).nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});

export type EquipmentSchemaType = z.infer<typeof equipmentSchema>;

export const equipmentFormSchema = equipmentSchema.omit({
  id: true, companyId: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});

export type EquipmentFormType = z.infer<typeof equipmentFormSchema>;
