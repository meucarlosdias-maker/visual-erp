'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TenantPlanInfo, SubscriptionInfo, CompanySettingsInfo } from '@/core/tenant';
import { useTenant } from '@/core/tenant';
import { CompanyService, PlanService, SubscriptionService, CompanySettingsService } from '../services';

export function useCompanyDashboard() {
  const tenant = useTenant();
  const [data, setData] = useState<Awaited<ReturnType<typeof CompanyService.getDashboard>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant.id) return;
    setLoading(true);
    CompanyService.getDashboard(tenant.id).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [tenant.id]);

  return { data, loading };
}

export function useCompany() {
  const tenant = useTenant();
  const [company, setCompany] = useState<Awaited<ReturnType<typeof CompanyService.getCurrent>> | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!tenant.id) return;
    setLoading(true);
    const result = await CompanyService.getCurrent(tenant.id);
    setCompany(result);
    setLoading(false);
  }, [tenant.id]);

  useEffect(() => { refetch(); }, [refetch]);

  const update = useCallback(async (data: Record<string, unknown>) => {
    const updated = await CompanyService.update(tenant.id, data);
    await refetch();
    return updated;
  }, [tenant.id, refetch]);

  return { company, loading, refetch, update };
}

export function usePlans() {
  const [plans, setPlans] = useState<TenantPlanInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const result = await PlanService.list();
    setPlans(result);
    setLoading(false);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { plans, loading, refetch };
}

export function useSubscription() {
  const tenant = useTenant();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!tenant.id) return;
    setLoading(true);
    const result = await SubscriptionService.getCurrent(tenant.id);
    setSubscription(result);
    setLoading(false);
  }, [tenant.id]);

  useEffect(() => { refetch(); }, [refetch]);

  const changePlan = useCallback(async (planId: string) => {
    const result = await SubscriptionService.changePlan(tenant.id, planId);
    await refetch();
    return result;
  }, [tenant.id, refetch]);

  return { subscription, loading, refetch, changePlan };
}

export function useCompanySettings() {
  const tenant = useTenant();
  const [settings, setSettings] = useState<CompanySettingsInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!tenant.id) return;
    setLoading(true);
    const result = await CompanySettingsService.getCurrent(tenant.id);
    setSettings(result);
    setLoading(false);
  }, [tenant.id]);

  useEffect(() => { refetch(); }, [refetch]);

  const update = useCallback(async (data: Record<string, unknown>) => {
    const result = await CompanySettingsService.update(tenant.id, data);
    await refetch();
    return result;
  }, [tenant.id, refetch]);

  return { settings, loading, refetch, update };
}
