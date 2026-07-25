'use client';

import { useState, useEffect, useCallback } from 'react';
import type { EquipmentCategory } from '../types';
import { equipmentCategoryService } from '../services/equipment-category-service';

export function useEquipmentCategories() {
  const [data, setData] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await equipmentCategoryService.list();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await equipmentCategoryService.create(data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria');
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await equipmentCategoryService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar categoria');
      return false;
    }
  }, [fetch]);

  const toggleActive = useCallback(async (id: string): Promise<boolean> => {
    try {
      await equipmentCategoryService.toggleActive(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status');
      return false;
    }
  }, [fetch]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await equipmentCategoryService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover categoria');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, create, update, toggleActive, delete: remove };
}
