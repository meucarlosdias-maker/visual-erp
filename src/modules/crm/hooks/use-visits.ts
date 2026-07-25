'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Visit } from '../types';
import { visitService } from '../services/visit-service';

export function useVisits(leadId?: string) {
  const [data, setData] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const visits = await visitService.listByLead(leadId);
      setData(visits);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar visitas'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (input: Record<string, unknown>): Promise<boolean> => {
    try {
      const visit = await visitService.create(input);
      setData((prev) => [visit, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar visita'));
      return false;
    }
  }, []);

  const update = useCallback(async (id: string, patch: Partial<Visit>): Promise<boolean> => {
    try {
      const updated = await visitService.update(id, patch);
      setData((prev) => prev.map((v) => v.id === id ? updated : v));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar visita'));
      return false;
    }
  }, []);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await visitService.delete(id);
      setData((prev) => prev.filter((v) => v.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir visita'));
      return false;
    }
  }, []);

  return { data, loading, error, create, update, delete: delete_, refetch: fetch };
}
