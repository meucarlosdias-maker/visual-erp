'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { workOrderService } from '@/modules/work-orders/services/work-order-service';
import { WORK_ORDER_PRIORITY_LABELS } from '@/modules/work-orders/validators';
import { toast } from '@/components/feedback';
import { useState, useCallback } from 'react';

export default function NovaOsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [startDate, setStartDate] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = useCallback(async () => {
    if (!title.trim()) { toast.error('Título é obrigatório'); return; }
    setSaving(true);
    try {
      await workOrderService.create({
        title: title.trim(),
        description: description.trim(),
        priority,
        startDate: startDate ? new Date(startDate) : null,
        expectedEndDate: expectedEndDate ? new Date(expectedEndDate) : null,
        totalValue: Number(totalValue) || 0,
        notes,
        status: 'OPEN',
        createdBy: 'user-001',
        updatedBy: 'user-001',
      });
      toast.success('OS criada com sucesso');
      router.push('/app/os');
    } catch {
      toast.error('Erro ao criar OS');
    } finally {
      setSaving(false);
    }
  }, [title, description, priority, startDate, expectedEndDate, totalValue, notes, router]);

  return (
    <CrudPage title="Nova Ordem de Serviço" description="Crie uma nova ordem de serviço">
      <div className="max-w-lg space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Instalação de Lona" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição detalhada..." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
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
          <div className="space-y-2">
            <Label>Valor Total (R$)</Label>
            <Input type="number" step="0.01" value={totalValue} onChange={(e) => setTotalValue(e.target.value)} placeholder="0,00" />
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
          <Label htmlFor="notes">Observações</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observações..." />
        </div>
        <div className="flex justify-end gap-2">
          <CancelButton onClick={() => router.back()} disabled={saving} />
          <SaveButton onClick={handleSave} loading={saving} />
        </div>
      </div>
    </CrudPage>
  );
}
