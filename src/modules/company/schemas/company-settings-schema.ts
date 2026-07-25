import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));
const hexColor = /^#[0-9a-fA-F]{6}$/;
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const cepRegex = /^\d{5}-\d{3}$/;

const workingDaysSchema = z.array(z.number().min(0).max(6)).default([1, 2, 3, 4, 5]);

export const companySettingsSchema = z.object({
  id: z.string(),
  corporateName: z.string().min(2, 'Razão social deve ter no mínimo 2 caracteres'),
  tradeName: z.string().min(2, 'Nome fantasia deve ter no mínimo 2 caracteres'),
  document: z.string().regex(cnpjRegex, 'CNPJ inválido'),
  stateRegistration: z.string().optional().default(''),
  municipalRegistration: z.string().optional().default(''),

  phone: z.string().regex(phoneRegex, 'Telefone inválido').or(z.literal('')),
  whatsapp: z.string().regex(phoneRegex, 'WhatsApp inválido').or(z.literal('')),
  email: z.string().email('E-mail inválido').or(z.literal('')),
  website: z.string().optional().default(''),

  logo: z.string().optional().default(''),
  favicon: z.string().optional().default(''),
  primaryColor: z.string().regex(hexColor, 'Cor inválida').default('#3b82f6'),
  secondaryColor: z.string().regex(hexColor, 'Cor inválida').default('#1e40af'),

  address: z.string().optional().default(''),
  number: z.string().optional().default(''),
  district: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  zipCode: z.string().regex(cepRegex, 'CEP inválido').or(z.literal('')),
  country: z.string().optional().default('Brasil'),

  timezone: z.string().default('America/Sao_Paulo'),
  currency: z.string().default('BRL'),
  language: z.string().default('pt-BR'),
  decimalPlaces: z.coerce.number().min(0).max(6).default(2),
  measurementUnit: z.string().default('m²'),
  defaultMargin: z.coerce.number().min(0).max(100).default(30),

  workingHoursStart: z.string().default('08:00'),
  workingHoursEnd: z.string().default('18:00'),
  workingDays: workingDaysSchema,

  active: z.boolean().default(true),

  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});
export type CompanySettingsSchemaType = z.infer<typeof companySettingsSchema>;

export const companySettingsFormSchema = companySettingsSchema.omit({
  id: true, createdAt: true, updatedAt: true, deletedAt: true,
  createdBy: true, updatedBy: true, deletedBy: true,
});
export type CompanySettingsFormType = z.infer<typeof companySettingsFormSchema>;

export const companyPreferencesSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  defaultQuotationValidity: z.coerce.number().min(1).default(30),
  defaultPaymentTerm: z.string().default('30 dias'),
  defaultProjectPrefix: z.string().default('PROJ'),
  defaultQuotationPrefix: z.string().default('ORC'),
  defaultWorkOrderPrefix: z.string().default('OS'),
  defaultInvoicePrefix: z.string().default('NF'),
  defaultClientCodePrefix: z.string().default('CLI'),
  defaultSupplierCodePrefix: z.string().default('FOR'),
  defaultProductCodePrefix: z.string().default('PROD'),
  defaultServiceCodePrefix: z.string().default('SERV'),
  allowNegativeStock: z.boolean().default(false),
  automaticProjectCreation: z.boolean().default(false),
  automaticWorkOrderCreation: z.boolean().default(false),
  automaticProductionRelease: z.boolean().default(false),
  automaticFinancialGeneration: z.boolean().default(false),
  createdAt: dateField,
  updatedAt: dateField,
});
export type CompanyPreferencesSchemaType = z.infer<typeof companyPreferencesSchema>;

export const companyPreferencesFormSchema = companyPreferencesSchema.omit({
  id: true, companyId: true, createdAt: true, updatedAt: true,
});
export type CompanyPreferencesFormType = z.infer<typeof companyPreferencesFormSchema>;

export const companySequenceSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  entity: z.string().min(1, 'Entidade é obrigatória'),
  currentNumber: z.coerce.number().min(0).default(0),
  prefix: z.string().optional().default(''),
  suffix: z.string().optional().default(''),
  padding: z.coerce.number().min(1).max(20).default(5),
});
export type CompanySequenceSchemaType = z.infer<typeof companySequenceSchema>;
