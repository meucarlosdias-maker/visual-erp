'use client';

import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../validators';
import type { ProjectStatus } from '../types';

interface ProjectBadgeProps {
  status: ProjectStatus;
}

export function ProjectBadge({ status }: ProjectBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PROJECT_STATUS_COLORS[status] ?? ''}`}>
      {PROJECT_STATUS_LABELS[status] ?? status}
    </span>
  );
}
