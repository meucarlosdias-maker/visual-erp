'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserStatusBadge } from './UserStatusBadge';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { Trash2, CheckCircle2, OctagonXIcon, Users } from '@/constants/icons';
import type { User } from '../types';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onToggleActive: (id: string, current: string) => void;
  onRemove: (id: string) => void;
}

export function UserTable({ users, loading, onToggleActive, onRemove }: UserTableProps) {
  if (loading) return <LoadingLocal size={24} message="Carregando usuários..." />;

  if (!users.length) {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12 text-muted-foreground" />}
        title="Nenhum usuário"
        description="Nenhum usuário cadastrado nesta empresa."
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Último Login</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const initials = (user.firstName[0] + (user.lastName[0] ?? '')).toUpperCase();
            const nomeCompleto = `${user.firstName} ${user.lastName}`;

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || undefined} alt={nomeCompleto} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{nomeCompleto}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.position || '—'}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <UserStatusBadge status={user.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastLogin
                    ? user.lastLogin.toLocaleDateString('pt-BR')
                    : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={user.status === 'active' ? 'Desativar' : 'Ativar'}
                      onClick={() => onToggleActive(user.id, user.status)}
                    >
                      {user.status === 'active' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <OctagonXIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Remover"
                      onClick={() => onRemove(user.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
