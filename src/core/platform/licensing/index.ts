import type { LicenseDefinition, LicenseStatus } from '../types';

const licenses: LicenseDefinition[] = [];

export function createLicense(input: Omit<LicenseDefinition, 'id' | 'createdAt' | 'updatedAt'>): LicenseDefinition {
  const license: LicenseDefinition = { ...input, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
  licenses.push(license);
  return license;
}

export function updateLicense(id: string, updates: Partial<Omit<LicenseDefinition, 'id' | 'createdAt'>>): LicenseDefinition | undefined {
  const idx = licenses.findIndex((l) => l.id === id);
  if (idx === -1) return undefined;
  licenses[idx] = { ...licenses[idx], ...updates, updatedAt: new Date() };
  return licenses[idx];
}

export function getLicense(id: string): LicenseDefinition | undefined {
  return licenses.find((l) => l.id === id);
}

export function getLicenseByCompany(companyId: string): LicenseDefinition | undefined {
  return licenses.find((l) => l.companyId === companyId);
}

export function listLicenses(filter?: { status?: LicenseStatus; planId?: string }): LicenseDefinition[] {
  let result = [...licenses];
  if (filter?.status) result = result.filter((l) => l.status === filter.status);
  if (filter?.planId) result = result.filter((l) => l.planId === filter.planId);
  return result;
}

export function checkLicenseStatus(license: LicenseDefinition): LicenseStatus {
  if (license.status === 'expired') return 'expired';
  if (license.status === 'blocked') return 'blocked';
  if (license.status === 'cancelled') return 'cancelled';
  if (license.expiresAt && license.expiresAt < new Date()) return 'expired';
  return license.status;
}
