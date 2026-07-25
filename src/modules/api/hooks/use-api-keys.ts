'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiKeyService } from '../services/api-key-service';
import type { ApiKey } from '../types';
import type { ApiKeyInput, ApiKeyUpdate } from '../schemas';

export function useApiKeys() {
  const [data, setData] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const keys = await apiKeyService.list();
      setData(keys);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar chaves de API'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (input: ApiKeyInput): Promise<boolean> => {
    try {
      await apiKeyService.create(input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar chave'));
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, input: ApiKeyUpdate): Promise<boolean> => {
    try {
      await apiKeyService.update(id, input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar chave'));
      return false;
    }
  }, [fetch]);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await apiKeyService.delete(id);
      setData((prev) => prev.filter((k) => k.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir chave'));
      return false;
    }
  }, []);

  const regenerateSecret = useCallback(async (id: string): Promise<string | null> => {
    try {
      return await apiKeyService.regenerateSecret(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao regerar secret'));
      return null;
    }
  }, []);

  return { data, loading, error, create, update, delete: delete_, regenerateSecret, refetch: fetch };
}

export function useApiKey(id: string) {
  const [data, setData] = useState<ApiKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const key = await apiKeyService.get(id);
      setData(key);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar chave'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}