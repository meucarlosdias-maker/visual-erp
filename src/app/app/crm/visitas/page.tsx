'use client';

import { useState } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar, Plus, Trash2 } from '@/constants/icons';
import { LoadingLocal, toast } from '@/components/feedback';
import { VisitStatusBadge } from '@/modules/crm/components/LeadBadge';
import { useVisits } from '@/modules/crm/hooks/use-visits';
import type { VisitStatus, Measurement } from '@/modules/crm/types';

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}

export default function VisitasPage() {
  const { data, loading, create } = useVisits();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [scheduledDate, setScheduledDate] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const addMeasurement = () => {
    setMeasurements((prev) => [...prev, {
      id: crypto.randomUUID(), width: 0, height: 0, quantity: 1, unit: 'm', notes: '',
    }]);
  };

  const updateMeasurement = (idx: number, field: keyof Measurement, value: unknown) => {
    setMeasurements((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const removeMeasurement = (idx: number) => {
    setMeasurements((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!scheduledDate) { toast.error('Data é obrigatória'); return; }
    setSaving(true);
    try {
      const ok = await create({
        scheduledDate: new Date(scheduledDate),
        address, city, state, zipCode, contactName, contactPhone, notes,
        status: 'SCHEDULED',
        sellerId: 'user-001',
        measurements,
      });
      if (ok) {
        toast.success('Visita criada');
        setOpen(false);
        resetForm();
      } else {
        toast.error('Erro ao criar visita');
      }
    } catch {
      toast.error('Erro ao criar visita');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setScheduledDate(''); setAddress(''); setCity(''); setState(''); setZipCode('');
    setContactName(''); setContactPhone(''); setNotes(''); setMeasurements([]);
  };

  return (
    <>
      <CrudPage
        title="Visitas"
        description="Gerencie as visitas comerciais e técnicas"
        actionNew={{ onClick: () => setOpen(true) }}
      >
        {loading ? (
          <LoadingLocal message="Carregando visitas..." />
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mb-2" />
            <p>Nenhuma visita agendada.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Qtd. Medições</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="text-sm">{formatDate(v.scheduledDate)}</TableCell>
                    <TableCell><VisitStatusBadge status={v.status as VisitStatus} /></TableCell>
                    <TableCell className="text-sm font-medium">{v.contactName || '—'}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {v.address ? `${v.address}, ${v.city}${v.state ? ` - ${v.state}` : ''}` : '—'}
                    </TableCell>
                    <TableCell className="text-sm">{v.measurements?.length ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CrudPage>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Nova Visita</DialogTitle></DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Data da Visita *</Label>
              <Input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Contato</Label><Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Nome do contato" /></div>
              <div className="space-y-2"><Label>Telefone</Label><Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Telefone" /></div>
            </div>
            <div className="space-y-2"><Label>Endereço</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número" /></div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2"><Label>Cidade</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
              <div className="space-y-2"><Label>UF</Label><Input value={state} onChange={(e) => setState(e.target.value)} maxLength={2} /></div>
              <div className="space-y-2"><Label>CEP</Label><Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} /></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Medições</Label>
                <Button variant="outline" size="sm" onClick={addMeasurement}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
                </Button>
              </div>
              {measurements.length > 0 && (
                <div className="space-y-2">
                  {measurements.map((m, idx) => (
                    <div key={m.id} className="flex items-end gap-2 p-2 rounded border">
                      <div className="space-y-1 w-20">
                        <Label className="text-xs">Largura</Label>
                        <Input type="number" step="0.01" value={m.width || ''} onChange={(e) => updateMeasurement(idx, 'width', Number(e.target.value))} />
                      </div>
                      <div className="space-y-1 w-20">
                        <Label className="text-xs">Altura</Label>
                        <Input type="number" step="0.01" value={m.height || ''} onChange={(e) => updateMeasurement(idx, 'height', Number(e.target.value))} />
                      </div>
                      <div className="space-y-1 w-16">
                        <Label className="text-xs">Qtd</Label>
                        <Input type="number" min="1" value={m.quantity} onChange={(e) => updateMeasurement(idx, 'quantity', Number(e.target.value))} />
                      </div>
                      <div className="space-y-1 w-16">
                        <Label className="text-xs">Un.</Label>
                        <Select value={m.unit} onValueChange={(v) => updateMeasurement(idx, 'unit', v ?? 'm')}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="m">Metro</SelectItem>
                            <SelectItem value="m2">M²</SelectItem>
                            <SelectItem value="un">Un</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Obs</Label>
                        <Input value={m.notes} onChange={(e) => updateMeasurement(idx, 'notes', e.target.value)} />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive flex-shrink-0" onClick={() => removeMeasurement(idx)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2"><Label>Observações</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
