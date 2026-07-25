'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LeadActivity } from '../types';
import { activityService } from '../services/activity-service';

export function useLeadActivities(leadId: string) {
  const [data, setData] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const activities = await activityService.listByLeadId(leadId);
      setData(activities);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar atividades'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (input: Record<string, unknown>): Promise<boolean> => {
    try {
      const activity = await activityService.create({ ...input, leadId });
      setData((prev) => [activity, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar atividade'));
      return false;
    }
  }, [leadId]);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await activityService.delete(id);
      setData((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir atividade'));
      return false;
    }
  }, []);

  return { data, loading, error, create, delete: delete_, refetch: fetch };
}
