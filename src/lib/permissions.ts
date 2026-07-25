import { companyRolePermissions, platformRolePermissions } from '@/config/permissions';

function normalizePermission(perm: string): string {
  return perm.replace(':', '.');
}

function matchPermission(pattern: string, target: string): boolean {
  if (pattern === '*') return true;
  const normalizedPattern = normalizePermission(pattern);
  const normalizedTarget = normalizePermission(target);
  if (normalizedPattern === normalizedTarget) return true;
  if (normalizedPattern.endsWith('.*')) {
    const prefix = normalizedPattern.slice(0, -2);
    return normalizedTarget.startsWith(prefix + '.');
  }
  return false;
}

export function getCompanyUserPermissions(role?: string): string[] {
  if (!role) return [];
  const mapping = companyRolePermissions.find((rp) => rp.role === role);
  if (!mapping) return [];
  return mapping.permissions;
}

export function getPlatformUserPermissions(role?: string): string[] {
  if (!role) return [];
  const mapping = platformRolePermissions.find((rp) => rp.role === role);
  if (!mapping) return [];
  return mapping.permissions;
}

export function getUserPermissions(role?: string): string[] {
  return getCompanyUserPermissions(role);
}

export function hasPermission(permissions: string[], required: string): boolean {
  return permissions.some((p) => matchPermission(p, required));
}
