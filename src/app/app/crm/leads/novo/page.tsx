'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { leadService } from '@/modules/crm/services/lead-service';
import { LEAD_TEMPERATURE_LABELS } from '@/modules/crm/validators';
import { toast } from '@/components/feedback';
import { useState, useCallback } from 'react';

export default function NovoLeadPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [origin, setOrigin] = useState('website');
  const [temperature, setTemperature] = useState('WARM');
  const [notes, setNotes] = useState('');

  const handleSave = useCallback(async () => {
    if (!contactName.trim()) { toast.error('Nome do contato é obrigatório'); return; }
    setSaving(true);
    try {
      await leadService.create({
        contactName: contactName.trim(),
        companyName: companyName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        state: state.trim(),
        origin,
        temperature,
        notes,
        status: 'NEW',
        createdBy: 'user-001',
        updatedBy: 'user-001',
      });
      toast.success('Lead criado com sucesso');
      router.push('/app/crm/leads');
    } catch {
      toast.error('Erro ao criar lead');
    } finally {
      setSaving(false);
    }
  }, [contactName, companyName, phone, email, city, state, origin, temperature, notes, router]);

  return (
    <CrudPage title="Novo Lead" description="Cadastre um novo lead comercial">
      <div className="max-w-lg space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">Nome do Contato *</Label>
          <Input id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Nome completo" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Empresa</Label>
          <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Nome da empresa" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cidade" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">UF</Label>
            <Input id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="SP" maxLength={2} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Origem</Label>
            <Select value={origin} onValueChange={(v) => setOrigin(v ?? 'website')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Site</SelectItem>
                <SelectItem value="referral">Indicação</SelectItem>
                <SelectItem value="phone">Telefone</SelectItem>
                <SelectItem value="walk-in">Presencial</SelectItem>
                <SelectItem value="social">Redes Sociais</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Temperatura</Label>
            <Select value={temperature} onValueChange={(v) => setTemperature(v ?? 'WARM')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(LEAD_TEMPERATURE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observações sobre o lead..." />
        </div>
        <div className="flex justify-end gap-2">
          <CancelButton onClick={() => router.back()} disabled={saving} />
          <SaveButton onClick={handleSave} loading={saving} />
        </div>
      </div>
    </CrudPage>
  );
}
