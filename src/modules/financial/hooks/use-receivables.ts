'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AccountsReceivable } from '../types';
import { financialService } from '../services/financial-service';

export function useReceivables() {
  const [data, setData] = useState<AccountsReceivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await financialService.listReceivables();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contas a receber');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const receive = useCallback(async (id: string, receivedAmount: number, paymentMethod: string): Promise<boolean> => {
    try {
      await financialService.receiveReceivable(id, receivedAmount, paymentMethod);
      await fetch();
      return true;
    } catch {
      return false;
    }
  }, [fetch]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await financialService.deleteReceivable(id);
      await fetch();
      return true;
    } catch {
      return false;
    }
  }, [fetch]);

  return { data, loading, error, receive, remove };
}
