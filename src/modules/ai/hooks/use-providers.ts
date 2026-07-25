'use client';

import { useState, useEffect, useCallback } from 'react';
import { providerService } from '../services/provider-service';
import type { AiProvider } from '../types';
import type { ProviderInput, ProviderUpdate } from '../schemas';

export function useProviders() {
  const [data, setData] = useState<AiProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await providerService.list();
      setData(list);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar provedores'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (input: ProviderInput): Promise<boolean> => {
    try {
      await providerService.create(input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar provedor'));
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, input: ProviderUpdate): Promise<boolean> => {
    try {
      await providerService.update(id, input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar provedor'));
      return false;
    }
  }, [fetch]);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await providerService.delete(id);
      setData((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir provedor'));
      return false;
    }
  }, []);

  return { data, loading, error, create, update, delete: delete_, refetch: fetch };
}
