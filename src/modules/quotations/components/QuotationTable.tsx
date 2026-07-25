'use client';

import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, FileText } from '@/constants/icons';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { QuotationBadge } from './QuotationBadge';
import type { Quotation } from '../types';

interface QuotationTableProps {
  quotations: Quotation[];
  loading: boolean;
  onRemove: (id: string) => void;
}

export function QuotationTable({ quotations, loading, onRemove }: QuotationTableProps) {
  const router = useRouter();

  if (loading) {
    return <LoadingLocal message="Carregando orçamentos..." />;
  }

  if (quotations.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-12 w-12 text-muted-foreground" />}
        title="Nenhum orçamento encontrado"
        description="Crie um novo orçamento para começar."
      />
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Atualizado em</TableHead>
            <TableHead className="w-20">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((q) => (
            <TableRow
              key={q.id}
              className="cursor-pointer"
              onClick={() => router.push(`/app/orcamentos/${q.id}`)}
            >
              <TableCell className="text-sm font-mono">{q.number}</TableCell>
              <TableCell className="text-sm">{q.clientId || '—'}</TableCell>
              <TableCell className="text-sm font-medium max-w-[200px] truncate">{q.title}</TableCell>
              <TableCell><QuotationBadge status={q.status} /></TableCell>
              <TableCell className="text-sm">
                {q.validUntil ? q.validUntil.toLocaleDateString('pt-BR') : '—'}
              </TableCell>
              <TableCell className="text-sm font-medium">
                R$ {q.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-sm">{q.updatedAt.toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); router.push(`/app/orcamentos/${q.id}/editar`); }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onRemove(q.id); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
