import { z } from 'zod';

export const FieldTypeEnum = z.enum([
  'text', 'number', 'currency', 'phone', 'document', 'email', 'password',
  'textarea', 'date', 'time', 'datetime', 'select', 'multiselect',
  'checkbox', 'switch', 'file', 'image', 'signature', 'relation',
]);

export const ValidationRuleEnum = z.enum([
  'required', 'min', 'max', 'regex', 'email', 'url', 'cpf', 'cnpj', 'phone', 'date', 'file', 'image',
]);

export const LayoutComponentTypeEnum = z.enum(['tabs', 'section', 'grid', 'columns', 'card', 'accordion']);

export const FieldOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const ValidationConfigSchema = z.object({
  rule: ValidationRuleEnum,
  value: z.union([z.string(), z.number()]).optional(),
  message: z.string().optional(),
});

export const EntityCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().default('#3b82f6'),
  active: z.boolean().default(true),
});

export const EntityUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  active: z.boolean().optional(),
});

export const FieldCreateSchema = z.object({
  entityId: z.string().min(1),
  name: z.string().min(1, 'Nome do campo é obrigatório'),
  label: z.string().min(1, 'Label é obrigatório'),
  type: FieldTypeEnum,
  required: z.boolean().default(false),
  defaultValue: z.string().optional(),
  options: z.array(FieldOptionSchema).optional(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  order: z.number().default(0),
  validations: z.array(ValidationConfigSchema).default([]),
});

export const FieldUpdateSchema = z.object({
  name: z.string().optional(),
  label: z.string().optional(),
  type: FieldTypeEnum.optional(),
  required: z.boolean().optional(),
  defaultValue: z.string().optional(),
  options: z.array(FieldOptionSchema).optional(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  order: z.number().optional(),
  validations: z.array(ValidationConfigSchema).optional(),
});

export const LayoutComponentSchema: z.ZodType<import('@/core/builder').LayoutComponent> = z.lazy(() => z.object({
  id: z.string(),
  type: LayoutComponentTypeEnum,
  title: z.string().optional(),
  description: z.string().optional(),
  columns: z.number().optional(),
  children: z.array(LayoutComponentSchema).default([]),
  fieldIds: z.array(z.string()).optional(),
  config: z.record(z.string(), z.unknown()).optional(),
}));

export const LayoutCreateSchema = z.object({
  entityId: z.string().min(1),
  name: z.string().min(1, 'Nome é obrigatório'),
  layout: z.array(LayoutComponentSchema).default([]),
  active: z.boolean().default(true),
});

export const LayoutUpdateSchema = z.object({
  name: z.string().optional(),
  layout: z.array(LayoutComponentSchema).optional(),
  active: z.boolean().optional(),
});

export const RecordCreateSchema = z.object({
  entityId: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
});

export const RecordUpdateSchema = z.object({
  data: z.record(z.string(), z.unknown()),
});

export type EntityCreateInput = z.infer<typeof EntityCreateSchema>;
export type EntityUpdateInput = z.infer<typeof EntityUpdateSchema>;
export type FieldCreateInput = z.infer<typeof FieldCreateSchema>;
export type FieldUpdateInput = z.infer<typeof FieldUpdateSchema>;
export type LayoutCreateInput = z.infer<typeof LayoutCreateSchema>;
export type LayoutUpdateInput = z.infer<typeof LayoutUpdateSchema>;
export type RecordCreateInput = z.infer<typeof RecordCreateSchema>;
export type RecordUpdateInput = z.infer<typeof RecordUpdateSchema>;
