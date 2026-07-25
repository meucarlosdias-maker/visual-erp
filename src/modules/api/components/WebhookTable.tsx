'use client';

import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Webhook } from '../types';

interface WebhookTableProps {
  data: Webhook[];
  onTest: (id: string) => void;
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const WebhookTable = memo(function WebhookTable({ data, onTest, onRegenerate, onDelete }: WebhookTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Eventos</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((webhook) => (
          <TableRow key={webhook.id}>
            <TableCell className="font-medium">{webhook.name}</TableCell>
            <TableCell className="text-sm max-w-[200px] truncate">{webhook.url}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {webhook.events.map((event) => (
                  <Badge key={event} variant="outline" className="text-xs">{event}</Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={webhook.active ? 'default' : 'secondary'}>
                {webhook.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{new Date(webhook.createdAt).toLocaleDateString('pt-BR')}</TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="outline" size="sm" onClick={() => onTest(webhook.id)}>Testar</Button>
              <Button variant="ghost" size="sm" onClick={() => onRegenerate(webhook.id)}>Regen.</Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(webhook.id)}>Remover</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});