'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Clock, Phone, Mail, MessageSquare, Users, MapPin, FileText } from '@/constants/icons';
import { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_COLORS } from '../validators';
import { toast } from '@/components/feedback';
import type { LeadActivity } from '../types';

import type { LucideIcon } from '@/constants/icons';

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  CALL: Phone,
  EMAIL: Mail,
  WHATSAPP: MessageSquare,
  MEETING: Users,
  VISIT: MapPin,
  NOTE: FileText,
};

interface ActivityTimelineProps {
  activities: LeadActivity[];
  onCreate: (data: Record<string, unknown>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return '';
  return new Date(d).toLocaleString('pt-BR');
}

export function ActivityTimeline({ activities, onCreate, onDelete }: ActivityTimelineProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('NOTE');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const handleSave = async () => {
    if (!description.trim()) { toast.error('Descrição é obrigatória'); return; }
    const ok = await onCreate({
      type,
      description: description.trim(),
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      completedAt: type !== 'NOTE' && type !== 'CALL' && type !== 'EMAIL' ? null : new Date(),
      userId: 'user-001',
    });
    if (ok) {
      toast.success('Atividade registrada');
      setOpen(false);
      setDescription('');
      setScheduledAt('');
      setType('NOTE');
    } else {
      toast.error('Erro ao registrar atividade');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Atividades</h3>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nova Atividade
        </Button>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma atividade registrada.</p>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => {
            const Icon = ACTIVITY_ICONS[act.type] ?? FileText;
            return (
              <div key={act.id} className="flex gap-3 p-3 rounded-lg border">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${ACTIVITY_TYPE_COLORS[act.type] ?? 'bg-gray-100'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{ACTIVITY_TYPE_LABELS[act.type] ?? act.type}</span>
                    <span className="text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDateTime(act.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{act.description}</p>
                  {act.scheduledAt && (
                    <p className="text-xs text-muted-foreground mt-1">Agendado: {formatDateTime(act.scheduledAt)}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive flex-shrink-0" onClick={() => onDelete(act.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Atividade</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v ?? 'NOTE')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva a atividade..." />
            </div>
            <div className="space-y-2">
              <Label>Agendado para</Label>
              <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
