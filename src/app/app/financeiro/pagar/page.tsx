'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingDown, Search } from '@/constants/icons';
import { EmptyState, LoadingLocal, toast } from '@/components/feedback';
import { FinancialTable } from '@/modules/financial/components/FinancialTable';
import { usePayables } from '@/modules/financial/hooks/use-payables';
import { useDeleteConfirm } from '@/hooks/use-confirm';

export default function PagarPage() {
  const router = useRouter();
  const { data, loading, pay, remove } = usePayables();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();
  const [search, setSearch] = useState('');

  const [payDialog, setPayDialog] = useState<{ id: string; amount: number } | null>(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((p) =>
      p.number.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
    );
  }, [data, search]);

  const handlePay = useCallback(async () => {
    if (!payDialog) return;
    if (paidAmount <= 0) { toast.error('Valor pago deve ser positivo'); return; }
    if (!paymentMethod.trim()) { toast.error('Informe o método de pagamento'); return; }
    const ok = await pay(payDialog.id, paidAmount, paymentMethod);
    if (ok) toast.success('Pagamento registrado');
    setPayDialog(null);
  }, [payDialog, paidAmount, paymentMethod, pay]);

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({ title: 'Remover conta a pagar', description: 'Esta ação não pode ser desfeita.' });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Conta removida');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Contas a Pagar"
        description="Gerencie os pagamentos a fornecedores"
        actionNew={{ onClick: () => router.push('/app/financeiro/pagar/nova') }}
        toolbar={
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 w-64" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        }
      >
        {loading ? (
          <LoadingLocal message="Carregando contas a pagar..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<TrendingDown className="h-12 w-12 text-muted-foreground" />} title="Nenhuma conta a pagar" description="Cadastre uma nova conta para começar." />
        ) : (
          <FinancialTable
            data={filtered}
            type="payable"
            onRowClick={(id) => router.push(`/app/financeiro/pagar/${id}`)}
            onEdit={(id) => router.push(`/app/financeiro/pagar/${id}`)}
            onDelete={handleDelete}
          />
        )}
      </CrudPage>

      <Dialog open={!!payDialog} onOpenChange={() => setPayDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar Pagamento</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Valor a Pagar</Label>
              <p className="text-lg font-bold">{payDialog?.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paidAmount">Valor Pago</Label>
              <Input id="paidAmount" type="number" step="0.01" value={paidAmount || ''} onChange={(e) => setPaidAmount(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payMethod">Método de Pagamento</Label>
              <Input id="payMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="Ex: PIX, Boleto, Cartão" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPayDialog(null)}>Cancelar</Button>
              <Button onClick={handlePay}>Confirmar Pagamento</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {DeleteDialog}
    </>
  );
}
