'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Phone, Mail, MapPin, Save } from '@/constants/icons';
import { LeadStatusBadge, TemperatureBadge } from './LeadBadge';
import { ActivityTimeline } from './ActivityTimeline';
import { VisitCard } from './VisitCard';
import { LEAD_STATUS_LABELS, LEAD_TEMPERATURE_LABELS } from '../validators';
import { toast } from '@/components/feedback';
import type { Lead, LeadStatus, LeadTemperature } from '../types';

interface LeadDetailProps {
  lead: Lead;
  onUpdate?: (patch: Partial<Lead>) => Promise<boolean>;
  activities?: React.ComponentProps<typeof ActivityTimeline>['activities'];
  onCreateActivity?: React.ComponentProps<typeof ActivityTimeline>['onCreate'];
  onDeleteActivity?: React.ComponentProps<typeof ActivityTimeline>['onDelete'];
  visits?: React.ComponentProps<typeof VisitCard>['visits'];
}

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}

export function LeadDetail({ lead, onUpdate, activities = [], onCreateActivity, onDeleteActivity, visits = [] }: LeadDetailProps) {
  const [notes, setNotes] = useState(lead.notes || '');
  const [savingNotes, setSavingNotes] = useState(false);

  const saveNotes = async () => {
    if (!onUpdate) return;
    setSavingNotes(true);
    const ok = await onUpdate({ notes });
    if (ok) toast.success('Observações salvas');
    else toast.error('Erro ao salvar');
    setSavingNotes(false);
  };

  return (
    <Tabs defaultValue="data">
      <TabsList>
        <TabsTrigger value="data">Dados</TabsTrigger>
        <TabsTrigger value="activities">Atividades</TabsTrigger>
        <TabsTrigger value="visits">Visitas</TabsTrigger>
        <TabsTrigger value="notes">Observações</TabsTrigger>
      </TabsList>

      <TabsContent value="data" className="mt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{lead.contactName}</h2>
            <p className="text-sm text-muted-foreground">{lead.number}</p>
          </div>
          <div className="flex items-center gap-2">
            <LeadStatusBadge status={lead.status as LeadStatus} />
            <TemperatureBadge temperature={lead.temperature as LeadTemperature} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" /> Empresa</CardTitle></CardHeader>
            <CardContent><p className="text-sm font-medium">{lead.companyName || '—'}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> Telefone</CardTitle></CardHeader>
            <CardContent><p className="text-sm font-medium">{lead.phone || '—'}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> E-mail</CardTitle></CardHeader>
            <CardContent><p className="text-sm font-medium truncate">{lead.email || '—'}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> Localização</CardTitle></CardHeader>
            <CardContent><p className="text-sm font-medium">{lead.city ? `${lead.city}${lead.state ? ` - ${lead.state}` : ''}` : '—'}</p></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Informações do Lead</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
            <div><span className="text-muted-foreground">Origem:</span><span className="font-medium ml-1">{lead.origin || '—'}</span></div>
            <div><span className="text-muted-foreground">Responsável:</span><span className="font-medium ml-1">{lead.assignedUserId || 'Não atribuído'}</span></div>
            <div><span className="text-muted-foreground">Criado em:</span><span className="font-medium ml-1">{formatDate(lead.createdAt)}</span></div>
            <div><span className="text-muted-foreground">Atualizado em:</span><span className="font-medium ml-1">{formatDate(lead.updatedAt)}</span></div>
          </CardContent>
        </Card>

        {onUpdate && (
          <div className="flex gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Status</span>
              <Select value={lead.status} onValueChange={(v) => v && v !== lead.status && onUpdate({ status: v as LeadStatus })}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Temperatura</span>
              <Select value={lead.temperature} onValueChange={(v) => v && v !== lead.temperature && onUpdate({ temperature: v as LeadTemperature })}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_TEMPERATURE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="activities" className="mt-6">
        {onCreateActivity && onDeleteActivity ? (
          <ActivityTimeline activities={activities} onCreate={onCreateActivity} onDelete={onDeleteActivity} />
        ) : (
          <p className="text-sm text-muted-foreground">Atividades não disponíveis.</p>
        )}
      </TabsContent>

      <TabsContent value="visits" className="mt-6">
        <VisitCard visits={visits} />
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Observações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observações sobre o lead..." rows={6} />
            {onUpdate && (
              <div className="flex justify-end">
                <Button onClick={saveNotes} disabled={savingNotes}>
                  <Save className="h-4 w-4 mr-1" /> {savingNotes ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
