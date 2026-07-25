'use client';

import { useState, useEffect, useCallback } from 'react';
import { devOpsModuleService } from '../services';
import type { SystemLog, HealthCheck, Deployment, Backup, DevOpsDashboard } from '../types';

export function useDevOpsDashboard() {
  const [data, setData] = useState<DevOpsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => { setLoading(true); try { setData(await devOpsModuleService.getDashboard()); } catch { setData(null); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useSystemLogs() {
  const [data, setData] = useState<SystemLog[]>([]); const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => { setLoading(true); try { setData(await devOpsModuleService.listLogs()); } catch { setData([]); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useHealthChecks() {
  const [data, setData] = useState<HealthCheck[]>([]); const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{ total: number; healthy: number; degraded: number; unhealthy: number; unknown: number; avgResponseTime: number } | null>(null);
  const fetch = useCallback(async () => { setLoading(true); try { setData(await devOpsModuleService.getHealthChecks()); setSummary(await devOpsModuleService.getHealthSummary()); } catch { setData([]); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, summary, refetch: fetch };
}

export function useDeployments() {
  const [data, setData] = useState<Deployment[]>([]); const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => { setLoading(true); try { setData(await devOpsModuleService.listDeployments()); } catch { setData([]); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useBackups() {
  const [data, setData] = useState<Backup[]>([]); const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ total: number; totalSize: number; lastBackup: Date | null } | null>(null);
  const fetch = useCallback(async () => { setLoading(true); try { setData(await devOpsModuleService.listBackups()); setStats(await devOpsModuleService.getBackupStats()); } catch { setData([]); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, stats, refetch: fetch };
}
