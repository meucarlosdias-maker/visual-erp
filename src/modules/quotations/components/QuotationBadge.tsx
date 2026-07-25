'use client';

import { QUOTATION_STATUS_LABELS, QUOTATION_STATUS_COLORS } from '../validators';
import type { QuotationStatus } from '../types';

interface QuotationBadgeProps {
  status: QuotationStatus;
}

export function QuotationBadge({ status }: QuotationBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${QUOTATION_STATUS_COLORS[status] ?? ''}`}>
      {QUOTATION_STATUS_LABELS[status] ?? status}
    </span>
  );
}
