import { createLicense, updateLicense, getLicense, getLicenseByCompany, listLicenses, checkLicenseStatus } from '../licensing';
import { listPlans, getPlan, createPlan, updatePlan, deletePlan } from '../billing';
import { recordMetric, getMetric, getMetricsHistory, getAllLatestMetrics } from '../monitoring';
import { listCompanies, getCompany, createCompany, updateCompany, blockCompany, unblockCompany, getActiveCount, getBlockedCount } from '../tenants';
import { listPlatformUsers, getPlatformUser, createPlatformUser, updatePlatformUser, isSuperAdmin, hasPlatformAccess } from '../administration';
import { createAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncement, listAnnouncements, getActiveAnnouncements } from '../announcements';
import type { LicenseDefinition, LicenseStatus, PlanDefinition, PlatformMetricEntry, MetricName, CompanyDefinition, PlatformUserDefinition, AnnouncementDefinition, AnnouncementType, PlatformDashboardData } from '../types';

export class PlatformService {
  listLicenses(filter?: { status?: LicenseStatus; planId?: string }): LicenseDefinition[] { return listLicenses(filter); }
  getLicense(id: string): LicenseDefinition | undefined { return getLicense(id); }
  getLicenseByCompany(companyId: string): LicenseDefinition | undefined { return getLicenseByCompany(companyId); }
  createLicense(input: Parameters<typeof createLicense>[0]): LicenseDefinition { return createLicense(input); }
  updateLicense(id: string, updates: Parameters<typeof updateLicense>[1]): LicenseDefinition | undefined { return updateLicense(id, updates); }
  checkLicenseStatus(license: LicenseDefinition): LicenseStatus { return checkLicenseStatus(license); }

  listPlans(): PlanDefinition[] { return listPlans(); }
  getPlan(id: string): PlanDefinition | undefined { return getPlan(id); }
  createPlan(input: Parameters<typeof createPlan>[0]): PlanDefinition { return createPlan(input); }
  updatePlan(id: string, updates: Parameters<typeof updatePlan>[1]): PlanDefinition | undefined { return updatePlan(id, updates); }
  deletePlan(id: string): boolean { return deletePlan(id); }

  recordMetric(input: Parameters<typeof recordMetric>[0]): PlatformMetricEntry { return recordMetric(input); }
  getMetric(name: MetricName): PlatformMetricEntry | undefined { return getMetric(name); }
  getMetricsHistory(name: MetricName, days?: number): PlatformMetricEntry[] { return getMetricsHistory(name, days); }
  getAllLatestMetrics(): Record<string, number> { return getAllLatestMetrics(); }

  listCompanies(): CompanyDefinition[] { return listCompanies(); }
  getCompany(id: string): CompanyDefinition | undefined { return getCompany(id); }
  createCompany(input: Parameters<typeof createCompany>[0]): CompanyDefinition { return createCompany(input); }
  updateCompany(id: string, updates: Parameters<typeof updateCompany>[1]): CompanyDefinition | undefined { return updateCompany(id, updates); }
  blockCompany(id: string): CompanyDefinition | undefined { return blockCompany(id); }
  unblockCompany(id: string): CompanyDefinition | undefined { return unblockCompany(id); }
  getActiveCount(): number { return getActiveCount(); }
  getBlockedCount(): number { return getBlockedCount(); }

  listPlatformUsers(): PlatformUserDefinition[] { return listPlatformUsers(); }
  getPlatformUser(id: string): PlatformUserDefinition | undefined { return getPlatformUser(id); }
  createPlatformUser(input: Parameters<typeof createPlatformUser>[0]): PlatformUserDefinition { return createPlatformUser(input); }
  updatePlatformUser(id: string, updates: Parameters<typeof updatePlatformUser>[1]): PlatformUserDefinition | undefined { return updatePlatformUser(id, updates); }
  isSuperAdmin(userId: string): boolean { return isSuperAdmin(userId); }
  hasPlatformAccess(userId: string): boolean { return hasPlatformAccess(userId); }

  createAnnouncement(input: Parameters<typeof createAnnouncement>[0]): AnnouncementDefinition { return createAnnouncement(input); }
  updateAnnouncement(id: string, updates: Parameters<typeof updateAnnouncement>[1]): AnnouncementDefinition | undefined { return updateAnnouncement(id, updates); }
  deleteAnnouncement(id: string): boolean { return deleteAnnouncement(id); }
  getAnnouncement(id: string): AnnouncementDefinition | undefined { return getAnnouncement(id); }
  listAnnouncements(filter?: { type?: AnnouncementType; active?: boolean }): AnnouncementDefinition[] { return listAnnouncements(filter); }
  getActiveAnnouncements(): AnnouncementDefinition[] { return getActiveAnnouncements(); }

  getDashboardData(): PlatformDashboardData {
    const metrics = getAllLatestMetrics();
    const companies = listCompanies();
    return {
      activeCompanies: metrics.active_companies ?? 0,
      blockedCompanies: metrics.blocked_companies ?? 0,
      totalUsers: metrics.total_users ?? 0,
      activeProjects: metrics.active_projects ?? 0,
      mrr: metrics.mrr ?? 0,
      storageUsed: metrics.storage_used ?? 0,
      aiUsage: metrics.ai_usage ?? 0,
      apiCalls: metrics.api_calls ?? 0,
      jobsExecuted: metrics.jobs_executed ?? 0,
      avgResponseTime: metrics.avg_response_time ?? 0,
      criticalErrors: metrics.critical_errors ?? 0,
      recentCompanies: companies.slice(0, 5),
      recentAnnouncements: getActiveAnnouncements().slice(0, 3),
    };
  }
}

export const platformService = new PlatformService();
