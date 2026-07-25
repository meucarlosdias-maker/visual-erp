'use client';

import { useState, useMemo } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Phone, ChevronLeft, ChevronRight, Loader2 } from '@/constants/icons';
import { VisitStatusBadge } from '@/modules/crm/components/LeadBadge';
import { useVisits } from '@/modules/crm/hooks/use-visits';
import type { VisitStatus } from '@/modules/crm/types';

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}

function formatTime(d: Date | string | null | undefined): string {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

type ViewMode = 'day' | 'week' | 'month';

export default function AgendaPage() {
  const { data: visits, loading } = useVisits();
  const [view, setView] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const periodRange = useMemo(() => {
    const d = new Date(currentDate);
    if (view === 'day') {
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      return { start, end, label: formatDate(d) };
    }
    if (view === 'week') {
      const day = d.getDay();
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day + 6, 23, 59, 59);
      const label = `${formatDate(start)} — ${formatDate(end)}`;
      return { start, end, label };
    }
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    return { start, end, label };
  }, [currentDate, view]);

  const filtered = useMemo(() => {
    return visits.filter((v) => {
      const d = new Date(v.scheduledDate);
      return d >= periodRange.start && d <= periodRange.end;
    }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }, [visits, periodRange]);

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (view === 'day') d.setDate(d.getDate() + dir);
    else if (view === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  return (
    <CrudPage
      title="Agenda Comercial"
      description="Visualize visitas, reuniões e atividades agendadas"
      toolbar={
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border">
            {['day', 'week', 'month'].map((v) => (
              <Button key={v} variant={view === v ? 'default' : 'ghost'} size="sm" className="rounded-none" onClick={() => setView(v as ViewMode)}>
                {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
              </Button>
            ))}
          </div>
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="font-medium capitalize">{periodRange.label}</span>
            <Button variant="ghost" size="icon" onClick={() => navigate(1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mb-2" />
              <p>Nenhum evento neste período.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((v) => (
                <Card key={v.id}>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-center min-w-[52px]">
                        <p className="text-lg font-bold leading-none">{new Date(v.scheduledDate).getDate()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(v.scheduledDate).toLocaleDateString('pt-BR', { month: 'short' })}
                        </p>
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">
                          <VisitStatusBadge status={v.status as VisitStatus} />
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatTime(v.scheduledDate)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    {v.contactName && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        <span>{v.contactName}</span>
                      </div>
                    )}
                    {v.address && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{v.address}{v.city ? `, ${v.city}` : ''}</span>
                      </div>
                    )}
                    {v.contactPhone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{v.contactPhone}</span>
                      </div>
                    )}
                    {v.notes && <p className="text-xs text-muted-foreground mt-1">{v.notes}</p>}
                    {v.measurements && v.measurements.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">{v.measurements.length} medição(ões)</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </CrudPage>
  );
}
