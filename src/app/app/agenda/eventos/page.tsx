'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Calendar as CalendarIcon } from '@/constants/icons';
import { EmptyState, LoadingLocal, toast } from '@/components/feedback';
import { useCalendarEvents } from '@/modules/calendar/hooks/use-calendar-events';
import { useDeleteConfirm } from '@/hooks/use-confirm';
import { CALENDAR_EVENT_TYPE_LABELS, CALENDAR_STATUS_LABELS, CALENDAR_STATUS_COLORS } from '@/modules/calendar/validators';

export default function EventosPage() {
  const router = useRouter();
  const { data, loading, delete: remove } = useCalendarEvents();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      (CALENDAR_EVENT_TYPE_LABELS[e.type] ?? '').toLowerCase().includes(q),
    );
  }, [data, search]);

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({ title: 'Remover Evento', description: 'Esta ação não pode ser desfeita.' });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Evento removido');
  }, [confirmDelete, remove]);

  function formatDateTime(d: Date | string) {
    return new Date(d).toLocaleString('pt-BR');
  }

  return (
    <>
      <CrudPage
        title="Eventos"
        description="Lista de todos os eventos agendados"
        actionNew={{ onClick: () => router.push('/app/agenda/novo'), label: 'Novo Evento' }}
        toolbar={
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 w-64" placeholder="Buscar eventos..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        }
      >
        {loading ? (
          <LoadingLocal message="Carregando eventos..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<CalendarIcon className="h-12 w-12 text-muted-foreground" />} title="Nenhum evento" description="Crie um novo evento." />
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Fim</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((event) => (
                  <TableRow key={event.id} className="cursor-pointer" onClick={() => router.push(`/app/agenda/${event.id}`)}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{CALENDAR_EVENT_TYPE_LABELS[event.type] ?? event.type}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${CALENDAR_STATUS_COLORS[event.status] ?? ''}`}>
                        {CALENDAR_STATUS_LABELS[event.status] ?? event.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{formatDateTime(event.startDate)}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(event.endDate)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{event.location || '—'}</TableCell>
                    <TableCell className="text-right">
                      <button className="text-sm text-destructive hover:underline" onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}>Remover</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CrudPage>
      {DeleteDialog}
    </>
  );
}
