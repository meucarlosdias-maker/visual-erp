'use client';

import { TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../validators';
import type { TaskStatus } from '../types';

interface TaskBadgeProps {
  status: TaskStatus;
}

export function TaskBadge({ status }: TaskBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TASK_STATUS_COLORS[status] ?? ''}`}>
      {TASK_STATUS_LABELS[status] ?? status}
    </span>
  );
}
