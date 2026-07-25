'use client';

import { FINANCIAL_STATUS_LABELS, FINANCIAL_STATUS_COLORS } from '../validators';
import type { FinancialStatus } from '../types';

export function FinancialBadge({ status }: { status: FinancialStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${FINANCIAL_STATUS_COLORS[status] ?? ''}`}>
      {FINANCIAL_STATUS_LABELS[status] ?? status}
    </span>
  );
}
