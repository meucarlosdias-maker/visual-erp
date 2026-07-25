'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Material } from '../types';
import { materialService } from '../services/material-service';

export function useMaterial(id: string | undefined) {
  const [data, setData] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) { setData(null); setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await materialService.get(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar material');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const update = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    if (!id) return false;
    try {
      await materialService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar material');
      return false;
    }
  }, [id, fetch]);

  return { data, loading, error, update };
}
