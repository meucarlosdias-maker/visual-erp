import { z } from 'zod/v4';

export const platformUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  role: z.enum(['super_admin', 'admin', 'support', 'billing']).default('admin'),
  active: z.boolean().default(true),
});

export type PlatformUserInput = z.infer<typeof platformUserSchema>;

export const licenseSchema = z.object({
  companyId: z.string(),
  planId: z.string(),
  planName: z.string(),
  status: z.enum(['active', 'trial', 'expired', 'blocked', 'cancelled']).default('active'),
  expiresAt: z.string().nullable().optional(),
  maxUsers: z.number().int().min(1).default(10),
  maxStorage: z.number().int().min(1).default(1024),
  features: z.array(z.string()).default([]),
});

export type LicenseInput = z.infer<typeof licenseSchema>;

export const metricSchema = z.object({
  metric: z.string(),
  value: z.number(),
  referenceDate: z.string(),
});

export type MetricInput = z.infer<typeof metricSchema>;

export const announcementSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
  type: z.enum(['info', 'maintenance', 'update', 'urgent']).default('info'),
  startsAt: z.string().nullable().optional(),
  endsAt: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

export const announcementUpdateSchema = announcementSchema.partial();
export type AnnouncementUpdate = z.infer<typeof announcementUpdateSchema>;

export const planSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  description: z.string(),
  features: z.array(z.string()).default([]),
  limits: z.object({
    users: z.number().int().min(1),
    storage: z.number().int().min(1),
    apiCalls: z.number().int().min(0),
    aiCredits: z.number().int().min(0),
    integrations: z.number().int().min(0),
    plugins: z.boolean().default(false),
  }),
  active: z.boolean().default(true),
});

export type PlanInput = z.infer<typeof planSchema>;

export const planUpdateSchema = planSchema.partial();
export type PlanUpdate = z.infer<typeof planUpdateSchema>;

export const companySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  document: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  status: z.enum(['active', 'blocked', 'suspended', 'trial']).default('active'),
  planId: z.string().nullable().optional(),
});

export type CompanyInput = z.infer<typeof companySchema>;

export const companyUpdateSchema = companySchema.partial();
export type CompanyUpdate = z.infer<typeof companyUpdateSchema>;
