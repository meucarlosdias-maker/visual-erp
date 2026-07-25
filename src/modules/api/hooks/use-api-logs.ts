'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiLogService } from '../services/api-log-service';
import type { ApiLog } from '../types';

export function useApiLogs() {
  const [data, setData] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const logs = await apiLogService.list();
      setData(logs);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar logs'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}