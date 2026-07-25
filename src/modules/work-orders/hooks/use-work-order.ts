'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WorkOrder, WorkOrderItem, WorkOrderEvent, WorkOrderStatus } from '../types';
import { workOrderService } from '../services/work-order-service';

export function useWorkOrder(id: string) {
  const [data, setData] = useState<WorkOrder | null>(null);
  const [items, setItems] = useState<WorkOrderItem[]>([]);
  const [events, setEvents] = useState<WorkOrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [order, orderItems, orderEvents] = await Promise.all([
        workOrderService.get(id),
        workOrderService.listItems(id),
        workOrderService.listEvents(id),
      ]);
      setData(order);
      setItems(orderItems);
      setEvents(orderEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar OS');
      setData(null);
      setItems([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateStatus = useCallback(async (status: WorkOrderStatus): Promise<boolean> => {
    if (!data) return false;
    try {
      const patch: Partial<WorkOrder> = { status };
      if (status === 'FINISHED' || status === 'DELIVERED') {
        patch.finishedDate = new Date();
      }
      const updated = await workOrderService.update(id, patch);
      setData(updated);
      const event = await workOrderService.createEvent({
        workOrderId: id,
        type: 'STATUS_CHANGE',
        description: `Status alterado para ${status}`,
        userId: 'user-001',
      });
      setEvents((prev) => [...prev, event]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    }
  }, [data, id]);

  const del = useCallback(async (): Promise<boolean> => {
    try {
      await workOrderService.delete(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover OS');
      return false;
    }
  }, [id]);

  return { data, items, events, loading, error, updateStatus, delete: del, refetch: fetchAll };
}
