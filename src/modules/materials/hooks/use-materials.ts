'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Material } from '../types';
import { materialService } from '../services/material-service';

export function useMaterials(categoryId?: string) {
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await materialService.list();
      setData(categoryId ? result.filter((m) => m.categoryId === categoryId) : result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar materiais');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await materialService.create(data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar material');
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await materialService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar material');
      return false;
    }
  }, [fetch]);

  const toggleActive = useCallback(async (id: string): Promise<boolean> => {
    try {
      await materialService.toggleActive(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status');
      return false;
    }
  }, [fetch]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await materialService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover material');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, create, update, toggleActive, delete: remove };
}
