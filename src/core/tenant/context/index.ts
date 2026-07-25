'use client';

import { createContext, useContext } from 'react';
import type { TenantInfo, TenantContextData, SubscriptionInfo, CompanySettingsInfo } from '../types';

const defaultTenant: TenantInfo = {
  id: '',
  name: '',
  tradeName: null,
  document: null,
  email: null,
  phone: null,
  logoUrl: null,
  status: 'active',
  timezone: 'America/Sao_Paulo',
  language: 'pt-BR',
  currency: 'BRL',
  planId: null,
  plan: null,
};

export const TenantContext = createContext<TenantContextData>({
  tenant: defaultTenant,
  subscription: null,
  settings: null,
});

export function useTenantContext(): TenantContextData {
  return useContext(TenantContext);
}

export function useTenant(): TenantInfo {
  return useContext(TenantContext).tenant;
}

export function useTenantSubscription(): SubscriptionInfo | null {
  return useContext(TenantContext).subscription;
}

export function useTenantSettings(): CompanySettingsInfo | null {
  return useContext(TenantContext).settings;
}

export { defaultTenant };
export type { TenantContextData };
