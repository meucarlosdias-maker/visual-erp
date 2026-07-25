'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AccountsPayable } from '../types';
import { financialService } from '../services/financial-service';

export function usePayables() {
  const [data, setData] = useState<AccountsPayable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await financialService.listPayables();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contas a pagar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const pay = useCallback(async (id: string, paidAmount: number, paymentMethod: string): Promise<boolean> => {
    try {
      await financialService.payPayable(id, paidAmount, paymentMethod);
      await fetch();
      return true;
    } catch {
      return false;
    }
  }, [fetch]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await financialService.deletePayable(id);
      await fetch();
      return true;
    } catch {
      return false;
    }
  }, [fetch]);

  return { data, loading, error, pay, remove };
}
