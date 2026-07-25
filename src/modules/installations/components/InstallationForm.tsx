'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { INSTALLATION_STATUS_LABELS } from '../validators';
import type { Installation } from '../types';

interface InstallationFormProps {
  installation?: Installation | null;
  readOnly?: boolean;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
}

export function InstallationForm({ installation, readOnly, onSave, onCancel }: InstallationFormProps) {
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState(installation?.status ?? 'PLANNING');
  const [scheduledDate, setScheduledDate] = useState(
    installation?.scheduledDate ? installation.scheduledDate.toISOString().split('T')[0] : '',
  );
  const [address, setAddress] = useState(installation?.address ?? '');
  const [city, setCity] = useState(installation?.city ?? '');
  const [state, setState] = useState(installation?.state ?? '');
  const [zipCode, setZipCode] = useState(installation?.zipCode ?? '');
  const [contactName, setContactName] = useState(installation?.contactName ?? '');
  const [contactPhone, setContactPhone] = useState(installation?.contactPhone ?? '');
  const [notes, setNotes] = useState(installation?.notes ?? '');

  const handleSubmit = useCallback(async () => {
    setSaving(true);
    await onSave({
      status,
      scheduledDate: scheduledDate || null,
      address,
      city,
      state,
      zipCode,
      contactName,
      contactPhone,
      notes,
    });
    setSaving(false);
  }, [status, scheduledDate, address, city, state, zipCode, contactName, contactPhone, notes, onSave]);

  return (
    <div className="space-y-6">
      {installation && (
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <span className="text-muted-foreground">Nº</span>
            <p className="font-medium">{installation.number}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Projeto</span>
            <p className="font-medium">{installation.projectId}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        {readOnly ? (
          <p className="text-sm font-medium pt-2">{INSTALLATION_STATUS_LABELS[status] ?? status}</p>
        ) : (
          <Select value={status} onValueChange={(v) => setStatus(v || 'PLANNING')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(INSTALLATION_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduledDate">Data Agendada</Label>
        <Input id="scheduledDate" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} disabled={readOnly} />
      </div>

      <div className="space-y-2">
        <Label>Endereço</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input placeholder="Logradouro, número" value={address} onChange={(e) => setAddress(e.target.value)} readOnly={readOnly} />
          </div>
          <Input placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} readOnly={readOnly} />
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Estado" value={state} onChange={(e) => setState(e.target.value)} readOnly={readOnly} />
            <Input placeholder="CEP" value={zipCode} onChange={(e) => setZipCode(e.target.value)} readOnly={readOnly} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Contato</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Nome do contato" value={contactName} onChange={(e) => setContactName(e.target.value)} readOnly={readOnly} />
          <Input placeholder="Telefone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} readOnly={readOnly} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} readOnly={readOnly} placeholder="Instruções para a instalação..." />
      </div>

      {!readOnly && (
        <div className="flex justify-end gap-2">
          <CancelButton onClick={onCancel} disabled={saving} />
          <SaveButton onClick={handleSubmit} loading={saving} />
        </div>
      )}
    </div>
  );
}
