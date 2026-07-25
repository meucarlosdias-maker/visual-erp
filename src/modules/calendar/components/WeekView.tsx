'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '../types';

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const TYPE_DOT_COLORS: Record<string, string> = {
  VISIT: 'bg-blue-500', MEETING: 'bg-purple-500',
  INSTALLATION: 'bg-orange-500', PRODUCTION: 'bg-indigo-500',
  DELIVERY: 'bg-green-500', PAYMENT: 'bg-red-500',
  RECEIPT: 'bg-emerald-500', INTERNAL: 'bg-gray-500',
  REMINDER: 'bg-yellow-500', OTHER: 'bg-slate-500',
};

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export function WeekView({ currentDate, events, onEventClick, onDateClick }: WeekViewProps) {
  const weekStart = useMemo(() => getStartOfWeek(currentDate), [currentDate]);
  const today = new Date();

  const days = useMemo(() => {
    return WEEKDAYS.map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const eventsByDayHour = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      if (e.allDay) continue;
      const d = new Date(e.startDate);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    }
    return map;
  }, [events]);

  const allDayByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      if (!e.allDay) continue;
      const d = new Date(e.startDate);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    }
    return map;
  }, [events]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 border-b">
        <div className="p-2 border-r bg-muted/50" />
        {days.map((d, i) => {
          const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
          return (
            <div
              key={i}
              className={cn('p-2 text-center border-r last:border-r-0 cursor-pointer hover:bg-accent/30', isToday && 'bg-primary/5')}
              onClick={() => onDateClick(d)}
            >
              <div className="text-xs text-muted-foreground">{WEEKDAYS[i]}</div>
              <div className={cn('text-sm font-semibold mx-auto w-7 h-7 flex items-center justify-center rounded-full', isToday && 'bg-primary text-primary-foreground')}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      {HOURS.map((hour) => (
        <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
          <div className="p-1 border-r text-xs text-muted-foreground flex items-start justify-center pt-2 bg-muted/20">
            {hour.toString().padStart(2, '0')}h
          </div>
          {days.map((d, i) => {
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            const hourEvents = (eventsByDayHour[key] ?? []).filter((e) => {
              const h = new Date(e.startDate).getHours();
              return h === hour;
            });
            const dayAllDay = allDayByDay[key] ?? [];
            return (
              <div key={i} className="min-h-[48px] p-0.5 border-r last:border-r-0 relative">
                {i === 0 && hour === 7 && dayAllDay.length > 0 && (
                  <div className="absolute -top-5 left-0 right-0 text-[10px] text-muted-foreground px-1 truncate">
                    {dayAllDay.length} dia inteiro
                  </div>
                )}
                {hourEvents.map((e) => (
                  <div
                    key={e.id}
                    className={cn(
                      'text-[11px] truncate rounded px-1 py-0.5 mb-0.5 cursor-pointer border-l-2 hover:bg-accent',
                      TYPE_DOT_COLORS[e.type] ?? 'border-l-slate-500',
                    )}
                    onClick={() => onEventClick(e)}
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
