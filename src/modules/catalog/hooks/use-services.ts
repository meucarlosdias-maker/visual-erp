'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CatalogService } from '../types';
import { serviceService } from '../services/service-service';

export function useServices(filters?: { categoryId?: string; subcategoryId?: string }) {
  const [data, setData] = useState<CatalogService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceService.list(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await serviceService.create(data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar serviço');
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await serviceService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar serviço');
      return false;
    }
  }, [fetch]);

  const toggleActive = useCallback(async (id: string): Promise<boolean> => {
    try {
      await serviceService.toggleActive(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status');
      return false;
    }
  }, [fetch]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await serviceService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover serviço');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, create, update, toggleActive, remove };
}
