'use client';

import { useState, useEffect, useCallback } from 'react';
import { workflowService } from '../services/workflow-service';
import type { Workflow } from '../types';
import type { WorkflowInput, WorkflowUpdate } from '../schemas';

export function useWorkflows() {
  const [data, setData] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await workflowService.list();
      setData(list);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar workflows'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (input: WorkflowInput): Promise<boolean> => {
    try {
      await workflowService.create(input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar workflow'));
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, input: WorkflowUpdate): Promise<boolean> => {
    try {
      await workflowService.update(id, input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar workflow'));
      return false;
    }
  }, [fetch]);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await workflowService.delete(id);
      setData((prev) => prev.filter((w) => w.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir workflow'));
      return false;
    }
  }, []);

  return { data, loading, error, create, update, delete: delete_, refetch: fetch };
}

export function useWorkflow(id: string) {
  const [data, setData] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const wf = await workflowService.get(id);
      setData(wf);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar workflow'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
