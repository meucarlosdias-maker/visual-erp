import { platformService } from '@/core/platform';
import type { License, PlatformMetric, Announcement, Plan, Company, PlatformUser, PlatformDashboardData } from '../types';
import type { AnnouncementInput, AnnouncementUpdate, PlanInput, PlanUpdate, CompanyInput, CompanyUpdate, PlatformUserInput } from '../schemas';

export class PlatformRepository {
  async getDashboard(): Promise<PlatformDashboardData> {
    const data = platformService.getDashboardData();
    return {
      activeCompanies: data.activeCompanies, blockedCompanies: data.blockedCompanies,
      totalUsers: data.totalUsers, activeProjects: data.activeProjects,
      mrr: data.mrr, storageUsed: data.storageUsed, aiUsage: data.aiUsage,
      apiCalls: data.apiCalls, jobsExecuted: data.jobsExecuted,
      avgResponseTime: data.avgResponseTime, criticalErrors: data.criticalErrors,
      recentCompanies: data.recentCompanies.map((c) => ({ ...c })) as Company[],
      recentAnnouncements: data.recentAnnouncements.map((a) => ({ ...a })) as Announcement[],
    };
  }

  async listCompanies(): Promise<Company[]> { return platformService.listCompanies().map((c) => ({ ...c })) as Company[]; }
  async getCompany(id: string): Promise<Company | null> { const c = platformService.getCompany(id); return c ? { ...c } as Company : null; }
  async createCompany(input: CompanyInput): Promise<Company> {
    const c = platformService.createCompany({ ...input, document: input.document ?? null, email: input.email ?? null, phone: input.phone ?? null, planId: input.planId ?? null, usersCount: 0, projectsCount: 0, storageUsed: 0 }); return { ...c } as Company;
  }
  async updateCompany(id: string, input: CompanyUpdate): Promise<Company> {
    const c = platformService.updateCompany(id, input); if (!c) throw new Error('Empresa não encontrada'); return { ...c } as Company;
  }
  async blockCompany(id: string): Promise<Company> { const c = platformService.blockCompany(id); if (!c) throw new Error('Empresa não encontrada'); return { ...c } as Company; }
  async unblockCompany(id: string): Promise<Company> { const c = platformService.unblockCompany(id); if (!c) throw new Error('Empresa não encontrada'); return { ...c } as Company; }

  async listPlans(): Promise<Plan[]> { return platformService.listPlans().map((p) => ({ ...p })) as Plan[]; }
  async getPlan(id: string): Promise<Plan | null> { const p = platformService.getPlan(id); return p ? { ...p } as Plan : null; }
  async createPlan(input: PlanInput): Promise<Plan> { const p = platformService.createPlan(input); return { ...p } as Plan; }
  async updatePlan(id: string, input: PlanUpdate): Promise<Plan> { const p = platformService.updatePlan(id, input); if (!p) throw new Error('Plano não encontrado'); return { ...p } as Plan; }
  async deletePlan(id: string): Promise<boolean> { return platformService.deletePlan(id); }

  async listLicenses(): Promise<License[]> { return platformService.listLicenses().map((l) => ({ ...l })) as License[]; }
  async getLicense(id: string): Promise<License | null> { const l = platformService.getLicense(id); return l ? { ...l } as License : null; }

  async listMetrics(): Promise<PlatformMetric[]> {
    const data = platformService.getAllLatestMetrics();
    return Object.entries(data).map(([metric, value]) => ({ id: `met-${metric}`, metric: metric as PlatformMetric['metric'], value, referenceDate: new Date(), createdAt: new Date() }));
  }

  async listPlatformUsers(): Promise<PlatformUser[]> { return platformService.listPlatformUsers().map((u) => ({ ...u })) as PlatformUser[]; }
  async createPlatformUser(input: PlatformUserInput): Promise<PlatformUser> { const u = platformService.createPlatformUser({ ...input, lastLogin: null }); return { ...u } as PlatformUser; }
  async updatePlatformUser(id: string, input: Partial<PlatformUserInput>): Promise<PlatformUser> { const u = platformService.updatePlatformUser(id, input); if (!u) throw new Error('Usuário não encontrado'); return { ...u } as PlatformUser; }

  async listAnnouncements(): Promise<Announcement[]> { return platformService.listAnnouncements().map((a) => ({ ...a })) as Announcement[]; }
  async createAnnouncement(input: AnnouncementInput): Promise<Announcement> {
    const a = platformService.createAnnouncement({ ...input, startsAt: input.startsAt ? new Date(input.startsAt) : null, endsAt: input.endsAt ? new Date(input.endsAt) : null }); return { ...a } as Announcement;
  }
  async updateAnnouncement(id: string, input: AnnouncementUpdate): Promise<Announcement> {
    const a = platformService.updateAnnouncement(id, { ...input, startsAt: input.startsAt ? new Date(input.startsAt) : undefined, endsAt: input.endsAt ? new Date(input.endsAt) : undefined }); if (!a) throw new Error('Aviso não encontrado'); return { ...a } as Announcement;
  }
  async deleteAnnouncement(id: string): Promise<boolean> { return platformService.deleteAnnouncement(id); }
}
