'use client';
import { useState, useEffect, useCallback } from 'react';
import { securityService } from '../services/security-service';
import type { SecuritySettings } from '../types';

export function useSecurity() {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setSettings(await securityService.get()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = useCallback(async (data: Partial<SecuritySettings>) => {
    const updated = await securityService.update(data);
    setSettings(updated);
    return updated;
  }, []);

  return { settings, loading, update };
}
