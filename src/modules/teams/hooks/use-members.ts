'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TeamMember } from '../types';
import { teamMemberService } from '../services/member-service';

export function useMembers(teamId?: string) {
  const [data, setData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = teamId ? await teamMemberService.listByTeam(teamId) : await teamMemberService.list();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar membros');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await teamMemberService.create(data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar membro');
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await teamMemberService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar membro');
      return false;
    }
  }, [fetch]);

  const del = useCallback(async (id: string): Promise<boolean> => {
    try {
      await teamMemberService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover membro');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, create, update, delete: del };
}
