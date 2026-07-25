import type { TenantPlanInfo, SubscriptionInfo, CompanySettingsInfo } from '@/core/tenant';

export interface CompanyFormData {
  name: string;
  tradeName: string;
  document: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  currency: string;
}

export interface PlanFormData {
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'quarterly' | 'yearly';
  usersLimit: number;
  storageLimit: number;
  activeProjectsLimit: number;
  clientsLimit: number;
  integrationsLimit: number;
  aiLimit: boolean;
  pluginsLimit: number;
}

export interface SubscriptionFormData {
  planId: string;
  status: string;
  paymentMethod: string;
}

export interface CompanySettingsFormData {
  theme: string;
  primaryColor: string;
  logoDarkUrl: string;
  logoLightUrl: string;
  faviconUrl: string;
}

export interface TenantDashboardData {
  company: CompanyFormData;
  plan: TenantPlanInfo | null;
  subscription: SubscriptionInfo | null;
  settings: CompanySettingsInfo | null;
  usage: {
    users: number;
    activeProjects: number;
    clients: number;
    storage: number;
  };
}
