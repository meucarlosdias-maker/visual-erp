'use client';
import { useState, useEffect, useCallback } from 'react';
import { logService } from '../services/log-service';
import type { SystemLog } from '../types';

export function useSystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setLogs(await logService.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { logs, loading, reload: load };
}
