export type PlatformUserRole = 'super_admin' | 'admin' | 'support' | 'billing';

export type LicenseStatus = 'active' | 'trial' | 'expired' | 'blocked' | 'cancelled';

export type AnnouncementType = 'info' | 'maintenance' | 'update' | 'urgent';

export type MetricName =
  | 'active_companies' | 'blocked_companies' | 'total_users'
  | 'active_projects' | 'mrr' | 'storage_used'
  | 'ai_usage' | 'api_calls' | 'jobs_executed'
  | 'avg_response_time' | 'critical_errors';

export interface PlatformUserDefinition {
  id: string;
  name: string;
  email: string;
  role: PlatformUserRole;
  active: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LicenseDefinition {
  id: string;
  companyId: string;
  planId: string;
  planName: string;
  status: LicenseStatus;
  expiresAt: Date | null;
  maxUsers: number;
  maxStorage: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformMetricEntry {
  id: string;
  metric: MetricName;
  value: number;
  referenceDate: Date;
  createdAt: Date;
}

export interface AnnouncementDefinition {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  startsAt: Date | null;
  endsAt: Date | null;
  active: boolean;
  createdAt: Date;
}

export interface PlanDefinition {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  limits: {
    users: number;
    storage: number;
    apiCalls: number;
    aiCredits: number;
    integrations: number;
    plugins: boolean;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyDefinition {
  id: string;
  name: string;
  slug: string;
  document: string | null;
  email: string | null;
  phone: string | null;
  status: 'active' | 'blocked' | 'suspended' | 'trial';
  planId: string | null;
  usersCount: number;
  projectsCount: number;
  storageUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformDashboardData {
  activeCompanies: number;
  blockedCompanies: number;
  totalUsers: number;
  activeProjects: number;
  mrr: number;
  storageUsed: number;
  aiUsage: number;
  apiCalls: number;
  jobsExecuted: number;
  avgResponseTime: number;
  criticalErrors: number;
  recentCompanies: CompanyDefinition[];
  recentAnnouncements: AnnouncementDefinition[];
}
