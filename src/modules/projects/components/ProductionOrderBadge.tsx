'use client';

import { PRODUCTION_ORDER_STATUS_LABELS, PRODUCTION_ORDER_STATUS_COLORS } from '../validators/production-order';

interface ProductionOrderBadgeProps {
  status: string;
}

export function ProductionOrderBadge({ status }: ProductionOrderBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRODUCTION_ORDER_STATUS_COLORS[status] ?? ''}`}>
      {PRODUCTION_ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}
