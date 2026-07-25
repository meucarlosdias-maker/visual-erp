'use client';

import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_TEMPERATURE_LABELS, LEAD_TEMPERATURE_COLORS, VISIT_STATUS_LABELS, VISIT_STATUS_COLORS } from '../validators';
import type { LeadStatus, LeadTemperature, VisitStatus } from '../types';

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${LEAD_STATUS_COLORS[status] ?? ''}`}>
      {LEAD_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function TemperatureBadge({ temperature }: { temperature: LeadTemperature }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${LEAD_TEMPERATURE_COLORS[temperature] ?? ''}`}>
      {LEAD_TEMPERATURE_LABELS[temperature] ?? temperature}
    </span>
  );
}

export function VisitStatusBadge({ status }: { status: VisitStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VISIT_STATUS_COLORS[status] ?? ''}`}>
      {VISIT_STATUS_LABELS[status] ?? status}
    </span>
  );
}
