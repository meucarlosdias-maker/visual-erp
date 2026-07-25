'use client';

import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { Workflow } from '../types';

interface WorkflowTableProps {
  data: Workflow[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export const WorkflowTable = memo(function WorkflowTable({ data, onDelete, onToggleActive }: WorkflowTableProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Gatilho</TableHead>
          <TableHead>Passos</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((wf) => (
          <TableRow key={wf.id} className="cursor-pointer" onClick={() => router.push(`/app/workflows/${wf.id}`)}>
            <TableCell className="font-medium">{wf.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs font-mono">{wf.trigger}</Badge>
            </TableCell>
            <TableCell className="text-sm">{wf.steps.length} passo(s)</TableCell>
            <TableCell>
              <Badge variant={wf.active ? 'default' : 'secondary'}>
                {wf.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{new Date(wf.createdAt).toLocaleDateString('pt-BR')}</TableCell>
            <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="sm" onClick={() => onToggleActive(wf.id, !wf.active)}>
                {wf.active ? 'Desativar' : 'Ativar'}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(wf.id)}>Remover</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
