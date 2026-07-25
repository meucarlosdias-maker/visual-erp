'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Installation } from '../types';
import { installationService } from '../services/installation-service';

export function useInstallation(id: string | null) {
  const [data, setData] = useState<Installation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) { setData(null); setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await installationService.getById(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar instalação');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const update = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    if (!id) return false;
    try {
      await installationService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar instalação');
      return false;
    }
  }, [id, fetch]);

  const updateStatus = useCallback(async (status: string): Promise<boolean> => {
    if (!id) return false;
    try {
      await installationService.updateStatus(id, status);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    }
  }, [id, fetch]);

  return { data, loading, error, update, updateStatus };
}
