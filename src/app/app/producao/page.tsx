'use client';

import { useMemo } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { ProductionOrderBadge } from '@/modules/projects/components/ProductionOrderBadge';
import { PRIORITY_LABELS } from '@/modules/projects/validators';
import { useProductionOrders } from '@/modules/projects/hooks/use-production-orders';
import { HardHat } from '@/constants/icons';

export default function ProducaoPage() {
  const { data: orders, loading } = useProductionOrders();

  const sorted = useMemo(() => {
    return [...orders].sort((a, b) => {
      const order = { pending: 0, approved: 1, in_progress: 2, paused: 3, finished: 4, cancelled: 5 };
      return (order[a.status as keyof typeof order] ?? 0) - (order[b.status as keyof typeof order] ?? 0);
    });
  }, [orders]);

  return (
    <CrudPage title="Ordens de Produção" description="Gerencie as ordens de produção">
      {loading ? (
        <LoadingLocal message="Carregando ordens de produção..." />
      ) : sorted.length === 0 ? (
        <EmptyState icon={<HardHat className="h-12 w-12 text-muted-foreground" />} title="Nenhuma ordem de produção" description="As ordens são geradas automaticamente a partir das tarefas dos projetos." />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Horas Prev.</TableHead>
                <TableHead>Horas Real.</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Término</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="text-sm font-mono">{po.number}</TableCell>
                  <TableCell className="text-sm font-medium max-w-[300px] truncate">{po.title}</TableCell>
                  <TableCell><ProductionOrderBadge status={po.status} /></TableCell>
                  <TableCell className="text-sm">{PRIORITY_LABELS[po.priority] ?? po.priority}</TableCell>
                  <TableCell className="text-sm">{po.estimatedHours ?? '—'}</TableCell>
                  <TableCell className="text-sm">{po.actualHours ?? '—'}</TableCell>
                  <TableCell className="text-sm">{po.startedAt ? po.startedAt.toLocaleDateString('pt-BR') : '—'}</TableCell>
                  <TableCell className="text-sm">{po.finishedAt ? po.finishedAt.toLocaleDateString('pt-BR') : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CrudPage>
  );
}
