'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FinancialBadge } from '@/modules/financial/components/FinancialBadge';
import { financialService } from '@/modules/financial/services/financial-service';
import { LoadingLocal, toast } from '@/components/feedback';
import { DollarSign, Calendar, Hash } from '@/constants/icons';
import type { AccountsPayable } from '@/modules/financial/types';

function formatCurrency(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function formatDate(d: Date | string | null | undefined) { return d ? new Date(d).toLocaleDateString('pt-BR') : '—'; }

export default function PagarDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<AccountsPayable | null>(null);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    financialService.getPayable(id).then((p) => {
      setData(p);
      if (p) { setPaidAmount(p.amount); }
    }).finally(() => setLoading(false));
  }, [id]);

  const handlePay = async () => {
    if (!data) return;
    if (paidAmount <= 0) { toast.error('Valor inválido'); return; }
    try {
      await financialService.payPayable(data.id, paidAmount, paymentMethod || 'Avulso');
      toast.success('Pagamento registrado');
      setPayOpen(false);
      const updated = await financialService.getPayable(id);
      setData(updated);
    } catch {
      toast.error('Erro ao registrar pagamento');
    }
  };

  if (loading) return <LoadingLocal message="Carregando..." />;
  if (!data) return <p className="text-center py-12 text-muted-foreground">Conta não encontrada.</p>;

  return (
    <>
      <CrudPage title={`Conta a Pagar ${data.number}`} description="">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{data.description}</h2>
              <p className="text-sm text-muted-foreground">Emitida em {formatDate(data.issueDate)}</p>
            </div>
            <div className="flex items-center gap-2">
              <FinancialBadge status={data.status} />
              {data.status !== 'PAID' && data.status !== 'CANCELLED' && (
                <Button onClick={() => setPayOpen(true)}>
                  <DollarSign className="mr-1 h-4 w-4" /> Registrar Pagamento
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /> Valor</CardTitle></CardHeader>
              <CardContent><p className="text-xl font-bold">{formatCurrency(data.amount)}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Vencimento</CardTitle></CardHeader>
              <CardContent><p className="text-xl font-bold">{formatDate(data.dueDate)}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /> Pago</CardTitle></CardHeader>
              <CardContent><p className="text-xl font-bold">{formatCurrency(data.paidAmount)}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /> Método</CardTitle></CardHeader>
              <CardContent><p className="text-xl font-bold">{data.paymentMethod || '—'}</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Detalhes</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
              <div><span className="text-muted-foreground">Fornecedor:</span> <span className="font-medium">{data.supplierId || '—'}</span></div>
              <div><span className="text-muted-foreground">Projeto:</span> <span className="font-medium">{data.projectId || '—'}</span></div>
              <div><span className="text-muted-foreground">Desconto:</span> <span className="font-medium">{formatCurrency(data.discount)}</span></div>
              <div><span className="text-muted-foreground">Juros:</span> <span className="font-medium">{formatCurrency(data.interest)}</span></div>
              <div><span className="text-muted-foreground">Multa:</span> <span className="font-medium">{formatCurrency(data.fine)}</span></div>
              <div><span className="text-muted-foreground">Data Pagamento:</span> <span className="font-medium">{formatDate(data.paymentDate)}</span></div>
              {data.notes && <div className="sm:col-span-2"><span className="text-muted-foreground">Observações:</span> <span className="font-medium">{data.notes}</span></div>}
            </CardContent>
          </Card>
        </div>
      </CrudPage>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar Pagamento</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Valor Total</Label><p className="text-lg font-bold">{formatCurrency(data.amount)}</p></div>
            <div className="space-y-2"><Label htmlFor="payAmount">Valor Pago</Label><Input id="payAmount" type="number" step="0.01" value={paidAmount || ''} onChange={(e) => setPaidAmount(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label htmlFor="payMethod">Método</Label><Input id="payMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="Ex: PIX, Boleto" /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPayOpen(false)}>Cancelar</Button>
              <Button onClick={handlePay}>Confirmar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
