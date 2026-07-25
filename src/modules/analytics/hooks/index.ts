'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DashboardData, SavedReportData, KpiCard, AnalyticsSummary, TimeSeries, MetricCategory } from '@/core/analytics';
import { DashboardService, ReportService, MetricService } from '../services';

export function useDashboards(companyId = 'company-1') {
  const [data, setData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const result = await DashboardService.list(companyId);
    setData(result);
    setLoading(false);
  }, [companyId]);

  useEffect(() => { refetch(); }, [refetch]);

  const create = useCallback(async (input: Parameters<typeof DashboardService.create>[1]) => {
    const created = await DashboardService.create(companyId, input);
    await refetch();
    return created;
  }, [companyId, refetch]);

  const remove = useCallback(async (id: string) => {
    const ok = await DashboardService.delete(id);
    if (ok) await refetch();
    return ok;
  }, [refetch]);

  return { data, loading, refetch, create, delete: remove };
}

export function useReports(companyId = 'company-1') {
  const [data, setData] = useState<SavedReportData[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const result = await ReportService.list(companyId);
    setData(result);
    setLoading(false);
  }, [companyId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, refetch };
}

export function useKpis(companyId = 'company-1', category?: MetricCategory) {
  const [kpis, setKpis] = useState<KpiCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    MetricService.getKpis(companyId, category).then((result) => {
      setKpis(result);
      setLoading(false);
    });
  }, [companyId, category]);

  return { kpis, loading };
}

export function useAnalyticsSummary(companyId = 'company-1') {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    MetricService.getSummary(companyId).then((result) => {
      setSummary(result);
      setLoading(false);
    });
  }, [companyId]);

  return { summary, loading };
}

export function useMetricHistory(companyId = 'company-1', metric?: string) {
  const [timeSeries, setTimeSeries] = useState<TimeSeries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!metric) return;
    setLoading(true);
    MetricService.getTimeSeries(companyId, metric).then((result) => {
      setTimeSeries(result);
      setLoading(false);
    });
  }, [companyId, metric]);

  return { timeSeries, loading };
}
