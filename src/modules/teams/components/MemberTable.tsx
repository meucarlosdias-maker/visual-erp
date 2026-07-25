'use client';

import { memo } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MemberBadge } from './MemberBadge';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { User } from '@/constants/icons';
import { TEAM_ROLE_LABELS } from '../schemas/member-schema';
import type { TeamMember } from '../types';

interface MemberTableProps {
  members: TeamMember[];
  loading: boolean;
}

export const MemberTable = memo(function MemberTable({ members, loading }: MemberTableProps) {
  if (loading) return <LoadingLocal size={24} message="Carregando membros..." />;

  if (!members.length) {
    return (
      <EmptyState
        icon={<User className="h-12 w-12 text-muted-foreground" />}
        title="Nenhum membro"
        description="Nenhum membro cadastrado."
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Custo/h</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((mem) => (
            <TableRow key={mem.id}>
              <TableCell className="font-medium">{mem.name}</TableCell>
              <TableCell>
                {mem.role ? (
                  <Badge variant="outline">{TEAM_ROLE_LABELS[mem.role] ?? mem.role}</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm">R$ {mem.hourCost.toFixed(2)}</TableCell>
              <TableCell>
                <MemberBadge active={mem.active} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});
