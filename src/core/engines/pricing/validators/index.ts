import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));

export const pricingRequestSchema = z.object({
  serviceId: z.string().min(1, 'ID do serviço é obrigatório'),
  companyId: z.string().min(1, 'ID da empresa é obrigatório'),
  quantity: z.coerce.number().positive('Quantidade deve ser maior que zero'),
  variables: z.record(z.string(), z.coerce.number()).default({}),
  selectedComponents: z.array(z.string()).min(1, 'Selecione pelo menos um componente'),
});

export type PricingRequestType = z.infer<typeof pricingRequestSchema>;

export const pricingDetailSchema = z.object({
  componentId: z.string(),
  componentName: z.string(),
  category: z.enum(['MATERIAL', 'LABOR', 'EQUIPMENT', 'OUTSOURCED', 'TRANSPORT', 'TAX']),
  quantity: z.number(),
  unit: z.string(),
  unitCost: z.number(),
  totalCost: z.number(),
});

export type PricingDetailType = z.infer<typeof pricingDetailSchema>;

export const pricingResultSchema = z.object({
  serviceId: z.string(),
  companyId: z.string(),
  materialCost: z.number(),
  laborCost: z.number(),
  equipmentCost: z.number(),
  outsourcedCost: z.number(),
  transportCost: z.number(),
  taxCost: z.number(),
  subtotal: z.number(),
  margin: z.number(),
  salePrice: z.number(),
  details: z.array(pricingDetailSchema),
  calculatedAt: dateField,
});

export type PricingResultType = z.infer<typeof pricingResultSchema>;
