import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));

export const quotationStatusSchema = z.enum([
  'DRAFT', 'PENDING', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED',
]);
export type QuotationStatus = z.infer<typeof quotationStatusSchema>;

export const discountTypeSchema = z.enum(['PERCENTAGE', 'VALUE']);
export type DiscountType = z.infer<typeof discountTypeSchema>;

export const quotationItemSchema = z.object({
  id: z.string(),
  quotationId: z.string(),
  serviceId: z.string().nullable().optional().default(null),
  description: z.string().min(1, 'Descrição é obrigatória'),
  quantity: z.coerce.number().min(0, 'Quantidade deve ser maior ou igual a zero'),
  unit: z.string().default('UN'),
  unitPrice: z.coerce.number().min(0).default(0),
  totalPrice: z.coerce.number().min(0).default(0),
  pricingSnapshot: z.record(z.string(), z.unknown()).nullable().optional().default(null),
  sortOrder: z.coerce.number().int().min(0).default(0),
});
export type QuotationItemSchemaType = z.infer<typeof quotationItemSchema>;

export const quotationSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  clientId: z.string().nullable().optional().default(null),
  number: z.string().min(1, 'Número é obrigatório'),
  version: z.coerce.number().int().min(1).default(1),
  status: quotationStatusSchema.default('DRAFT'),
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  validUntil: dateField.nullable().optional().default(null),
  subtotal: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  discountType: discountTypeSchema.nullable().optional().default(null),
  total: z.coerce.number().min(0).default(0),
  notes: z.string().optional().default(''),
  internalNotes: z.string().optional().default(''),
  items: z.array(quotationItemSchema).default([]),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: z.instanceof(Date).nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});
export type QuotationSchemaType = z.infer<typeof quotationSchema>;

export const quotationFormSchema = quotationSchema.omit({
  id: true, companyId: true, number: true, version: true,
  items: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});
export type QuotationFormType = z.infer<typeof quotationFormSchema>;

export const quotationCreateSchema = z.object({
  clientId: z.string().nullable().optional().default(null),
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  validUntil: z.string().nullable().optional().default(null),
  subtotal: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  discountType: discountTypeSchema.nullable().optional().default(null),
  total: z.coerce.number().min(0).default(0),
  notes: z.string().optional().default(''),
  internalNotes: z.string().optional().default(''),
  items: z.array(z.object({
    serviceId: z.string().nullable().optional().default(null),
    description: z.string().min(1, 'Descrição é obrigatória'),
    quantity: z.coerce.number().min(0).default(1),
    unit: z.string().default('UN'),
    unitPrice: z.coerce.number().min(0).default(0),
    totalPrice: z.coerce.number().min(0).default(0),
    pricingSnapshot: z.record(z.string(), z.unknown()).nullable().optional().default(null),
    sortOrder: z.coerce.number().int().min(0).default(0),
  })).default([]),
});
export type QuotationCreateType = z.infer<typeof quotationCreateSchema>;

export const quotationItemFormSchema = z.object({
  serviceId: z.string().nullable().optional().default(null),
  description: z.string().min(1, 'Descrição é obrigatória'),
  quantity: z.coerce.number().min(0).default(1),
  unit: z.string().default('UN'),
  unitPrice: z.coerce.number().min(0).default(0),
  pricingSnapshot: z.record(z.string(), z.unknown()).nullable().optional().default(null),
});
