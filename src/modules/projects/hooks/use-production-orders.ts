'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ProductionOrder } from '../types/production-order';
import { productionOrderService } from '../services/production-order-service';

export function useProductionOrders() {
  const [data, setData] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productionOrderService.list();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ordens de produção');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = useCallback(async (id: string, status: string): Promise<boolean> => {
    try {
      await productionOrderService.updateStatus(id, status);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, updateStatus };
}
