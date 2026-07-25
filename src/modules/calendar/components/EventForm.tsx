'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/feedback';
import { calendarEventService } from '../services/calendar-event-service';
import { CALENDAR_EVENT_TYPE_LABELS, CALENDAR_STATUS_LABELS } from '../validators';
import type { CalendarEvent, CalendarEventType, CalendarStatus } from '../types';

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  onSaved: () => void;
  initialDate?: Date;
}

export function EventForm({ open, onOpenChange, event, onSaved, initialDate }: EventFormProps) {
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('OTHER');
  const [status, setStatus] = useState('SCHEDULED');
  const [allDay, setAllDay] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description ?? '');
      setType(event.type);
      setStatus(event.status);
      setAllDay(event.allDay);
      setStartDate(new Date(event.startDate).toISOString().slice(0, 10));
      setStartTime(new Date(event.startDate).toTimeString().slice(0, 5));
      setEndDate(new Date(event.endDate).toISOString().slice(0, 10));
      setEndTime(new Date(event.endDate).toTimeString().slice(0, 5));
      setLocation(event.location ?? '');
    } else {
      const d = initialDate ?? new Date();
      setTitle(''); setDescription(''); setType('OTHER'); setStatus('SCHEDULED');
      setAllDay(false);
      setStartDate(d.toISOString().slice(0, 10));
      setStartTime('08:00');
      setEndDate(d.toISOString().slice(0, 10));
      setEndTime('09:00');
      setLocation('');
    }
  }, [event, initialDate, open]);

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Título é obrigatório'); return; }
    setSaving(true);
    try {
      const start = allDay
        ? new Date(startDate + 'T00:00:00')
        : new Date(startDate + 'T' + startTime);
      const end = allDay
        ? new Date(endDate + 'T23:59:59')
        : new Date(endDate + 'T' + endTime);

      const payload = {
        title: title.trim(), description: description.trim(),
        type: type as CalendarEventType, status: status as CalendarStatus,
        allDay, location,
        startDate: start, endDate: end,
        createdBy: 'user-001', updatedBy: 'user-001',
      };

      if (event) {
        await calendarEventService.update(event.id, payload);
        toast.success('Evento atualizado');
      } else {
        await calendarEventService.create(payload);
        toast.success('Evento criado');
      }
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error('Erro ao salvar evento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{event ? 'Editar Evento' : 'Novo Evento'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
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
          <div className="space-y-2"><Label>Local</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
