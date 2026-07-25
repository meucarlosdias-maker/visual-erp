'use client';

import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AiProvider } from '../types';

interface ProviderTableProps {
  data: AiProvider[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export const ProviderTable = memo(function ProviderTable({ data, onDelete, onToggleActive }: ProviderTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Provedor</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Temp.</TableHead>
          <TableHead>Max Tokens</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell><Badge variant="outline" className="font-mono text-xs">{p.provider}</Badge></TableCell>
            <TableCell className="text-xs font-mono">{p.model}</TableCell>
            <TableCell className="text-sm">{p.temperature}</TableCell>
            <TableCell className="text-sm">{p.maxTokens}</TableCell>
            <TableCell>
              <Badge variant={p.active ? 'default' : 'secondary'}>
                {p.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="outline" size="sm" onClick={() => onToggleActive(p.id, !p.active)}>
                {p.active ? 'Desativar' : 'Ativar'}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(p.id)}>Remover</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
