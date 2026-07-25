'use client';

import { useState, useEffect, useCallback } from 'react';
import { securityModuleService } from '../services';
import type { AuditEvent, AccessLog, SecurityPolicy, DataRetentionPolicy, ComplianceStatus } from '../types';
import type { AuditInput, PolicyInput, PolicyUpdate, RetentionInput, RetentionUpdate } from '../schemas';

export function useAuditEvents() {
  const [data, setData] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => {
    setLoading(true);
    try { setData(await securityModuleService.listAuditEvents()); }
    catch { setData([]); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useAccessLogs() {
  const [data, setData] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => {
    setLoading(true);
    try { setData(await securityModuleService.listAccessLogs()); }
    catch { setData([]); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function usePolicies() {
  const [data, setData] = useState<SecurityPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try { setData(await securityModuleService.listPolicies()); }
    catch (err) { setError(err instanceof Error ? err : new Error('Erro ao carregar políticas')); setData([]); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  const create = useCallback(async (input: PolicyInput) => {
    try { await securityModuleService.createPolicy(input); await fetch(); return true; }
    catch { return false; }
  }, [fetch]);
  const update = useCallback(async (id: string, input: PolicyUpdate) => {
    try { await securityModuleService.updatePolicy(id, input); await fetch(); return true; }
    catch { return false; }
  }, [fetch]);
  const del = useCallback(async (id: string) => {
    try { await securityModuleService.deletePolicy(id); setData((prev) => prev.filter((p) => p.id !== id)); return true; }
    catch { return false; }
  }, []);
  return { data, loading, error, create, update, delete: del, refetch: fetch };
}

export function useRetentionPolicies() {
  const [data, setData] = useState<DataRetentionPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try { setData(await securityModuleService.listRetentionPolicies()); }
    catch (err) { setError(err instanceof Error ? err : new Error('Erro ao carregar retenção')); setData([]); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  const create = useCallback(async (input: RetentionInput) => {
    try { await securityModuleService.createRetentionPolicy(input); await fetch(); return true; }
    catch { return false; }
  }, [fetch]);
  const update = useCallback(async (id: string, input: RetentionUpdate) => {
    try { await securityModuleService.updateRetentionPolicy(id, input); await fetch(); return true; }
    catch { return false; }
  }, [fetch]);
  const del = useCallback(async (id: string) => {
    try { await securityModuleService.deleteRetentionPolicy(id); setData((prev) => prev.filter((r) => r.id !== id)); return true; }
    catch { return false; }
  }, []);
  return { data, loading, error, create, update, delete: del, refetch: fetch };
}

export function useCompliance() {
  const [data, setData] = useState<ComplianceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const checks = await securityModuleService.getAllCompliance();
      setData(checks as unknown as ComplianceStatus[]);
    }
    catch { setData([]); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}
