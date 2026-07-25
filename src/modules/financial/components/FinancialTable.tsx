'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from '@/constants/icons';
import { FinancialBadge } from './FinancialBadge';
import type { AccountsReceivable, AccountsPayable, FinancialStatus } from '../types';

interface FinancialTableProps {
  data: (AccountsReceivable | AccountsPayable)[];
  type: 'receivable' | 'payable';
  onRowClick: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}

function getAmount(item: AccountsReceivable | AccountsPayable): number {
  return 'receivedAmount' in item ? item.amount : item.amount;
}

function getPaidAmount(item: AccountsReceivable | AccountsPayable): number {
  return 'receivedAmount' in item ? item.receivedAmount : (item as AccountsPayable).paidAmount;
}

export function FinancialTable({ data, type, onRowClick, onEdit, onDelete }: FinancialTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>{type === 'receivable' ? 'Recebido' : 'Pago'}</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="w-20">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Nenhum registro encontrado.</TableCell></TableRow>
          ) : data.map((item) => (
            <TableRow key={item.id} className="cursor-pointer" onClick={() => onRowClick(item.id)}>
              <TableCell className="text-sm font-mono">{item.number}</TableCell>
              <TableCell className="text-sm max-w-[200px] truncate">{item.description}</TableCell>
              <TableCell><FinancialBadge status={item.status as FinancialStatus} /></TableCell>
              <TableCell className="text-sm font-medium">{formatCurrency(getAmount(item))}</TableCell>
              <TableCell className="text-sm">{formatCurrency(getPaidAmount(item))}</TableCell>
              <TableCell className="text-sm">{formatDate(item.dueDate)}</TableCell>
              <TableCell className="text-sm">{formatDate((item as AccountsReceivable).paymentDate)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(item.id); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
