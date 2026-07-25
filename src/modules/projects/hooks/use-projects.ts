'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../types';
import { projectService } from '../services/project-service';

export function useProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await projectService.list();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await projectService.create(data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar projeto');
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await projectService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar projeto');
      return false;
    }
  }, [fetch]);

  const updateStatus = useCallback(async (id: string, status: string): Promise<boolean> => {
    try {
      await projectService.updateStatus(id, status);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    }
  }, [fetch]);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await projectService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover projeto');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, create, update, updateStatus, delete: delete_ };
}
