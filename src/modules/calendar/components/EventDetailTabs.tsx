'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, Plus, Trash2, Check, X } from '@/constants/icons';
import { toast } from '@/components/feedback';
import { calendarParticipantService } from '../services/calendar-participant-service';
import { calendarEventService } from '../services/calendar-event-service';
import { CALENDAR_EVENT_TYPE_LABELS, CALENDAR_STATUS_LABELS } from '../validators';
import type { CalendarEvent, CalendarParticipant, CalendarEventType, CalendarStatus } from '../types';

interface EventDetailTabsProps {
  event: CalendarEvent;
  onUpdated: () => void;
}

const REFERENCE_OPTIONS = [
  { field: 'clientId', label: 'Cliente' },
  { field: 'leadId', label: 'Lead' },
  { field: 'projectId', label: 'Projeto' },
  { field: 'workOrderId', label: 'Ordem de Serviço' },
  { field: 'productionOrderId', label: 'Produção' },
  { field: 'installationId', label: 'Instalação' },
  { field: 'financialId', label: 'Financeiro' },
];

export function EventDetailTabs({ event, onUpdated }: EventDetailTabsProps) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description ?? '');
  const [type, setType] = useState(event.type);
  const [status, setStatus] = useState(event.status);
  const [allDay, setAllDay] = useState(event.allDay);
  const [startDate, setStartDate] = useState(new Date(event.startDate).toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState(new Date(event.startDate).toTimeString().slice(0, 5));
  const [endDate, setEndDate] = useState(new Date(event.endDate).toISOString().slice(0, 10));
  const [endTime, setEndTime] = useState(new Date(event.endDate).toTimeString().slice(0, 5));
  const [saving, setSaving] = useState(false);

  const [participants, setParticipants] = useState<CalendarParticipant[]>([]);
  const [newUserId, setNewUserId] = useState('');

  const [notes, setNotes] = useState(event.notes ?? '');
  const [savingNotes, setSavingNotes] = useState(false);

  const references = REFERENCE_OPTIONS.filter((r) => event[r.field as keyof CalendarEvent]);
  const refValues = REFERENCE_OPTIONS.reduce((acc, r) => {
    const val = event[r.field as keyof CalendarEvent];
    if (val) acc[r.label] = val as string;
    return acc;
  }, {} as Record<string, string>);

  useEffect(() => {
    calendarParticipantService.listByEventId(event.id).then(setParticipants).catch(() => {});
  }, [event.id]);

  const handleSaveInfo = async () => {
    if (!title.trim()) { toast.error('Título é obrigatório'); return; }
    setSaving(true);
    try {
      const start = allDay
        ? new Date(startDate + 'T00:00:00')
        : new Date(startDate + 'T' + startTime);
      const end = allDay
        ? new Date(endDate + 'T23:59:59')
        : new Date(endDate + 'T' + endTime);
      await calendarEventService.update(event.id, {
        title: title.trim(), description: description.trim(),
        type: type as CalendarEventType, status: status as CalendarStatus,
        allDay, startDate: start, endDate: end,
      });
      toast.success('Informações salvas');
      onUpdated();
    } catch { toast.error('Erro ao salvar'); }
    finally { setSaving(false); }
  };

  const handleAddParticipant = async () => {
    if (!newUserId.trim()) return;
    try {
      const p = await calendarParticipantService.create({ eventId: event.id, userId: newUserId.trim(), required: true, confirmed: false });
      setParticipants((prev) => [...prev, p]);
      setNewUserId('');
      toast.success('Participante adicionado');
    } catch { toast.error('Erro ao adicionar'); }
  };

  const handleRemoveParticipant = async (id: string) => {
    try {
      await calendarParticipantService.delete(id);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    } catch { toast.error('Erro ao remover'); }
  };

  const handleToggleConfirmed = async (p: CalendarParticipant) => {
    try {
      const updated = await calendarParticipantService.update(p.id, { confirmed: !p.confirmed });
      setParticipants((prev) => prev.map((x) => x.id === updated.id ? updated : x));
    } catch { toast.error('Erro ao atualizar'); }
  };

  const handleToggleRequired = async (p: CalendarParticipant) => {
    try {
      const updated = await calendarParticipantService.update(p.id, { required: !p.required });
      setParticipants((prev) => prev.map((x) => x.id === updated.id ? updated : x));
    } catch { toast.error('Erro ao atualizar'); }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await calendarEventService.update(event.id, { notes });
      toast.success('Observações salvas');
    } catch { toast.error('Erro ao salvar'); }
    finally { setSavingNotes(false); }
  };

  return (
    <Tabs defaultValue="info">
      <TabsList>
        <TabsTrigger value="info">Informações</TabsTrigger>
        <TabsTrigger value="participants">Responsáveis</TabsTrigger>
        <TabsTrigger value="relations">Relacionamentos</TabsTrigger>
        <TabsTrigger value="notes">Observações</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-6 space-y-4">
        <div className="max-w-lg space-y-4">
          <div className="space-y-2"><Label>Título *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="space-y-2"><Label>Descrição</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v ?? 'OTHER')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CALENDAR_EVENT_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? 'SCHEDULED')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CALENDAR_STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={allDay} onCheckedChange={setAllDay} />
            <Label className="cursor-pointer">Dia inteiro</Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Data Início</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
            {!allDay && <div className="space-y-2"><Label>Hora Início</Label><Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></div>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Data Fim</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
            {!allDay && <div className="space-y-2"><Label>Hora Fim</Label><Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></div>}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveInfo} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="participants" className="mt-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Responsáveis</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="ID do usuário..."
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                className="max-w-xs"
              />
              <Button size="sm" onClick={handleAddParticipant}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead className="w-28">Obrigatório</TableHead>
                    <TableHead className="w-28">Confirmado</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-4">Nenhum responsável</TableCell></TableRow>
                  ) : participants.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-sm">{p.userId}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleToggleRequired(p)}>
                          {p.required ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleToggleConfirmed(p)}>
                          {p.confirmed ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveParticipant(p.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="relations" className="mt-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Relacionamentos</CardTitle></CardHeader>
          <CardContent>
            {references.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Nenhum relacionamento vinculado.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(refValues).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded border text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              Os relacionamentos são vinculados no momento da criação do evento.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Observações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} placeholder="Observações livres..." />
            <div className="flex justify-end">
              <Button onClick={handleSaveNotes} disabled={savingNotes}>
                <Save className="h-4 w-4 mr-1" /> {savingNotes ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
