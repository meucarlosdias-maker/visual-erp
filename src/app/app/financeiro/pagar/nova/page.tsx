'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { financialService } from '@/modules/financial/services/financial-service';
import { toast } from '@/components/feedback';
import { useState, useCallback } from 'react';

export default function NovaPagarPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = useCallback(async () => {
    if (!description.trim()) { toast.error('Descrição é obrigatória'); return; }
    if (!amount || Number(amount) <= 0) { toast.error('Valor deve ser positivo'); return; }
    if (!dueDate) { toast.error('Data de vencimento é obrigatória'); return; }
    setSaving(true);
    try {
      await financialService.createPayable({
        description: description.trim(),
        amount: Number(amount),
        dueDate: new Date(dueDate),
        issueDate: new Date(),
        status: 'PENDING',
        discount: 0, interest: 0, fine: 0, paidAmount: 0,
        notes,
      });
      toast.success('Conta a pagar criada');
      router.push('/app/financeiro/pagar');
    } catch {
      toast.error('Erro ao criar conta');
    } finally {
      setSaving(false);
    }
  }, [description, amount, dueDate, notes, router]);

  return (
    <CrudPage title="Nova Conta a Pagar" description="Registre um novo pagamento">
      <div className="max-w-lg space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Fornecedor de matéria-prima" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Vencimento</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
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
