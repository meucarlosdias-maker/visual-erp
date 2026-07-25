'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WorkOrder } from '../types';
import { workOrderService } from '../services/work-order-service';

export function useWorkOrders() {
  const [data, setData] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const orders = await workOrderService.list();
      if (Array.isArray(orders)) setData(orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ordens de serviço');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await workOrderService.create(data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar OS');
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, data_: Partial<WorkOrder>): Promise<boolean> => {
    try {
      await workOrderService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar OS');
      return false;
    }
  }, [fetch]);

  const del = useCallback(async (id: string): Promise<boolean> => {
    try {
      await workOrderService.delete(id);
      setData((prev) => prev.filter((o) => o.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover OS');
      return false;
    }
  }, []);

  return { data, loading, error, create, update, delete: del, refetch: fetch };
}
