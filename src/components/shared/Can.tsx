'use client';

import { getCompanyUserPermissions, getPlatformUserPermissions } from '@/lib/permissions';
import { useAuth } from '@/modules/auth/hooks/use-auth';

interface CanProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({ permission, fallback, children }: CanProps) {
  const { user } = useAuth();
  if (!user) return fallback ?? null;

  const permissions = user.type === 'platform'
    ? getPlatformUserPermissions(user.role)
    : getCompanyUserPermissions(user.role);

  const hasAccess = permissions.includes('*') || permissions.includes(permission);

  if (!hasAccess) return fallback ?? null;
  return <>{children}</>;
}
