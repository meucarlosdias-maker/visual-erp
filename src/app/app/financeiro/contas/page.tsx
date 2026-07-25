'use client';

import { useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pencil, Building2 } from '@/constants/icons';
import { EmptyState, LoadingLocal, toast } from '@/components/feedback';
import { financialService } from '@/modules/financial/services/financial-service';
import { ACCOUNT_TYPE_LABELS } from '@/modules/financial/validators';
import { useEffect } from 'react';
import type { FinancialAccount } from '@/modules/financial/types';

function formatCurrency(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

export default function ContasPage() {
  const [data, setData] = useState<FinancialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formBank, setFormBank] = useState('');
  const [formAgency, setFormAgency] = useState('');
  const [formAccount, setFormAccount] = useState('');
  const [formType, setFormType] = useState('CHECKING');
  const [formInitialBalance, setFormInitialBalance] = useState('0');

  const fetch = useCallback(async () => {
    setLoading(true);
    const accounts = await financialService.listAccounts();
    setData(accounts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openNew = useCallback(() => {
    setEditingId(null);
    setFormName(''); setFormBank(''); setFormAgency(''); setFormAccount('');
    setFormType('CHECKING'); setFormInitialBalance('0');
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!formName.trim()) { toast.error('Nome é obrigatório'); return; }
    try {
      const data: Record<string, unknown> = {
        name: formName.trim(),
        bank: formBank,
        agency: formAgency,
        account: formAccount,
        type: formType,
      };
      if (!editingId) {
        data.initialBalance = Number(formInitialBalance) || 0;
        data.currentBalance = Number(formInitialBalance) || 0;
      }
      if (editingId) {
        await financialService.updateAccount(editingId, data);
      } else {
        await financialService.createAccount(data);
      }
      toast.success(editingId ? 'Conta atualizada' : 'Conta criada');
      setDialogOpen(false);
      fetch();
    } catch { toast.error('Erro ao salvar'); }
  }, [formName, formBank, formAgency, formAccount, formType, formInitialBalance, editingId, fetch]);

  return (
    <CrudPage
      title="Contas Financeiras"
      description="Gerencie as contas bancárias e de caixa"
      actionNew={{ onClick: openNew }}
    >
      {loading ? (
        <LoadingLocal message="Carregando contas..." />
      ) : data.length === 0 ? (
        <EmptyState icon={<Building2 className="h-12 w-12 text-muted-foreground" />} title="Nenhuma conta" description="Cadastre uma conta financeira." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((account) => (
            <Card key={account.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(account.currentBalance)}</p>
                <p className="text-xs text-muted-foreground mt-1">{ACCOUNT_TYPE_LABELS[account.type] ?? account.type}</p>
                {account.bank && <p className="text-xs text-muted-foreground">{account.bank} {account.agency && `· Ag ${account.agency}`} {account.account && `· CC ${account.account}`}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Editar Conta' : 'Nova Conta'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome</Label><Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex: Conta Principal" /></div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={formType} onValueChange={(v) => setFormType(v || 'CHECKING')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ACCOUNT_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2"><Label>Banco</Label><Input value={formBank} onChange={(e) => setFormBank(e.target.value)} placeholder="Banco" /></div>
              <div className="space-y-2"><Label>Agência</Label><Input value={formAgency} onChange={(e) => setFormAgency(e.target.value)} placeholder="0001" /></div>
              <div className="space-y-2"><Label>Conta</Label><Input value={formAccount} onChange={(e) => setFormAccount(e.target.value)} placeholder="12345-6" /></div>
            </div>
            {!editingId && (
              <div className="space-y-2"><Label>Saldo Inicial</Label><Input type="number" step="0.01" value={formInitialBalance} onChange={(e) => setFormInitialBalance(e.target.value)} placeholder="0,00" /></div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CrudPage>
  );
}
