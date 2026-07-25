export type TenantStatus = 'active' | 'trial' | 'suspended' | 'cancelled';

export type TenantPlanInterval = 'monthly' | 'quarterly' | 'yearly';

export interface TenantInfo {
  id: string;
  name: string;
  tradeName: string | null;
  document: string | null;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  status: TenantStatus;
  timezone: string;
  language: string;
  currency: string;
  planId: string | null;
  plan: TenantPlanInfo | null;
}

export interface TenantPlanInfo {
  id: string;
  name: string;
  description: string | null;
  price: number;
  usersLimit: number;
  storageLimit: number;
  activeProjectsLimit: number;
  clientsLimit: number;
  integrationsLimit: number;
  aiLimit: boolean;
  pluginsLimit: number;
  features: Record<string, unknown> | null;
}

export interface SubscriptionInfo {
  id: string;
  companyId: string;
  planId: string;
  planName: string;
  status: string;
  startedAt: Date;
  expiresAt: Date | null;
  renewalDate: Date | null;
  paymentMethod: string | null;
}

export interface CompanySettingsInfo {
  id: string;
  companyId: string;
  theme: string;
  primaryColor: string;
  logoDarkUrl: string | null;
  logoLightUrl: string | null;
  faviconUrl: string | null;
  preferences: Record<string, unknown> | null;
}

export interface PlanLimits {
  users: number;
  storage: number;
  activeProjects: number;
  clients: number;
  integrations: number;
  ai: boolean;
  plugins: number;
}

export interface TenantContextData {
  tenant: TenantInfo;
  subscription: SubscriptionInfo | null;
  settings: CompanySettingsInfo | null;
}

export interface TenantMiddlewareResult {
  tenantId: string;
  resolvedBy: 'subdomain' | 'domain' | 'session' | 'default';
}

export interface ResolverOptions {
  subdomain?: string;
  domain?: string;
  sessionTenantId?: string;
}
