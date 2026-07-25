'use client';

import { INSTALLATION_STATUS_LABELS, INSTALLATION_STATUS_COLORS } from '../validators';
import type { InstallationStatus } from '../types';

interface InstallationBadgeProps {
  status: InstallationStatus;
}

export function InstallationBadge({ status }: InstallationBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${INSTALLATION_STATUS_COLORS[status] ?? ''}`}>
      {INSTALLATION_STATUS_LABELS[status] ?? status}
    </span>
  );
}
