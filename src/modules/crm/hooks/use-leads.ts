'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Lead } from '../types';
import { leadService } from '../services/lead-service';

export function useLeads() {
  const [data, setData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const leads = await leadService.list();
      setData(leads);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar leads'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await leadService.delete(id);
      setData((prev) => prev.filter((l) => l.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir lead'));
      return false;
    }
  }, []);

  return { data, loading, error, delete: delete_, refetch: fetch };
}
