'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TeamBadge } from './TeamBadge';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { Trash2, CheckCircle2, OctagonXIcon, Users } from '@/constants/icons';
import type { Team } from '../types';

interface TeamTableProps {
  teams: Team[];
  loading: boolean;
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
}

export const TeamTable = memo(function TeamTable({ teams, loading, onToggleActive, onRemove }: TeamTableProps) {
  const router = useRouter();

  if (loading) return <LoadingLocal size={24} message="Carregando equipes..." />;

  if (!teams.length) {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12 text-muted-foreground" />}
        title="Nenhuma equipe"
        description="Nenhuma equipe cadastrada."
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Custo Hora</TableHead>
            <TableHead>Custo Dia</TableHead>
            <TableHead>Margem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id} className="cursor-pointer" onClick={() => router.push(`/app/equipes/${team.id}`)}>
              <TableCell>
                <Badge variant="outline" className="font-mono">{team.code}</Badge>
              </TableCell>
              <TableCell>
                <div>
                  <span className="font-medium">{team.name}</span>
                  {team.description && (
                    <p className="text-xs text-muted-foreground">{team.description}</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm">R$ {team.hourCost.toFixed(2)}</TableCell>
              <TableCell className="text-sm">R$ {team.dailyCost.toFixed(2)}</TableCell>
              <TableCell className="text-sm">{team.defaultMargin}%</TableCell>
              <TableCell>
                <TeamBadge active={team.active} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" title={team.active ? 'Desativar' : 'Ativar'} onClick={() => onToggleActive(team.id)}>
                    {team.active ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <OctagonXIcon className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" title="Remover" onClick={() => onRemove(team.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});
