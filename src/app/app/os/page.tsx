'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText, Clock, CheckCircle2, AlertTriangle } from '@/constants/icons';
import { EmptyState, LoadingLocal, toast } from '@/components/feedback';
import { WorkOrderTable } from '@/modules/work-orders/components/WorkOrderTable';
import { useWorkOrders } from '@/modules/work-orders/hooks/use-work-orders';
import { useDeleteConfirm } from '@/hooks/use-confirm';
import type { WorkOrder } from '@/modules/work-orders/types';

export default function WorkOrdersPage() {
  const router = useRouter();
  const { data, loading, delete: remove } = useWorkOrders();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();
  const [search, setSearch] = useState('');

  const stats = useMemo(() => {
    const total = data.length;
    const inProgress = data.filter((o) => o.status === 'IN_PRODUCTION' || o.status === 'WAITING_INSTALLATION' || o.status === 'INSTALLING').length;
    const pending = data.filter((o) => o.status === 'OPEN' || o.status === 'WAITING_APPROVAL').length;
    const delayed = data.filter((o) => {
      if (o.status === 'DELIVERED' || o.status === 'CANCELLED' || o.status === 'FINISHED') return false;
      if (!o.expectedEndDate) return false;
      return new Date(o.expectedEndDate) < new Date();
    }).length;
    return { total, inProgress, pending, delayed };
  }, [data]);

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((o) =>
      o.number.toLowerCase().includes(q) ||
      o.title.toLowerCase().includes(q),
    );
  }, [data, search]);

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({ title: 'Remover OS', description: 'Esta ação não pode ser desfeita.' });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('OS removida');
  }, [confirmDelete, remove]);

  const cardClass = 'p-0 shadow-none border-none';
  const iconClass = 'h-6 w-6';

  return (
    <>
      <CrudPage
        title="Ordens de Serviço"
        description="Gerencie as ordens de serviço do sistema"
        actionNew={{ onClick: () => router.push('/app/os/nova') }}
        toolbar={
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 w-64" placeholder="Buscar OS..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        }
      >
        {loading ? (
          <LoadingLocal message="Carregando OS..." />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <Card className={cardClass}>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><FileText className={iconClass} /> Total de OS</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent>
              </Card>
              <Card className={cardClass}>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Clock className={iconClass} /> Em Andamento</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">{stats.inProgress}</p></CardContent>
              </Card>
              <Card className={cardClass}>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><CheckCircle2 className={iconClass} /> Pendentes</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">{stats.pending}</p></CardContent>
              </Card>
              <Card className={cardClass}>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><AlertTriangle className={iconClass} /> Atrasadas</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold text-destructive">{stats.delayed}</p></CardContent>
              </Card>
            </div>

            {filtered.length === 0 ? (
              <EmptyState icon={<FileText className="h-12 w-12 text-muted-foreground" />} title="Nenhuma OS" description="Crie uma nova ordem de serviço." />
            ) : (
              <WorkOrderTable
                data={filtered}
                onRowClick={(id) => router.push(`/app/os/${id}`)}
                onEdit={(id) => router.push(`/app/os/${id}`)}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      </CrudPage>
      {DeleteDialog}
    </>
  );
}
