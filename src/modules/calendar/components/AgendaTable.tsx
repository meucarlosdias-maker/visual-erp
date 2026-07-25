'use client';

import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CALENDAR_EVENT_TYPE_LABELS, CALENDAR_STATUS_LABELS } from '../validators';
import type { CalendarEvent } from '../types';

interface AgendaTableProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const TYPE_DOT: Record<string, string> = {
  VISIT: 'bg-blue-500', MEETING: 'bg-purple-500',
  INSTALLATION: 'bg-orange-500', PRODUCTION: 'bg-indigo-500',
  DELIVERY: 'bg-green-500', PAYMENT: 'bg-red-500',
  RECEIPT: 'bg-emerald-500', INTERNAL: 'bg-gray-500',
  REMINDER: 'bg-yellow-500', OTHER: 'bg-slate-500',
};

const STATUS_BG: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-orange-100 text-orange-700',
  FINISHED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

export function AgendaTable({ events, onEventClick }: AgendaTableProps) {
  const allDay = useMemo(() => events.filter((e) => e.allDay), [events]);
  const timed = useMemo(() => events.filter((e) => !e.allDay).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()), [events]);

  function formatHour(d: Date | string) {
    return new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">Nenhum evento para esta data.</p>;
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Horário</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead className="w-32">Responsável</TableHead>
            <TableHead className="w-28">Situação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allDay.map((e) => (
            <TableRow key={e.id} className="cursor-pointer hover:bg-accent/50" onClick={() => onEventClick(e)}>
              <TableCell className="text-xs text-muted-foreground">Dia inteiro</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', TYPE_DOT[e.type] ?? 'bg-slate-500')} />
                  <div>
                    <p className="font-medium text-sm">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{CALENDAR_EVENT_TYPE_LABELS[e.type]}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">{e.assignedUserId || '—'}</TableCell>
              <TableCell>
                <span className={cn('text-xs px-1.5 py-0.5 rounded', STATUS_BG[e.status] ?? '')}>
                  {CALENDAR_STATUS_LABELS[e.status]}
                </span>
              </TableCell>
            </TableRow>
          ))}
          {timed.map((e) => (
            <TableRow key={e.id} className="cursor-pointer hover:bg-accent/50" onClick={() => onEventClick(e)}>
              <TableCell className="text-xs text-muted-foreground">{formatHour(e.startDate)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', TYPE_DOT[e.type] ?? 'bg-slate-500')} />
                  <div>
                    <p className="font-medium text-sm">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{CALENDAR_EVENT_TYPE_LABELS[e.type]}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">{e.assignedUserId || '—'}</TableCell>
              <TableCell>
                <span className={cn('text-xs px-1.5 py-0.5 rounded', STATUS_BG[e.status] ?? '')}>
                  {CALENDAR_STATUS_LABELS[e.status]}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
