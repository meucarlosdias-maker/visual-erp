'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { Button } from '@/components/ui/button';
import { LoadingLocal, toast } from '@/components/feedback';
import { WorkOrderDetail } from '@/modules/work-orders/components/WorkOrderDetail';
import { workOrderService } from '@/modules/work-orders/services/work-order-service';
import { attachmentService } from '@/modules/work-orders/services/attachment-service';
import { timelineService } from '@/modules/work-orders/services/timeline-service';
import type { WorkOrder, WorkOrderItem, WorkOrderEvent, WorkOrderAttachment, WorkOrderStatus } from '@/modules/work-orders/types';

export default function OsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<WorkOrder | null>(null);
  const [items, setItems] = useState<WorkOrderItem[]>([]);
  const [events, setEvents] = useState<WorkOrderEvent[]>([]);
  const [attachments, setAttachments] = useState<WorkOrderAttachment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [o, i, e, a] = await Promise.all([
        workOrderService.get(id),
        workOrderService.listItems(id),
        workOrderService.listEvents(id),
        attachmentService.listByWorkOrderId(id),
      ]);
      setOrder(o); setItems(i); setEvents(e); setAttachments(a);
    } catch { setOrder(null); } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleUpdateStatus = async (status: WorkOrderStatus) => {
    if (!order) return false;
    try {
      const patch: Partial<WorkOrder> = { status };
      if (status === 'FINISHED' || status === 'DELIVERED') patch.finishedDate = new Date();
      const updated = await workOrderService.update(id, patch);
      setOrder(updated);
      const event = await timelineService.create({
        workOrderId: id, type: 'STATUS_CHANGE',
        description: `Status alterado para ${status}`,
        userId: 'user-001',
      });
      setEvents((prev) => [...prev, event]);
      toast.success('Status atualizado');
      return true;
    } catch { toast.error('Erro ao atualizar status'); return false; }
  };

  const handleAddItem = async (data: Record<string, unknown>) => {
    try {
      const item = await workOrderService.createItem({ ...data, workOrderId: id });
      setItems((prev) => [...prev, item]);
      return true;
    } catch { return false; }
  };

  const handleUpdateItem = async (itemId: string, data: Partial<WorkOrderItem>) => {
    try {
      const updated = await workOrderService.updateItem(itemId, data);
      setItems((prev) => prev.map((i) => i.id === itemId ? updated : i));
      return true;
    } catch { return false; }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await workOrderService.deleteItem(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      return true;
    } catch { return false; }
  };

  const handleDuplicateItem = async (item: WorkOrderItem) => {
    try {
      const { id: _id, ...rest } = item;
      const created = await workOrderService.createItem({ ...rest, workOrderId: id });
      setItems((prev) => [...prev, created]);
      return true;
    } catch { return false; }
  };

  const handleAddAttachment = async (data: Record<string, unknown>) => {
    try {
      const att = await attachmentService.create(data);
      setAttachments((prev) => [...prev, att]);
      return true;
    } catch { return false; }
  };

  const handleDeleteAttachment = async (attId: string) => {
    try {
      await attachmentService.delete(attId);
      setAttachments((prev) => prev.filter((a) => a.id !== attId));
      return true;
    } catch { return false; }
  };

  const handleSaveNotes = async (clientNotes: string, internalNotes: string) => {
    try {
      const updated = await workOrderService.update(id, { notes: clientNotes, internalNotes });
      setOrder(updated);
      return true;
    } catch { return false; }
  };

  if (loading) return <LoadingLocal message="Carregando OS..." />;
  if (!order) return <p className="text-center py-12 text-muted-foreground">OS não encontrada.</p>;

  return (
    <CrudPage
      title={`OS ${order.number}`}
      description=""
      actionNew={{ onClick: () => router.push(`/app/os/${id}/editar`), label: 'Editar' }}
    >
      <WorkOrderDetail
        order={order}
        items={items}
        events={events}
        attachments={attachments}
        onUpdateStatus={handleUpdateStatus}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onDuplicateItem={handleDuplicateItem}
        onAddAttachment={handleAddAttachment}
        onDeleteAttachment={handleDeleteAttachment}
        onSaveNotes={handleSaveNotes}
      />
    </CrudPage>
  );
}
