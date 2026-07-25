'use client';
import { useState, useEffect, useCallback } from 'react';
import { auditService } from '../services/audit-service';
import type { AuditLog } from '../types';

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setLogs(await auditService.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { logs, loading, reload: load };
}
