'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { toast } from '@/components/feedback';
import { calendarEventService } from '@/modules/calendar/services/calendar-event-service';
import { CALENDAR_EVENT_TYPE_LABELS, CALENDAR_STATUS_LABELS } from '@/modules/calendar/validators';
import { useState, useCallback } from 'react';

export default function NovoEventoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('OTHER');
  const [status, setStatus] = useState('SCHEDULED');
  const [allDay, setAllDay] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('08:00');
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [endTime, setEndTime] = useState('09:00');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = useCallback(async () => {
    if (!title.trim()) { toast.error('Título é obrigatório'); return; }
    setSaving(true);
    try {
      const start = allDay ? new Date(startDate + 'T00:00:00') : new Date(startDate + 'T' + startTime);
      const end = allDay ? new Date(endDate + 'T23:59:59') : new Date(endDate + 'T' + endTime);
      await calendarEventService.create({
        title: title.trim(), description: description.trim(),
        type, status, allDay, location, notes,
        startDate: start, endDate: end,
        createdBy: 'user-001', updatedBy: 'user-001',
      });
      toast.success('Evento criado');
      router.push('/app/agenda');
    } catch {
      toast.error('Erro ao criar evento');
    } finally {
      setSaving(false);
    }
  }, [title, description, type, status, allDay, startDate, startTime, endDate, endTime, location, notes, router]);

  return (
    <CrudPage title="Novo Evento" description="Crie um novo evento na agenda">
      <div className="max-w-lg space-y-4">
        <div className="space-y-2"><Label>Título *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Reunião com cliente" /></div>
        <div className="space-y-2"><Label>Descrição</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Descrição do evento..." /></div>
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
        <div className="space-y-2"><Label>Local</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Local do evento..." /></div>
        <div className="space-y-2"><Label>Observações</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} /></div>
        <div className="flex justify-end gap-2">
          <CancelButton onClick={() => router.back()} disabled={saving} />
          <SaveButton onClick={handleSave} loading={saving} />
        </div>
      </div>
    </CrudPage>
  );
}
