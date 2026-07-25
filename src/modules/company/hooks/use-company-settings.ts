'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CompanySettings, CompanyPreferences, CompanySequence } from '../types/company-settings';
import { companySettingsService } from '../services/company-settings-service';

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await companySettingsService.get();
      setSettings(data);
    } catch {
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const save = useCallback(async (data: Record<string, unknown>): Promise<boolean> => {
    setSaving(true);
    try {
      const updated = await companySettingsService.save(data);
      setSettings(updated);
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { settings, loading, saving, save, refetch: fetch };
}

export function useCompanyPreferences() {
  const [preferences, setPreferences] = useState<CompanyPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await companySettingsService.getPreferences();
      setPreferences(data);
    } catch {
      setPreferences(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const save = useCallback(async (data: Record<string, unknown>): Promise<boolean> => {
    setSaving(true);
    try {
      const updated = await companySettingsService.savePreferences(data);
      setPreferences(updated);
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { preferences, loading, saving, save, refetch: fetch };
}

export function useCompanySequences() {
  const [sequences, setSequences] = useState<CompanySequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await companySettingsService.listSequences();
      setSequences(data);
    } catch {
      setSequences([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const update = useCallback(async (id: string, data: Partial<CompanySequence>): Promise<boolean> => {
    setSaving(true);
    try {
      const updated = await companySettingsService.updateSequence(id, data);
      setSequences((prev) => prev.map((s) => s.id === id ? updated : s));
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { sequences, loading, saving, update, refetch: fetch };
}
