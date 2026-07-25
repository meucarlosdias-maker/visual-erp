'use client';

import { platformModuleService } from '../services';
import type { AnnouncementInput, AnnouncementUpdate, PlanInput, PlanUpdate, CompanyInput, CompanyUpdate, PlatformUserInput } from '../schemas';

export async function getDashboard() { return platformModuleService.getDashboard(); }
export async function listCompanies() { return platformModuleService.listCompanies(); }
export async function getCompany(id: string) { return platformModuleService.getCompany(id); }
export async function createCompany(input: CompanyInput) { return platformModuleService.createCompany(input); }
export async function updateCompany(id: string, input: CompanyUpdate) { return platformModuleService.updateCompany(id, input); }
export async function blockCompany(id: string) { return platformModuleService.blockCompany(id); }
export async function unblockCompany(id: string) { return platformModuleService.unblockCompany(id); }
export async function listPlans() { return platformModuleService.listPlans(); }
export async function getPlan(id: string) { return platformModuleService.getPlan(id); }
export async function createPlan(input: PlanInput) { return platformModuleService.createPlan(input); }
export async function updatePlan(id: string, input: PlanUpdate) { return platformModuleService.updatePlan(id, input); }
export async function deletePlan(id: string) { return platformModuleService.deletePlan(id); }
export async function listLicenses() { return platformModuleService.listLicenses(); }
export async function getLicense(id: string) { return platformModuleService.getLicense(id); }
export async function listMetrics() { return platformModuleService.listMetrics(); }
export async function listPlatformUsers() { return platformModuleService.listPlatformUsers(); }
export async function createPlatformUser(input: PlatformUserInput) { return platformModuleService.createPlatformUser(input); }
export async function updatePlatformUser(id: string, input: Partial<PlatformUserInput>) { return platformModuleService.updatePlatformUser(id, input); }
export async function listAnnouncements() { return platformModuleService.listAnnouncements(); }
export async function createAnnouncement(input: AnnouncementInput) { return platformModuleService.createAnnouncement(input); }
export async function updateAnnouncement(id: string, input: AnnouncementUpdate) { return platformModuleService.updateAnnouncement(id, input); }
export async function deleteAnnouncement(id: string) { return platformModuleService.deleteAnnouncement(id); }
