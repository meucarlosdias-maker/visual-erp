'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { EventTable } from '@/modules/jobs/components';
import { useEvents } from '@/modules/jobs/hooks';

export default function EventsPage() {
  const { data, loading } = useEvents();

  return (
    <CrudPage title="Eventos" description="Histórico de eventos do sistema">
      {loading ? (
        <LoadingLocal message="Carregando eventos..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum evento encontrado.</p>
      ) : (
        <EventTable events={data} />
      )}
    </CrudPage>
  );
}
