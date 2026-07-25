'use client';

import { useState, useEffect, useCallback } from 'react';
import { webhookService } from '../services/webhook-service';
import type { Webhook } from '../types';
import type { WebhookInput, WebhookUpdate } from '../schemas';

export function useWebhooks() {
  const [data, setData] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const hooks = await webhookService.list();
      setData(hooks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar webhooks'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (input: WebhookInput): Promise<boolean> => {
    try {
      await webhookService.create(input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar webhook'));
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, input: WebhookUpdate): Promise<boolean> => {
    try {
      await webhookService.update(id, input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar webhook'));
      return false;
    }
  }, [fetch]);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await webhookService.delete(id);
      setData((prev) => prev.filter((w) => w.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir webhook'));
      return false;
    }
  }, []);

  const test = useCallback(async (id: string): Promise<boolean> => {
    try {
      return await webhookService.test(id);
    } catch {
      return false;
    }
  }, []);

  const regenerateSecret = useCallback(async (id: string): Promise<string | null> => {
    try {
      return await webhookService.regenerateSecret(id);
    } catch {
      return null;
    }
  }, []);

  return { data, loading, error, create, update, delete: delete_, test, regenerateSecret, refetch: fetch };
}