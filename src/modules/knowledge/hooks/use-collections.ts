'use client';

import { useState, useEffect, useCallback } from 'react';
import { collectionService } from '../services/collection-service';
import type { KnowledgeCollection } from '../types';
import type { CollectionInput, CollectionUpdate } from '../schemas';

export function useCollections() {
  const [data, setData] = useState<KnowledgeCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await collectionService.list();
      setData(list);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar coleções'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (input: CollectionInput): Promise<boolean> => {
    try {
      await collectionService.create(input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar coleção'));
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, input: CollectionUpdate): Promise<boolean> => {
    try {
      await collectionService.update(id, input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar coleção'));
      return false;
    }
  }, [fetch]);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await collectionService.delete(id);
      setData((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir coleção'));
      return false;
    }
  }, []);

  return { data, loading, error, create, update, delete: delete_, refetch: fetch };
}
