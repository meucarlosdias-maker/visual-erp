'use client';

import { Badge } from '@/components/ui/badge';

const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; label: string }> = {
  active: { variant: 'default', label: 'Ativo' },
  inactive: { variant: 'secondary', label: 'Inativo' },
  pending: { variant: 'outline', label: 'Pendente' },
  blocked: { variant: 'destructive', label: 'Bloqueado' },
};

interface UserStatusBadgeProps {
  status: string;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = statusConfig[status] ?? { variant: 'secondary' as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
