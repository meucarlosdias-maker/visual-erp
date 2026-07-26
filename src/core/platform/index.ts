export type { PlatformUserRole, LicenseStatus, AnnouncementType, MetricName, PlatformUserDefinition, LicenseDefinition, PlatformMetricEntry, AnnouncementDefinition, PlanDefinition, CompanyDefinition, PlatformDashboardData } from './types';
export { PlatformService, platformService } from './services';
export { createLicense, updateLicense, getLicense, getLicenseByCompany, listLicenses, checkLicenseStatus } from './licensing';
export { listPlans, getPlan, createPlan, updatePlan, deletePlan } from './billing';
export { recordMetric, getMetric, getMetricsHistory, getAllLatestMetrics } from './monitoring';
export { listCompanies, getCompany, createCompany, updateCompany, blockCompany, unblockCompany, getActiveCount, getBlockedCount } from './tenants';
export { listPlatformUsers, getPlatformUser, getPlatformUserByEmail, createPlatformUser, updatePlatformUser, isSuperAdmin, hasPlatformAccess } from './administration';
export { createAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncement, listAnnouncements, getActiveAnnouncements } from './announcements';
