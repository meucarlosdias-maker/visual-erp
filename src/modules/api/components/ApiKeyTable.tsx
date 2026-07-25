'use client';

import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from '@/constants/icons';
import type { ApiKey } from '../types';

interface ApiKeyTableProps {
  data: ApiKey[];
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ApiKeyTable = memo(function ApiKeyTable({ data, onRegenerate, onDelete }: ApiKeyTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criada em</TableHead>
          <TableHead>Expira em</TableHead>
          <TableHead>Último uso</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((apiKey) => (
          <TableRow key={apiKey.id}>
            <TableCell className="font-medium">{apiKey.name}</TableCell>
            <TableCell>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{apiKey.key.slice(0, 12)}...</code>
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(apiKey.key)}>
                <Copy className="h-3 w-3" />
              </Button>
            </TableCell>
            <TableCell>
              <Badge variant={apiKey.active ? 'default' : 'secondary'}>
                {apiKey.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{new Date(apiKey.createdAt).toLocaleDateString('pt-BR')}</TableCell>
            <TableCell className="text-sm">
              {apiKey.expiresAt ? new Date(apiKey.expiresAt).toLocaleDateString('pt-BR') : '-'}
            </TableCell>
            <TableCell className="text-sm">
              {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleString('pt-BR') : 'Nunca'}
            </TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="outline" size="sm" onClick={() => onRegenerate(apiKey.id)}>Regenerar</Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(apiKey.id)}>Remover</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});