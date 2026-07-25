'use client';

import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { KnowledgeDocument } from '../types';

interface DocumentTableProps {
  data: KnowledgeDocument[];
  onDelete: (id: string) => void;
}

export const DocumentTable = memo(function DocumentTable({ data, onDelete }: DocumentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Arquivo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Tamanho</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium">{doc.title}</TableCell>
            <TableCell className="text-sm font-mono">{doc.fileName}</TableCell>
            <TableCell><Badge variant="outline" className="text-xs">{doc.fileType}</Badge></TableCell>
            <TableCell className="text-sm">{(doc.fileSize / 1024).toFixed(1)} KB</TableCell>
            <TableCell>
              <Badge variant={doc.status === 'indexed' ? 'default' : 'secondary'}>
                {doc.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{new Date(doc.createdAt).toLocaleDateString('pt-BR')}</TableCell>
            <TableCell className="text-right">
              <Button variant="destructive" size="sm" onClick={() => onDelete(doc.id)}>Remover</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
