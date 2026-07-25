'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Phone, User } from '@/constants/icons';
import { VisitStatusBadge } from './LeadBadge';
import type { Visit, VisitStatus } from '../types';

interface VisitCardProps {
  visits: Visit[];
  onEdit?: (id: string) => void;
}

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleString('pt-BR');
}

export function VisitCard({ visits, onEdit }: VisitCardProps) {
  if (visits.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Visitas</h3>
        <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma visita agendada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Visitas ({visits.length})</h3>
      <div className="space-y-2">
        {visits.map((v) => (
          <Card key={v.id}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                <VisitStatusBadge status={v.status as VisitStatus} />
              </CardTitle>
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(v.id)}>Editar</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(v.scheduledDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{v.address ? `${v.address}, ${v.city} - ${v.state}` : '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>{v.contactName || '—'}</span>
              </div>
              {v.contactPhone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{v.contactPhone}</span>
                </div>
              )}
              {v.notes && <p className="text-xs text-muted-foreground mt-1">{v.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
