import type { PlatformUserRole, LicenseStatus, AnnouncementType, MetricName } from '@/core/platform';

export interface PlatformUser {
  id: string; name: string; email: string; role: PlatformUserRole;
  active: boolean; lastLogin: Date | null; createdAt: Date; updatedAt: Date;
}

export interface License {
  id: string; companyId: string; planId: string; planName: string;
  status: LicenseStatus; expiresAt: Date | null; maxUsers: number;
  maxStorage: number; features: string[]; createdAt: Date; updatedAt: Date;
}

export interface PlatformMetric {
  id: string; metric: MetricName; value: number; referenceDate: Date; createdAt: Date;
}

export interface Announcement {
  id: string; title: string; message: string; type: AnnouncementType;
  startsAt: Date | null; endsAt: Date | null; active: boolean; createdAt: Date;
}

export interface Plan {
  id: string; name: string; price: number; description: string;
  features: string[]; limits: { users: number; storage: number; apiCalls: number; aiCredits: number; integrations: number; plugins: boolean };
  active: boolean; createdAt: Date; updatedAt: Date;
}

export interface Company {
  id: string; name: string; slug: string; document: string | null;
  email: string | null; phone: string | null;
  status: 'active' | 'blocked' | 'suspended' | 'trial';
  planId: string | null; usersCount: number; projectsCount: number;
  storageUsed: number; createdAt: Date; updatedAt: Date;
}

export interface PlatformDashboardData {
  activeCompanies: number; blockedCompanies: number; totalUsers: number;
  activeProjects: number; mrr: number; storageUsed: number;
  aiUsage: number; apiCalls: number; jobsExecuted: number;
  avgResponseTime: number; criticalErrors: number;
  recentCompanies: Company[]; recentAnnouncements: Announcement[];
}

export const LICENSE_STATUS_LABELS: Record<LicenseStatus, string> = {
  active: 'Ativa', trial: 'Trial', expired: 'Expirada', blocked: 'Bloqueada', cancelled: 'Cancelada',
};

export const ANNOUNCEMENT_TYPE_LABELS: Record<AnnouncementType, string> = {
  info: 'Informativo', maintenance: 'Manutenção', update: 'Atualização', urgent: 'Urgente',
};

export const METRIC_LABELS: Record<string, string> = {
  active_companies: 'Empresas Ativas', blocked_companies: 'Empresas Bloqueadas',
  total_users: 'Usuários Totais', active_projects: 'Projetos Ativos',
  mrr: 'Receita Recorrente', storage_used: 'Storage Usado',
  ai_usage: 'Consumo de IA', api_calls: 'Chamadas de API',
  jobs_executed: 'Jobs Executados', avg_response_time: 'Tempo Médio Resposta',
  critical_errors: 'Erros Críticos',
};
