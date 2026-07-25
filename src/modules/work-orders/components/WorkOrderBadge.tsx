'use client';

import { WORK_ORDER_STATUS_LABELS, WORK_ORDER_STATUS_COLORS, WORK_ORDER_PRIORITY_LABELS, WORK_ORDER_PRIORITY_COLORS } from '../validators';
import type { WorkOrderStatus } from '../types';

export function WorkOrderStatusBadge({ status }: { status: WorkOrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${WORK_ORDER_STATUS_COLORS[status] ?? ''}`}>
      {WORK_ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${WORK_ORDER_PRIORITY_COLORS[priority] ?? ''}`}>
      {WORK_ORDER_PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}
