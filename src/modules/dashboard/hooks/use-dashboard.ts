'use client';
import { useState, useEffect, useCallback } from 'react';
import { metricsService } from '../services';
import type { DashboardMetrics, ChartDataPoint } from '../types';

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setMetrics(await metricsService.getAll()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { metrics, loading, reload: load };
}

export function useChartData(chartName: string) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetcher = async () => {
      switch (chartName) {
        case 'revenue': return metricsService.getRevenueByMonth();
        case 'quotations': return metricsService.getQuotationsByMonth();
        case 'production-dept': return metricsService.getProductionByDepartment();
        case 'funnel': return metricsService.getCommercialFunnel();
        case 'financial-flow': return metricsService.getFinancialFlow();
        case 'projects-status': return metricsService.getProjectsByStatus();
        default: return [];
      }
    };
    fetcher().then(setData).finally(() => setLoading(false));
  }, [chartName]);

  return { data, loading };
}

export function useAllCharts() {
  const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
  const [quotationsData, setQuotationsData] = useState<ChartDataPoint[]>([]);
  const [productionDeptData, setProductionDeptData] = useState<ChartDataPoint[]>([]);
  const [funnelData, setFunnelData] = useState<ChartDataPoint[]>([]);
  const [financialFlowData, setFinancialFlowData] = useState<ChartDataPoint[]>([]);
  const [projectsStatusData, setProjectsStatusData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      metricsService.getRevenueByMonth(),
      metricsService.getQuotationsByMonth(),
      metricsService.getProductionByDepartment(),
      metricsService.getCommercialFunnel(),
      metricsService.getFinancialFlow(),
      metricsService.getProjectsByStatus(),
    ]).then(([rev, quot, prod, fun, flow, proj]) => {
      setRevenueData(rev);
      setQuotationsData(quot);
      setProductionDeptData(prod);
      setFunnelData(fun);
      setFinancialFlowData(flow);
      setProjectsStatusData(proj);
    }).finally(() => setLoading(false));
  }, []);

  return {
    revenueData, quotationsData, productionDeptData,
    funnelData, financialFlowData, projectsStatusData,
    loading,
  };
}
