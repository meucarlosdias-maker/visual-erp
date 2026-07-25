'use client';

import { useMemo } from 'react';
import { Clock } from '@/constants/icons';
import { cn } from '@/lib/utils';
import { CALENDAR_EVENT_TYPE_LABELS } from '../validators';
import type { CalendarEvent } from '../types';

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

const TYPE_DOT_COLORS: Record<string, string> = {
  VISIT: 'bg-blue-500', MEETING: 'bg-purple-500',
  INSTALLATION: 'bg-orange-500', PRODUCTION: 'bg-indigo-500',
  DELIVERY: 'bg-green-500', PAYMENT: 'bg-red-500',
  RECEIPT: 'bg-emerald-500', INTERNAL: 'bg-gray-500',
  REMINDER: 'bg-yellow-500', OTHER: 'bg-slate-500',
};

interface DayAgendaProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function DayAgenda({ events, onEventClick }: DayAgendaProps) {
  const allDayEvents = useMemo(() => events.filter((e) => e.allDay), [events]);
  const timedEvents = useMemo(() => events.filter((e) => !e.allDay), [events]);

  const eventsByHour = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    for (const e of timedEvents) {
      const h = new Date(e.startDate).getHours();
      if (!map[h]) map[h] = [];
      map[h].push(e);
    }
    return map;
  }, [timedEvents]);

  return (
    <div className="space-y-4">
      {allDayEvents.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">Dia Inteiro</p>
          {allDayEvents.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-accent/50"
              onClick={() => onEventClick(e)}
            >
              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', TYPE_DOT_COLORS[e.type] ?? 'bg-slate-500')} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{e.title}</p>
                <p className="text-xs text-muted-foreground">{CALENDAR_EVENT_TYPE_LABELS[e.type]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-0">
        {HOURS.map((hour) => {
          const hourEvents = eventsByHour[hour] ?? [];
          return (
            <div key={hour} className="flex border-t min-h-[60px]">
              <div className="w-14 flex-shrink-0 flex items-start justify-center pt-1">
                <span className="text-xs text-muted-foreground">{hour.toString().padStart(2, '0')}h</span>
              </div>
              <div className="flex-1 p-1 space-y-1">
                {hourEvents.map((e) => {
                  const start = new Date(e.startDate);
                  const end = new Date(e.endDate);
                  return (
                    <div
                      key={e.id}
                      className="flex items-start gap-2 p-2 rounded border cursor-pointer hover:bg-accent/50"
                      onClick={() => onEventClick(e)}
                    >
                      <div className={cn('w-2 h-2 rounded-full mt-1 flex-shrink-0', TYPE_DOT_COLORS[e.type] ?? 'bg-slate-500')} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{e.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
