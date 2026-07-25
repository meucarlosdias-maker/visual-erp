'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CashFlow } from '../types';
import { financialService } from '../services/financial-service';

export function useCashFlow() {
  const [data, setData] = useState<CashFlow[]>([]);
  const [summary, setSummary] = useState<{ income: number; expense: number; balance: number }>({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const [entries, bal] = await Promise.all([
        financialService.listCashFlow(),
        financialService.getCashFlowBalance(),
      ]);
      setData(entries);
      setSummary(bal);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, summary, loading };
}
