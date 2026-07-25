'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { EventDetailTabs } from '@/modules/calendar/components/EventDetailTabs';
import { calendarEventService } from '@/modules/calendar/services/calendar-event-service';
import type { CalendarEvent } from '@/modules/calendar/types';

export default function EventoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const e = await calendarEventService.get(id);
      setEvent(e);
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async () => {
    try {
      await calendarEventService.delete(id);
      toast.success('Evento removido');
      router.push('/app/agenda');
    } catch {
      toast.error('Erro ao remover');
    }
  };

  if (loading) return <LoadingLocal message="Carregando evento..." />;
  if (!event) return <p className="text-center py-12 text-muted-foreground">Evento não encontrado.</p>;

  return (
    <CrudPage
      title={event.title}
      description="Detalhes do evento"
    >
      <div className="flex items-center gap-2 mb-4">
        <button className="text-sm text-primary hover:underline" onClick={() => router.push(`/app/agenda/novo?id=${event.id}`)}>Editar</button>
        <span className="text-muted-foreground">|</span>
        <button className="text-sm text-destructive hover:underline" onClick={handleDelete}>Remover</button>
      </div>
      <EventDetailTabs event={event} onUpdated={fetch} />
    </CrudPage>
  );
}