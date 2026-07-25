'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../types';
import { projectService } from '../services/project-service';

export function useProject(id: string | undefined) {
  const [data, setData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await projectService.get(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projeto');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = useCallback(async (status: string): Promise<boolean> => {
    try {
      await projectService.updateStatus(id!, status);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    }
  }, [id, fetch]);

  return { data, loading, error, updateStatus };
}
