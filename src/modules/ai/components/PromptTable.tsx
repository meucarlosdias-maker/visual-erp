'use client';

import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AiPrompt } from '../types';

interface PromptTableProps {
  data: AiPrompt[];
  onDelete: (id: string) => void;
}

export const PromptTable = memo(function PromptTable({ data, onDelete }: PromptTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Módulo</TableHead>
          <TableHead>Versão</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell><Badge variant="outline">{p.module}</Badge></TableCell>
            <TableCell className="text-sm">v{p.version}</TableCell>
            <TableCell>
              <Badge variant={p.active ? 'default' : 'secondary'}>
                {p.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{new Date(p.createdAt).toLocaleDateString('pt-BR')}</TableCell>
            <TableCell className="text-right">
              <Button variant="destructive" size="sm" onClick={() => onDelete(p.id)}>Remover</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
