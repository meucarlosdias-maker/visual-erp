'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TeamWithRelations } from '../types';
import { teamService } from '../services/team-service';

export function useTeam(id: string | undefined) {
  const [data, setData] = useState<TeamWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) { setData(null); setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await teamService.get(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar equipe');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const update = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    if (!id) return false;
    try {
      await teamService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar equipe');
      return false;
    }
  }, [id, fetch]);

  return { data, loading, error, update };
}
