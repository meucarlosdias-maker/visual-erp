'use client';

import type { Permission } from '@/constants/permissions';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { getUserPermissions } from '@/lib/permissions';

interface CanProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({ permission, fallback, children }: CanProps) {
  const { user } = useAuth();
  const permissions = getUserPermissions(user?.role);
  const hasPermission = permissions.includes('*') || permissions.includes(permission);

  if (!hasPermission) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
