'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InstallationBadge } from './InstallationBadge';
import { ChevronLeft, ChevronRight } from '@/constants/icons';
import { useInstallations } from '../hooks/use-installations';
import type { Installation } from '../types';

type ViewMode = 'month' | 'week' | 'day';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getMonthDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(start.getDate() - start.getDay());
  const days: Date[] = [];
  while (days.length < 42) {
    days.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return days;
}

function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function InstallationAgenda() {
  const { data: installations } = useInstallations();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => {
    if (viewMode === 'month') return getMonthDays(year, month);
    if (viewMode === 'week') return getWeekDays(currentDate);
    return [currentDate];
  }, [viewMode, year, month, currentDate]);

  const installationsByDate = useMemo(() => {
    const map = new Map<string, Installation[]>();
    for (const inst of installations) {
      if (!inst.scheduledDate) continue;
      const key = formatDateKey(inst.scheduledDate);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(inst);
    }
    return map;
  }, [installations]);

  const selectedInstallations = selectedDate
    ? installationsByDate.get(selectedDate) ?? []
    : [];

  const navigate = useCallback((dir: number) => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + dir);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + dir * 7);
    } else {
      d.setDate(d.getDate() + dir);
    }
    setCurrentDate(d);
  }, [currentDate, viewMode]);

  const todayKey = formatDateKey(new Date());

  const viewTitle = useMemo(() => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
    if (viewMode === 'week') {
      const start = days[0];
      const end = days[days.length - 1];
      if (start.getMonth() !== end.getMonth()) {
        return `${start.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      }
      return `${start.toLocaleDateString('pt-BR', { day: 'numeric' })} - ${end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }, [viewMode, currentDate, days]);

  const handleDayClick = (date: Date) => {
    const key = formatDateKey(date);
    setSelectedDate(selectedDate === key ? null : key);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-base font-semibold capitalize min-w-[200px] text-center">{viewTitle}</h2>
          <Button variant="outline" size="sm" onClick={() => navigate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>Hoje</Button>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={viewMode === mode ? 'default' : 'ghost'}
              onClick={() => setViewMode(mode)}
              className="capitalize"
            >
              {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
            </Button>
          ))}
        </div>
      </div>

      {viewMode === 'month' && (
        <div className="rounded-md border">
          <div className="grid grid-cols-7 bg-muted/50">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="py-2 text-center text-xs font-medium text-muted-foreground">{wd}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((d) => {
              const key = formatDateKey(d);
              const dayInsts = installationsByDate.get(key) ?? [];
              const isCurrentMonth = d.getMonth() === month;
              const isToday = key === todayKey;
              const isSelected = key === selectedDate;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleDayClick(d)}
                  className={`min-h-[80px] p-1.5 border-t border-r text-left transition-colors hover:bg-accent/50 ${!isCurrentMonth ? 'text-muted-foreground/40' : ''} ${isToday ? 'bg-accent' : ''} ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center' : ''}`}>
                    {d.getDate()}
                  </span>
                  {dayInsts.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {dayInsts.slice(0, 3).map((inst) => (
                        <div key={inst.id} className="text-[10px] leading-tight truncate rounded px-0.5 bg-blue-100 text-blue-700">
                          {inst.number}
                        </div>
                      ))}
                      {dayInsts.length > 3 && (
                        <div className="text-[10px] text-muted-foreground">+{dayInsts.length - 3} mais</div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {viewMode !== 'month' && (
        <div className="space-y-3">
          {days.map((d) => {
            const key = formatDateKey(d);
            const dayInsts = installationsByDate.get(key) ?? [];
            const isToday = key === todayKey;
            return (
              <Card key={key} className={isToday ? 'border-primary/50' : ''}>
                <CardContent className="py-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">
                      {d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    <span className="text-xs text-muted-foreground">{dayInsts.length} instalação(ões)</span>
                  </div>
                  {dayInsts.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhuma instalação agendada.</p>
                  ) : (
                    <div className="space-y-2">
                      {dayInsts.map((inst) => (
                        <div key={inst.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                          <div>
                            <p className="text-sm font-medium">{inst.number}</p>
                            <p className="text-xs text-muted-foreground">{inst.address || inst.city || 'Sem endereço'}</p>
                          </div>
                          <InstallationBadge status={inst.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedDate && selectedInstallations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">
            Instalações em {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}
          </h3>
          {selectedInstallations.map((inst) => (
            <Card key={inst.id}>
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{inst.number}</p>
                    <p className="text-xs text-muted-foreground">{inst.address || inst.city || '—'} · {inst.contactName || '—'}</p>
                  </div>
                  <InstallationBadge status={inst.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
