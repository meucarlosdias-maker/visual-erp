import { z } from 'zod';

export const PlanIntervalEnum = z.enum(['monthly', 'quarterly', 'yearly']);
export const SubscriptionStatusEnum = z.enum(['active', 'trial', 'expired', 'cancelled', 'suspended']);
export const CompanyStatusEnum = z.enum(['active', 'trial', 'suspended', 'cancelled']);

export const CompanyUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  tradeName: z.string().optional(),
  document: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
  status: CompanyStatusEnum.optional(),
});

export const PlanCreateSchema = z.object({
  name: z.string().min(1, 'Nome do plano é obrigatório'),
  description: z.string().optional(),
  price: z.number().min(0).default(0),
  currency: z.string().default('BRL'),
  interval: PlanIntervalEnum.default('monthly'),
  usersLimit: z.number().int().min(1).default(5),
  storageLimit: z.number().int().min(0).default(1024),
  activeProjectsLimit: z.number().int().min(1).default(10),
  clientsLimit: z.number().int().min(1).default(50),
  integrationsLimit: z.number().int().min(0).default(3),
  aiLimit: z.boolean().default(false),
  pluginsLimit: z.number().int().min(0).default(0),
  features: z.record(z.string(), z.unknown()).optional(),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const PlanUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  currency: z.string().optional(),
  interval: PlanIntervalEnum.optional(),
  usersLimit: z.number().int().min(1).optional(),
  storageLimit: z.number().int().min(0).optional(),
  activeProjectsLimit: z.number().int().min(1).optional(),
  clientsLimit: z.number().int().min(1).optional(),
  integrationsLimit: z.number().int().min(0).optional(),
  aiLimit: z.boolean().optional(),
  pluginsLimit: z.number().int().min(0).optional(),
  features: z.record(z.string(), z.unknown()).optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const SubscriptionCreateSchema = z.object({
  companyId: z.string().min(1),
  planId: z.string().min(1),
  status: SubscriptionStatusEnum.default('active'),
  startedAt: z.string().optional(),
  expiresAt: z.string().optional(),
  renewalDate: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const SubscriptionUpdateSchema = z.object({
  planId: z.string().optional(),
  status: SubscriptionStatusEnum.optional(),
  expiresAt: z.string().optional(),
  renewalDate: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const CompanySettingsUpdateSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  primaryColor: z.string().optional(),
  logoDarkUrl: z.string().optional(),
  logoLightUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export type CompanyUpdateInput = z.infer<typeof CompanyUpdateSchema>;
export type PlanCreateInput = z.infer<typeof PlanCreateSchema>;
export type PlanUpdateInput = z.infer<typeof PlanUpdateSchema>;
export type SubscriptionCreateInput = z.infer<typeof SubscriptionCreateSchema>;
export type SubscriptionUpdateInput = z.infer<typeof SubscriptionUpdateSchema>;
export type CompanySettingsUpdateInput = z.infer<typeof CompanySettingsUpdateSchema>;
