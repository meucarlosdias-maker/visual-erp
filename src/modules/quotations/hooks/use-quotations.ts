'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Quotation } from '../types';
import { quotationService } from '../services/quotation-service';
import { toast } from '@/components/feedback';

export function useQuotations() {
  const [data, setData] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await quotationService.list();
      if (Array.isArray(result)) setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data_: Record<string, unknown>): Promise<boolean> => {
    try {
      await quotationService.create(data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar orçamento');
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, data_: Record<string, unknown>): Promise<boolean> => {
    try {
      const result = await quotationService.update(id, data_);
      await fetch();
      if (result.version > 1) {
        toast.info(`Nova versão criada: v${result.version}`);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar orçamento');
      return false;
    }
  }, [fetch]);

  const updateStatus = useCallback(async (id: string, status: string): Promise<boolean> => {
    try {
      await quotationService.updateStatus(id, status);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    }
  }, [fetch]);

  const del = useCallback(async (id: string): Promise<boolean> => {
    try {
      await quotationService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover orçamento');
      return false;
    }
  }, [fetch]);

  const duplicate = useCallback(async (id: string): Promise<boolean> => {
    try {
      await quotationService.duplicate(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao duplicar orçamento');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, create, update, updateStatus, delete: del, duplicate };
}
