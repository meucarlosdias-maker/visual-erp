'use client';

import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { KnowledgeCollection } from '../types';

interface CollectionTableProps {
  data: KnowledgeCollection[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export const CollectionTable = memo(function CollectionTable({ data, onDelete, onToggleActive }: CollectionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Documentos</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((col) => (
          <TableRow key={col.id}>
            <TableCell className="font-medium">{col.name}</TableCell>
            <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
              {col.description ?? '-'}
            </TableCell>
            <TableCell className="text-sm">{col.documents.length}</TableCell>
            <TableCell>
              <Badge variant={col.active ? 'default' : 'secondary'}>
                {col.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="outline" size="sm" onClick={() => onToggleActive(col.id, !col.active)}>
                {col.active ? 'Desativar' : 'Ativar'}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(col.id)}>Remover</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
