'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Quotation } from '../types';
import { quotationService } from '../services/quotation-service';

export function useQuotation(id: string | undefined) {
  const [data, setData] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await quotationService.get(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar orçamento');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = useCallback(async (status: string): Promise<boolean> => {
    try {
      await quotationService.updateStatus(id!, status);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    }
  }, [id, fetch]);

  const del = useCallback(async (): Promise<boolean> => {
    if (!id) return false;
    try {
      await quotationService.delete(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover orçamento');
      return false;
    }
  }, [id]);

  const duplicate = useCallback(async (): Promise<string | null> => {
    if (!id) return null;
    try {
      const result = await quotationService.duplicate(id);
      return result.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao duplicar orçamento');
      return null;
    }
  }, [id]);

  return { data, loading, error, updateStatus, delete: del, duplicate };
}
