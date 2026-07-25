'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ServiceComponent } from '../types';
import { componentService } from '../services/component-service';

export function useComponents(serviceId: string | undefined) {
  const [data, setData] = useState<ServiceComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!serviceId) { setData([]); setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await componentService.listByService(serviceId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar componentes');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await componentService.create(data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar componente');
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await componentService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar componente');
      return false;
    }
  }, [fetch]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await componentService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover componente');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, create, update, remove };
}
