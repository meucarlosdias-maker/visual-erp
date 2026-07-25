'use client';

import { Clock, CheckCircle2 } from '@/constants/icons';
import type { WorkOrderEvent } from '../types';

interface WorkOrderTimelineProps {
  events: WorkOrderEvent[];
}

function formatDateTime(d: Date | string): string {
  return new Date(d).toLocaleString('pt-BR');
}

export function WorkOrderTimeline({ events }: WorkOrderTimelineProps) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">Nenhum evento registrado.</p>;
  }

  return (
    <div className="space-y-0">
      {events.map((event, idx) => (
        <div key={event.id} className="flex gap-3 pb-4 relative">
          {idx < events.length - 1 && (
            <div className="absolute left-3.5 top-8 bottom-0 w-px bg-border" />
          )}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center z-10">
            {event.type === 'STATUS_CHANGE' || event.type === 'FINISHED' || event.type === 'DELIVERED' ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm">{event.description}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(event.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
