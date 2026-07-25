'use client';

import { useState, useEffect, useCallback } from 'react';
import { promptService } from '../services/prompt-service';
import type { AiPrompt } from '../types';
import type { PromptInput, PromptUpdate } from '../schemas';

export function usePrompts() {
  const [data, setData] = useState<AiPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await promptService.list();
      setData(list);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar prompts'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (input: PromptInput): Promise<boolean> => {
    try {
      await promptService.create(input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar prompt'));
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, input: PromptUpdate): Promise<boolean> => {
    try {
      await promptService.update(id, input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar prompt'));
      return false;
    }
  }, [fetch]);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await promptService.delete(id);
      setData((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir prompt'));
      return false;
    }
  }, []);

  return { data, loading, error, create, update, delete: delete_, refetch: fetch };
}
