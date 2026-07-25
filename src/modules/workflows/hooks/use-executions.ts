'use client';

import { useState, useEffect, useCallback } from 'react';
import { executionService } from '../services/execution-service';
import type { WorkflowExecution } from '../types';

export function useExecutions() {
  const [data, setData] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await executionService.list();
      setData(list);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar execuções'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const executeWorkflow = useCallback(async (workflowId: string, payload: Record<string, unknown>): Promise<boolean> => {
    try {
      await executionService.executeWorkflow(workflowId, payload);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao executar workflow'));
      return false;
    }
  }, [fetch]);

  return { data, loading, error, executeWorkflow, refetch: fetch };
}
