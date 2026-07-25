'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from '@/constants/icons';
import { LoadingLocal } from '@/components/feedback';
import { DashboardCards } from '@/modules/calendar/components/DashboardCards';
import { AgendaTable } from '@/modules/calendar/components/AgendaTable';
import { CalendarMonthView } from '@/modules/calendar/components/CalendarMonthView';
import { WeekView } from '@/modules/calendar/components/WeekView';
import { EventForm } from '@/modules/calendar/components/EventForm';
import { calendarEventService } from '@/modules/calendar/services/calendar-event-service';
import { useDashboardStats } from '@/modules/calendar/hooks/use-calendar-events';
import type { CalendarEvent } from '@/modules/calendar/types';

type ViewMode = 'day' | 'week' | 'month';

export default function AgendaPage() {
  const router = useRouter();
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('day');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let start: Date, end: Date;
        if (view === 'day') {
          start = new Date(currentDate); start.setHours(0, 0, 0, 0);
          end = new Date(currentDate); end.setHours(23, 59, 59, 999);
        } else if (view === 'week') {
          start = new Date(currentDate);
          start.setDate(start.getDate() - start.getDay());
          start.setHours(0, 0, 0, 0);
          end = new Date(start);
          end.setDate(end.getDate() + 6);
          end.setHours(23, 59, 59, 999);
        } else {
          start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          start.setDate(start.getDate() - start.getDay());
          end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          end.setDate(end.getDate() + (6 - end.getDay()));
        }
        const result = await calendarEventService.listByDateRange(start, end);
        if (!cancelled) setEvents(result);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchEvents();
    return () => { cancelled = true; };
  }, [currentDate, view]);

  const navigate = useCallback((dir: -1 | 1) => {
    setCurrentDate((d) => {
      if (view === 'day') return new Date(d.getFullYear(), d.getMonth(), d.getDate() + dir);
      if (view === 'week') return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 * dir);
      return new Date(d.getFullYear(), d.getMonth() + dir, 1);
    });
  }, [view]);

  const handleDateClick = useCallback((date: Date) => {
    setCurrentDate(date);
    setView('day');
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setInitialDate(undefined);
    setFormOpen(true);
  }, []);

  const refresh = useCallback(() => {
    setCurrentDate((d) => new Date(d));
  }, []);

  const handleSaved = useCallback(() => {
    refresh();
  }, [refresh]);

  const headerLabel = () => {
    if (view === 'day') return currentDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    if (view === 'week') {
      const start = new Date(currentDate); start.setDate(start.getDate() - start.getDay());
      const end = new Date(start); end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <CrudPage
        title="Agenda"
        description={headerLabel().charAt(0).toUpperCase() + headerLabel().slice(1)}
        actionNew={{ onClick: () => router.push('/app/agenda/novo'), label: 'Novo Evento' }}
      >
        {statsLoading ? null : (
          <DashboardCards
            todayCount={stats.todayCount}
            installationsCount={stats.installationsCount}
            visitsCount={stats.visitsCount}
            productionsCount={stats.productionsCount}
          />
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <div className="flex items-center gap-1 rounded-lg border p-0.5">
            {(['day', 'week', 'month'] as ViewMode[]).map((v) => (
              <button
                key={v}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  view === v ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                onClick={() => setView(v)}
              >
                {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate(1)}>
            Próximo <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {loading ? (
          <LoadingLocal message="Carregando..." />
        ) : view === 'day' ? (
          <AgendaTable events={events} onEventClick={handleEventClick} />
        ) : view === 'week' ? (
          <WeekView currentDate={currentDate} events={events} onEventClick={handleEventClick} onDateClick={handleDateClick} />
        ) : (
          <CalendarMonthView currentDate={currentDate} events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />
        )}
      </CrudPage>
      <EventForm
        open={formOpen}
        onOpenChange={setFormOpen}
        event={selectedEvent}
        initialDate={initialDate}
        onSaved={handleSaved}
      />
    </>
  );
}
