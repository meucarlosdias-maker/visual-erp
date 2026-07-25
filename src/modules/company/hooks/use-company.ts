'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCompanyAction, saveCompanyAction } from '../actions/company-actions';
import type { Company } from '../types';

interface UseCompanyReturn {
  company: Company | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  save: (data: Company) => Promise<boolean>;
}

export function useCompany(): UseCompanyReturn {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getCompanyAction();
    if (!result.success) {
      setError(result.message);
    } else if (result.data) {
      setCompany(result.data);
    }
    setLoading(false);
  }, []);

  const save = useCallback(async (data: Company): Promise<boolean> => {
    setSaving(true);
    setError(null);
    const result = await saveCompanyAction(data);
    if (!result.success) {
      setError(result.message);
      setSaving(false);
      return false;
    }
    if (result.data) setCompany(result.data);
    setSaving(false);
    return true;
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { company, loading, saving, error, refresh, save };
}
