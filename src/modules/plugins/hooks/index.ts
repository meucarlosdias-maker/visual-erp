'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PluginRecord, PluginExecutionRecord, PluginSummary, PluginCategory } from '@/core/plugins';
import { PluginService, MarketplaceService, ExecutionService } from '../services';

export function usePlugins(companyId = 'company-1') {
  const [data, setData] = useState<PluginRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await PluginService.list(companyId);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => { refetch(); }, [refetch]);

  const create = useCallback(async (input: Parameters<typeof PluginService.create>[1]) => {
    const created = await PluginService.create(companyId, input);
    await refetch();
    return created;
  }, [companyId, refetch]);

  const update = useCallback(async (id: string, input: Parameters<typeof PluginService.update>[1]) => {
    const updated = await PluginService.update(id, input);
    await refetch();
    return updated;
  }, [refetch]);

  const remove = useCallback(async (id: string) => {
    const ok = await PluginService.remove(id);
    if (ok) await refetch();
    return ok;
  }, [refetch]);

  const toggle = useCallback(async (id: string) => {
    const updated = await PluginService.toggle(id);
    await refetch();
    return updated;
  }, [refetch]);

  return { data, loading, refetch, create, update, delete: remove, toggle };
}

export function usePlugin(id: string) {
  const [plugin, setPlugin] = useState<PluginRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    PluginService.getById(id).then((result) => {
      setPlugin(result);
      setLoading(false);
    });
  }, [id]);

  return { plugin, loading };
}

export function usePluginSummaries(companyId = 'company-1') {
  const [summaries, setSummaries] = useState<PluginSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    PluginService.getSummaries(companyId).then((result) => {
      setSummaries(result);
      setLoading(false);
    });
  }, [companyId]);

  return { summaries, loading };
}

export function useMarketplace(companyId = 'company-1') {
  const [listings, setListings] = useState<Awaited<ReturnType<typeof MarketplaceService.search>>>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await MarketplaceService.search(companyId);
    setListings(result);
    setLoading(false);
  }, [companyId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { listings, loading, refetch: fetchData };
}

export function usePluginExecutions(pluginId?: string) {
  const [executions, setExecutions] = useState<PluginExecutionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ExecutionService.list(pluginId).then((result) => {
      setExecutions(result);
      setLoading(false);
    });
  }, [pluginId]);

  return { executions, loading };
}

export function usePluginFilter() {
  const [category, setCategory] = useState<PluginCategory | ''>('');
  const [enabled, setEnabled] = useState<boolean | ''>('');
  const [search, setSearch] = useState('');

  const reset = useCallback(() => {
    setCategory('');
    setEnabled('');
    setSearch('');
  }, []);

  const hasFilter = category !== '' || enabled !== '' || search !== '';

  return { category, setCategory, enabled, setEnabled, search, setSearch, reset, hasFilter };
}
