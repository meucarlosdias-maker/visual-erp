'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QuotationBadge } from './QuotationBadge';
import { DISCOUNT_TYPE_LABELS } from '../validators';
import { LoadingLocal } from '@/components/feedback';
import { DollarSign, Clock, FileText, History } from '@/constants/icons';
import type { Quotation } from '../types';
import { quotationService } from '../services/quotation-service';

interface QuotationDetailProps {
  quotation: Quotation | null;
  loading: boolean;
  onUpdateStatus: (status: string) => void;
  onBack: () => void;
}

const STATUS_ACTIONS: Record<string, { label: string; status: string }[]> = {
  DRAFT: [{ label: 'Marcar como Pendente', status: 'PENDING' }],
  PENDING: [
    { label: 'Enviar', status: 'SENT' },
    { label: 'Aprovar', status: 'APPROVED' },
    { label: 'Rejeitar', status: 'REJECTED' },
  ],
  SENT: [
    { label: 'Aprovar', status: 'APPROVED' },
    { label: 'Rejeitar', status: 'REJECTED' },
  ],
  APPROVED: [],
  REJECTED: [{ label: 'Reabrir como Rascunho', status: 'DRAFT' }],
  EXPIRED: [],
  CANCELLED: [],
};

export function QuotationDetail({ quotation, loading, onUpdateStatus, onBack }: QuotationDetailProps) {
  const [versions, setVersions] = useState<Quotation[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(false);

  const fetchVersions = useCallback(async () => {
    if (!quotation) return;
    setVersionsLoading(true);
    try {
      const v = await quotationService.listVersions(quotation.number);
      setVersions(v);
    } catch {
      setVersions([]);
    } finally {
      setVersionsLoading(false);
    }
  }, [quotation]);

  useEffect(() => { fetchVersions(); }, [fetchVersions]);

  if (loading) {
    return <LoadingLocal message="Carregando orçamento..." />;
  }

  if (!quotation) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Orçamento não encontrado.</p>
        <Button variant="outline" className="mt-4" onClick={onBack}>Voltar</Button>
      </div>
    );
  }

  const isLatest = versions.length === 0 || quotation.version === Math.max(...versions.map((v) => v.version));
  const actions = STATUS_ACTIONS[quotation.status] ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{quotation.title}</h1>
          <p className="text-sm text-muted-foreground">
            {quotation.number} · v{quotation.version} · {quotation.createdAt.toLocaleDateString('pt-BR')}
            {!isLatest && <Badge variant="outline" className="ml-2 text-xs">Versão antiga</Badge>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <QuotationBadge status={quotation.status} />
          {isLatest && actions.map((action) => (
            <Button key={action.status} size="sm" onClick={() => onUpdateStatus(action.status)}>
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              R$ {quotation.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Válido até
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {quotation.validUntil ? quotation.validUntil.toLocaleDateString('pt-BR') : 'Sem data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Versão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">v{quotation.version}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Cliente</span>
                <p className="font-medium">{quotation.clientId || '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status</span>
                <p><QuotationBadge status={quotation.status} /></p>
              </div>
            </div>
            {quotation.description && (
              <div>
                <span className="text-muted-foreground">Descrição</span>
                <p className="mt-1">{quotation.description}</p>
              </div>
            )}
            {quotation.notes && (
              <div>
                <span className="text-muted-foreground">Observações</span>
                <p className="mt-1">{quotation.notes}</p>
              </div>
            )}
            {quotation.internalNotes && (
              <div>
                <span className="text-muted-foreground">Observações Internas</span>
                <p className="mt-1 italic">{quotation.internalNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {quotation.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            {quotation.discount > 0 && (
              <div className="flex justify-between text-destructive">
                <span>Desconto {quotation.discountType ? DISCOUNT_TYPE_LABELS[quotation.discountType] : ''}</span>
                <span>
                  {quotation.discountType === 'PERCENTAGE'
                    ? `${quotation.discount}%`
                    : `R$ ${quotation.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  }
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">
                R$ {quotation.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Itens ({quotation.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quotation.items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum item.</p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">#</th>
                    <th className="text-left py-2">Descrição</th>
                    <th className="text-right py-2">Qtd</th>
                    <th className="text-left py-2">Un</th>
                    <th className="text-right py-2">Preço Un.</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items.map((item, idx) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{idx + 1}</td>
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2">{item.unit}</td>
                      <td className="py-2 text-right">
                        R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 text-right font-medium">
                        R$ {item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {versions.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" />
              Versões ({versions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {versionsLoading ? (
              <LoadingLocal message="Carregando versões..." />
            ) : (
              <div className="space-y-2">
                {[...versions].reverse().map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-3">
                      <Badge variant={v.id === quotation.id ? 'default' : 'outline'}>
                        v{v.version}
                      </Badge>
                      <span className="text-sm">{v.createdAt.toLocaleDateString('pt-BR')}</span>
                      <QuotationBadge status={v.status} />
                      {v.id === quotation.id && <span className="text-xs text-muted-foreground">(atual)</span>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.assign(`/app/orcamentos/${v.id}`)}
                    >
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
