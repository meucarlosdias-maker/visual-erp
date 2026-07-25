'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '../types';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const TYPE_EVENT_COLORS: Record<string, string> = {
  VISIT: 'border-l-blue-500', MEETING: 'border-l-purple-500',
  INSTALLATION: 'border-l-orange-500', PRODUCTION: 'border-l-indigo-500',
  DELIVERY: 'border-l-green-500', PAYMENT: 'border-l-red-500',
  RECEIPT: 'border-l-emerald-500', INTERNAL: 'border-l-gray-500',
  REMINDER: 'border-l-yellow-500', OTHER: 'border-l-slate-500',
};

interface CalendarMonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarMonthView({ currentDate, events, onDateClick, onEventClick }: CalendarMonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const days = useMemo(() => {
    const result: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [firstDay, daysInMonth]);

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    for (const e of events) {
      const d = new Date(e.startDate);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(e);
      }
    }
    return map;
  }, [events, month, year]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 border-b">
        {WEEKDAYS.map((w) => (
          <div key={w} className="p-2 text-center text-xs font-medium text-muted-foreground bg-muted/50 border-r last:border-r-0">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} className="min-h-[100px] bg-muted/20 border-r border-b last:border-r-0" />;
          const dayEvents = eventsByDay[day] ?? [];
          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
          return (
            <div
              key={day}
              className="min-h-[100px] p-1 border-r border-b last:border-r-0 cursor-pointer hover:bg-accent/30 transition-colors"
              onClick={() => onDateClick(new Date(year, month, day))}
            >
              <div className={cn('text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full', isToday && 'bg-primary text-primary-foreground')}>
                {day}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className={cn(
                      'text-xs truncate rounded px-1 py-0.5 cursor-pointer border-l-2 hover:bg-accent',
                      TYPE_EVENT_COLORS[e.type] ?? 'border-l-slate-500',
                    )}
                    onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                    title={e.title}
                  >
                    {e.allDay ? '' : `${new Date(e.startDate).getHours().toString().padStart(2, '0')}h `}
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-xs text-muted-foreground pl-1">+{dayEvents.length - 3} mais</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
