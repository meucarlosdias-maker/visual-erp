import { PlatformRepository } from '../repository';
import type { License, PlatformMetric, Announcement, Plan, Company, PlatformUser, PlatformDashboardData } from '../types';
import type { AnnouncementInput, AnnouncementUpdate, PlanInput, PlanUpdate, CompanyInput, CompanyUpdate, PlatformUserInput } from '../schemas';

const repository = new PlatformRepository();

export class PlatformModuleService {
  async getDashboard(): Promise<PlatformDashboardData> { return repository.getDashboard(); }
  async listCompanies(): Promise<Company[]> { return repository.listCompanies(); }
  async getCompany(id: string): Promise<Company | null> { return repository.getCompany(id); }
  async createCompany(input: CompanyInput): Promise<Company> { return repository.createCompany(input); }
  async updateCompany(id: string, input: CompanyUpdate): Promise<Company> { return repository.updateCompany(id, input); }
  async blockCompany(id: string): Promise<Company> { return repository.blockCompany(id); }
  async unblockCompany(id: string): Promise<Company> { return repository.unblockCompany(id); }

  async listPlans(): Promise<Plan[]> { return repository.listPlans(); }
  async getPlan(id: string): Promise<Plan | null> { return repository.getPlan(id); }
  async createPlan(input: PlanInput): Promise<Plan> { return repository.createPlan(input); }
  async updatePlan(id: string, input: PlanUpdate): Promise<Plan> { return repository.updatePlan(id, input); }
  async deletePlan(id: string): Promise<boolean> { return repository.deletePlan(id); }

  async listLicenses(): Promise<License[]> { return repository.listLicenses(); }
  async getLicense(id: string): Promise<License | null> { return repository.getLicense(id); }

  async listMetrics(): Promise<PlatformMetric[]> { return repository.listMetrics(); }
  async listPlatformUsers(): Promise<PlatformUser[]> { return repository.listPlatformUsers(); }
  async createPlatformUser(input: PlatformUserInput): Promise<PlatformUser> { return repository.createPlatformUser(input); }
  async updatePlatformUser(id: string, input: Partial<PlatformUserInput>): Promise<PlatformUser> { return repository.updatePlatformUser(id, input); }

  async listAnnouncements(): Promise<Announcement[]> { return repository.listAnnouncements(); }
  async createAnnouncement(input: AnnouncementInput): Promise<Announcement> { return repository.createAnnouncement(input); }
  async updateAnnouncement(id: string, input: AnnouncementUpdate): Promise<Announcement> { return repository.updateAnnouncement(id, input); }
  async deleteAnnouncement(id: string): Promise<boolean> { return repository.deleteAnnouncement(id); }
}

export const platformModuleService = new PlatformModuleService();
