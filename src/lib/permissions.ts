import { rolePermissions } from '@/config/permissions';
import { UserRole } from '@/constants/enums';

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

export function getUserPermissions(role?: string): string[] {
  if (!role) return [];
  const mapping = rolePermissions.find((rp) => rp.role === role);
  if (!mapping) return [];
  return mapping.permissions;
}

export function hasPermission(permissions: string[], required: string): boolean {
  return permissions.some((p) => matchPermission(p, required));
}
