'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from '@/constants/icons';
import { WorkOrderStatusBadge, PriorityBadge } from './WorkOrderBadge';
import type { WorkOrder, WorkOrderStatus } from '../types';

interface WorkOrderTableProps {
  data: WorkOrder[];
  onRowClick: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function formatCurrency(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}

export function WorkOrderTable({ data, onRowClick, onEdit, onDelete }: WorkOrderTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>OS</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Previsão</TableHead>
            <TableHead className="w-20">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Nenhuma OS encontrada.</TableCell></TableRow>
          ) : data.map((order) => (
            <TableRow key={order.id} className="cursor-pointer" onClick={() => onRowClick(order.id)}>
              <TableCell className="text-sm font-mono">{order.number}</TableCell>
              <TableCell className="text-sm font-medium max-w-[200px] truncate">{order.title}</TableCell>
              <TableCell><WorkOrderStatusBadge status={order.status as WorkOrderStatus} /></TableCell>
              <TableCell><PriorityBadge priority={order.priority} /></TableCell>
              <TableCell className="text-sm font-medium">{formatCurrency(order.totalValue)}</TableCell>
              <TableCell className="text-sm">{formatDate(order.startDate)}</TableCell>
              <TableCell className="text-sm">{formatDate(order.expectedEndDate)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(order.id); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(order.id); }}>
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
