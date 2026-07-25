'use client';

import { useState, useEffect, useCallback } from 'react';
import { financialService } from '../services/financial-service';

export interface Overview {
  balance: number;
  receivablesPending: number;
  payablesPending: number;
  receivablesOverdue: number;
  payablesOverdue: number;
  cashFlowMonth: number;
  defaultedAmount: number;
  monthlyResult: number;
  netForecast: number;
}

export function useFinancialOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await financialService.getOverview();
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading };
}
