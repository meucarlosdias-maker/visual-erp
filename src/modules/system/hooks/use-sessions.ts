'use client';
import { useState, useEffect, useCallback } from 'react';
import { sessionService } from '../services/session-service';
import type { UserSession } from '../types';

export function useSessions() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, count] = await Promise.all([
        sessionService.list(),
        sessionService.getActiveCount(),
      ]);
      setSessions(list);
      setActiveCount(count);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { sessions, activeCount, loading, reload: load };
}

export function useSessionActions() {
  const revoke = useCallback(async (id: string) => {
    await sessionService.revoke(id);
  }, []);

  return { revoke };
}
