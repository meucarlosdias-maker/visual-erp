'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/feedback';
import { UserStatusBadge } from './UserStatusBadge';
import { RoleLabels } from '@/constants/roles';
import { Inbox, ShieldX, Phone } from '@/constants/icons';
import type { User } from '../types';

interface UserCardProps {
  user?: User | null;
  loading?: boolean;
}

export function UserCard({ user, loading }: UserCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Usuário</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  const initials = (user.firstName[0] + (user.lastName[0] ?? '')).toUpperCase();
  const nomeCompleto = `${user.firstName} ${user.lastName}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatarUrl || undefined} alt={nomeCompleto} />
          <AvatarFallback className="text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <CardTitle className="text-sm truncate">{nomeCompleto}</CardTitle>
          <p className="text-xs text-muted-foreground">{user.position || RoleLabels[user.role]}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Inbox className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldX className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{RoleLabels[user.role]}</span>
        </div>
        {user.telefone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{user.telefone}</span>
          </div>
        )}
        <UserStatusBadge status={user.status} />
      </CardContent>
    </Card>
  );
}
