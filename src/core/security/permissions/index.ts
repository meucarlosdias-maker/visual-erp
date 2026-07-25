export const SECURITY_PERMISSIONS = [
  'security.view',
  'security.audit',
  'security.logs',
  'security.policies',
  'security.retention',
  'security.compliance',
] as const;

export type SecurityPermission = typeof SECURITY_PERMISSIONS[number];

export function hasSecurityPermission(userPermissions: string[], required: SecurityPermission): boolean {
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(required);
}

export function hasAnySecurityPermission(userPermissions: string[]): boolean {
  if (userPermissions.includes('*')) return true;
  return SECURITY_PERMISSIONS.some((p) => userPermissions.includes(p));
}
