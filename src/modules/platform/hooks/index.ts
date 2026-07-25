'use client';

import { useState, useEffect, useCallback } from 'react';
import { platformModuleService } from '../services';
import type { PlatformDashboardData, Company, Plan, License, PlatformMetric, PlatformUser, Announcement } from '../types';
import type { CompanyInput, CompanyUpdate, PlanInput, PlanUpdate, AnnouncementInput, AnnouncementUpdate, PlatformUserInput } from '../schemas';

export function useDashboard() {
  const [data, setData] = useState<PlatformDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => {
    setLoading(true);
    try { setData(await platformModuleService.getDashboard()); } catch { setData(null); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useCompanies() {
  const [data, setData] = useState<Company[]>([]); const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => { setLoading(true); try { setData(await platformModuleService.listCompanies()); } catch { setData([]); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  const blockFn = useCallback(async (id: string) => { try { await platformModuleService.blockCompany(id); await fetch(); return true; } catch { return false; } }, [fetch]);
  const unblockFn = useCallback(async (id: string) => { try { await platformModuleService.unblockCompany(id); await fetch(); return true; } catch { return false; } }, [fetch]);
  return { data, loading, block: blockFn, unblock: unblockFn, refetch: fetch };
}

export function usePlans() {
  const [data, setData] = useState<Plan[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<Error | null>(null);
  const fetch = useCallback(async () => { setLoading(true); setError(null); try { setData(await platformModuleService.listPlans()); } catch (err) { setError(err instanceof Error ? err : new Error('Erro ao carregar planos')); setData([]); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  const create = useCallback(async (input: PlanInput) => { try { await platformModuleService.createPlan(input); await fetch(); return true; } catch { return false; } }, [fetch]);
  const update = useCallback(async (id: string, input: PlanUpdate) => { try { await platformModuleService.updatePlan(id, input); await fetch(); return true; } catch { return false; } }, [fetch]);
  const del = useCallback(async (id: string) => { try { await platformModuleService.deletePlan(id); setData((prev) => prev.filter((p) => p.id !== id)); return true; } catch { return false; } }, []);
  return { data, loading, error, create, update, delete: del, refetch: fetch };
}

export function useLicenses() {
  const [data, setData] = useState<License[]>([]); const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => { setLoading(true); try { setData(await platformModuleService.listLicenses()); } catch { setData([]); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function usePlatformUsers() {
  const [data, setData] = useState<PlatformUser[]>([]); const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => { setLoading(true); try { setData(await platformModuleService.listPlatformUsers()); } catch { setData([]); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useMetrics() {
  const [data, setData] = useState<PlatformMetric[]>([]); const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => { setLoading(true); try { setData(await platformModuleService.listMetrics()); } catch { setData([]); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useAnnouncements() {
  const [data, setData] = useState<Announcement[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<Error | null>(null);
  const fetch = useCallback(async () => { setLoading(true); setError(null); try { setData(await platformModuleService.listAnnouncements()); } catch (err) { setError(err instanceof Error ? err : new Error('Erro ao carregar avisos')); setData([]); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  const create = useCallback(async (input: AnnouncementInput) => { try { await platformModuleService.createAnnouncement(input); await fetch(); return true; } catch { return false; } }, [fetch]);
  const update = useCallback(async (id: string, input: AnnouncementUpdate) => { try { await platformModuleService.updateAnnouncement(id, input); await fetch(); return true; } catch { return false; } }, [fetch]);
  const del = useCallback(async (id: string) => { try { await platformModuleService.deleteAnnouncement(id); setData((prev) => prev.filter((a) => a.id !== id)); return true; } catch { return false; } }, []);
  return { data, loading, error, create, update, delete: del, refetch: fetch };
}
