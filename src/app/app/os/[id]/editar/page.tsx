'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { LoadingLocal, toast } from '@/components/feedback';
import { workOrderService } from '@/modules/work-orders/services/work-order-service';
import { WORK_ORDER_STATUS_LABELS, WORK_ORDER_PRIORITY_LABELS } from '@/modules/work-orders/validators';
import type { WorkOrderStatus } from '@/modules/work-orders/types';

export default function EditarOsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<WorkOrderStatus>('OPEN');
  const [priority, setPriority] = useState('NORMAL');
  const [startDate, setStartDate] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    workOrderService.get(id).then((o) => {
      if (!o) return;
      setTitle(o.title); setDescription(o.description || '');
      setStatus(o.status); setPriority(o.priority);
      setStartDate(o.startDate ? new Date(o.startDate).toISOString().slice(0, 10) : '');
      setExpectedEndDate(o.expectedEndDate ? new Date(o.expectedEndDate).toISOString().slice(0, 10) : '');
      setTotalValue(String(o.totalValue)); setNotes(o.notes || '');
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) { toast.error('Título é obrigatório'); return; }
    setSaving(true);
    try {
      await workOrderService.update(id, {
        title: title.trim(), description: description.trim(),
        status, priority,
        startDate: startDate ? new Date(startDate) : null,
        expectedEndDate: expectedEndDate ? new Date(expectedEndDate) : null,
        totalValue: Number(totalValue) || 0, notes,
        updatedBy: 'user-001',
      });
      toast.success('OS atualizada');
      router.push(`/app/os/${id}`);
    } catch { toast.error('Erro ao atualizar'); }
    finally { setSaving(false); }
  }, [id, title, description, status, priority, startDate, expectedEndDate, totalValue, notes, router]);

  if (loading) return <LoadingLocal message="Carregando..." />;

  return (
    <CrudPage title="Editar OS" description="Atualize as informações da ordem de serviço">
      <div className="max-w-lg space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus((v ?? 'OPEN') as WorkOrderStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(WORK_ORDER_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v ?? 'NORMAL')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(WORK_ORDER_PRIORITY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Data Início</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Previsão Término</Label>
            <Input type="date" value={expectedEndDate} onChange={(e) => setExpectedEndDate(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Valor Total (R$)</Label>
          <Input type="number" step="0.01" value={totalValue} onChange={(e) => setTotalValue(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <CancelButton onClick={() => router.back()} disabled={saving} />
          <SaveButton onClick={handleSave} loading={saving} />
        </div>
      </div>
    </CrudPage>
  );
}
