'use client';

import { useState, useEffect, useCallback } from 'react';
import { jobModuleService } from '../services';
import type { Job, JobExecution, ScheduledJob, EventLog } from '../types';
import type { JobInput, JobUpdate, ScheduledJobInput } from '../schemas';

export function useJobs() {
  const [data, setData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try { const list = await jobModuleService.listJobs(); setData(list); }
    catch (err) { setError(err instanceof Error ? err : new Error('Erro ao carregar jobs')); setData([]); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  const create = useCallback(async (input: JobInput) => {
    try { await jobModuleService.createJob(input); await fetch(); return true; }
    catch { return false; }
  }, [fetch]);
  const update = useCallback(async (id: string, input: JobUpdate) => {
    try { await jobModuleService.updateJob(id, input); await fetch(); return true; }
    catch { return false; }
  }, [fetch]);
  const del = useCallback(async (id: string) => {
    try { await jobModuleService.deleteJob(id); setData((prev) => prev.filter((j) => j.id !== id)); return true; }
    catch { return false; }
  }, []);
  return { data, loading, error, create, update, delete: del, refetch: fetch };
}

export function useExecutions(jobId?: string) {
  const [data, setData] = useState<JobExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => {
    setLoading(true);
    try { const list = await jobModuleService.listExecutions(jobId); setData(list); }
    catch { setData([]); }
    finally { setLoading(false); }
  }, [jobId]);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useSchedules() {
  const [data, setData] = useState<ScheduledJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try { const list = await jobModuleService.listSchedules(); setData(list); }
    catch (err) { setError(err instanceof Error ? err : new Error('Erro ao carregar agendamentos')); setData([]); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  const create = useCallback(async (input: ScheduledJobInput) => {
    try { await jobModuleService.createSchedule(input); await fetch(); return true; }
    catch { return false; }
  }, [fetch]);
  const update = useCallback(async (id: string, input: Partial<ScheduledJobInput>) => {
    try { await jobModuleService.updateSchedule(id, input); await fetch(); return true; }
    catch { return false; }
  }, [fetch]);
  const del = useCallback(async (id: string) => {
    try { await jobModuleService.deleteSchedule(id); setData((prev) => prev.filter((s) => s.id !== id)); return true; }
    catch { return false; }
  }, []);
  return { data, loading, error, create, update, delete: del, refetch: fetch };
}

export function useEvents() {
  const [data, setData] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => {
    setLoading(true);
    try { const list = await jobModuleService.listEvents(); setData(list); }
    catch { setData([]); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}
