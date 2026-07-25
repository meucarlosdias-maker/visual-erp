'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, Search } from '@/constants/icons';
import { EmptyState, LoadingLocal, toast } from '@/components/feedback';
import { FinancialTable } from '@/modules/financial/components/FinancialTable';
import { useReceivables } from '@/modules/financial/hooks/use-receivables';
import { useDeleteConfirm } from '@/hooks/use-confirm';

export default function ReceberPage() {
  const router = useRouter();
  const { data, loading, receive, remove } = useReceivables();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();
  const [search, setSearch] = useState('');

  const [receiveDialog, setReceiveDialog] = useState<{ id: string; amount: number } | null>(null);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((r) =>
      r.number.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q),
    );
  }, [data, search]);

  const handleReceive = useCallback(async () => {
    if (!receiveDialog) return;
    if (receivedAmount <= 0) { toast.error('Valor recebido deve ser positivo'); return; }
    if (!paymentMethod.trim()) { toast.error('Informe o método de pagamento'); return; }
    const ok = await receive(receiveDialog.id, receivedAmount, paymentMethod);
    if (ok) toast.success('Recebimento registrado');
    setReceiveDialog(null);
  }, [receiveDialog, receivedAmount, paymentMethod, receive]);

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({ title: 'Remover conta a receber', description: 'Esta ação não pode ser desfeita.' });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Conta removida');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Contas a Receber"
        description="Gerencie os recebimentos dos clientes"
        actionNew={{ onClick: () => router.push('/app/financeiro/receber/nova') }}
        toolbar={
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 w-64" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        }
      >
        {loading ? (
          <LoadingLocal message="Carregando contas a receber..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<TrendingUp className="h-12 w-12 text-muted-foreground" />} title="Nenhuma conta a receber" description="Cadastre uma nova conta para começar." />
        ) : (
          <FinancialTable
            data={filtered}
            type="receivable"
            onRowClick={(id) => router.push(`/app/financeiro/receber/${id}`)}
            onEdit={(id) => router.push(`/app/financeiro/receber/${id}`)}
            onDelete={handleDelete}
          />
        )}
      </CrudPage>

      <Dialog open={!!receiveDialog} onOpenChange={() => setReceiveDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar Recebimento</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Valor a Receber</Label>
              <p className="text-lg font-bold">{receiveDialog?.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="receivedAmount">Valor Recebido</Label>
              <Input id="receivedAmount" type="number" step="0.01" value={receivedAmount || ''} onChange={(e) => setReceivedAmount(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pagamento</Label>
              <Input id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="Ex: PIX, Boleto, Cartão" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReceiveDialog(null)}>Cancelar</Button>
              <Button onClick={handleReceive}>Confirmar Recebimento</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {DeleteDialog}
    </>
  );
}
