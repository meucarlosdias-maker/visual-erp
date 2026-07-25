'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Lead } from '../types';
import { leadService } from '../services/lead-service';

export function useLead(id: string) {
  const [data, setData] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const lead = await leadService.get(id);
      setData(lead);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar lead'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const update = useCallback(async (patch: Partial<Lead>): Promise<boolean> => {
    try {
      const updated = await leadService.update(id, patch);
      setData(updated);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar lead'));
      return false;
    }
  }, [id]);

  return { data, loading, error, update, refetch: fetch };
}
