'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Team } from '../types';
import { teamService } from '../services/team-service';

export function useTeams() {
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await teamService.list();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar equipes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await teamService.create(data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar equipe');
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await teamService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar equipe');
      return false;
    }
  }, [fetch]);

  const toggleActive = useCallback(async (id: string): Promise<boolean> => {
    try {
      await teamService.toggleActive(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status');
      return false;
    }
  }, [fetch]);

  const del = useCallback(async (id: string): Promise<boolean> => {
    try {
      await teamService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover equipe');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, create, update, toggleActive, delete: del };
}
