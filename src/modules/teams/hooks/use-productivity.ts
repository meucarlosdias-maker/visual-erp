'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TeamProductivity } from '../types';
import { teamProductivityService } from '../services/productivity-service';

export function useProductivity(teamId: string | undefined) {
  const [data, setData] = useState<TeamProductivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!teamId) { setData([]); setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const result = teamId ? await teamProductivityService.listByTeam(teamId) : await teamProductivityService.list();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtividade');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await teamProductivityService.create({ ...data_, teamId });
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar produtividade');
      return false;
    }
  }, [teamId, fetch]);

  const update = useCallback(async (id: string, data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await teamProductivityService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produtividade');
      return false;
    }
  }, [fetch]);

  const del = useCallback(async (id: string): Promise<boolean> => {
    try {
      await teamProductivityService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover produtividade');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, create, update, delete: del };
}
