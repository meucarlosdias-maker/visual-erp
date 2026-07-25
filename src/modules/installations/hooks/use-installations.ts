'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Installation } from '../types';
import { installationService } from '../services/installation-service';

export function useInstallations() {
  const [data, setData] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await installationService.list();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar instalações');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = useCallback(async (id: string, status: string): Promise<boolean> => {
    try {
      await installationService.updateStatus(id, status);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    }
  }, [fetch]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await installationService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover instalação');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, updateStatus, remove };
}
