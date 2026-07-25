'use client';

import { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, Loader2 } from '@/constants/icons';
import { DISCOUNT_TYPE_LABELS } from '../validators';
import { pricingEngine } from '@/core/engines/pricing';
import type { Quotation, QuotationItem } from '../types';

interface EditableItem {
  tempId: string;
  serviceId: string | null;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  pricingSnapshot: Record<string, unknown> | null;
  calculating: boolean;
}

const MOCK_SERVICES = [
  { id: 'svc-001', name: 'Instalação de Lona Oléfina' },
  { id: 'svc-002', name: 'Aplicação de Adesivo Vinílico' },
  { id: 'svc-003', name: 'Impressão Digital em ACM' },
];

function toEditable(item: QuotationItem): EditableItem {
  return {
    tempId: item.id,
    serviceId: item.serviceId,
    description: item.description,
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    pricingSnapshot: item.pricingSnapshot,
    calculating: false,
  };
}

interface QuotationFormProps {
  quotation?: Quotation | null;
  readOnly?: boolean;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
}

export function QuotationForm({ quotation, readOnly, onSave, onCancel }: QuotationFormProps) {
  const [tab, setTab] = useState('informacoes');
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(quotation?.title ?? '');
  const [description, setDescription] = useState(quotation?.description ?? '');
  const [clientId, setClientId] = useState(quotation?.clientId ?? '');
  const [validUntil, setValidUntil] = useState(
    quotation?.validUntil ? quotation.validUntil.toISOString().split('T')[0] : '',
  );
  const [notes, setNotes] = useState(quotation?.notes ?? '');
  const [internalNotes, setInternalNotes] = useState(quotation?.internalNotes ?? '');

  const [items, setItems] = useState<EditableItem[]>(
    (quotation?.items ?? []).map(toEditable),
  );

  const [discount, setDiscount] = useState(quotation?.discount ?? 0);
  const [discountType, setDiscountType] = useState<string | null>(quotation?.discountType ?? null);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.totalPrice, 0), [items]);

  const total = useMemo(() => {
    if (discountType === 'PERCENTAGE') return subtotal * (1 - discount / 100);
    if (discountType === 'VALUE') return Math.max(0, subtotal - discount);
    return subtotal;
  }, [subtotal, discount, discountType]);

  const updateItem = useCallback((tempId: string, patch: Partial<EditableItem>) => {
    setItems((prev) => prev.map((item) => {
      if (item.tempId !== tempId) return item;
      const updated = { ...item, ...patch };
      if ('quantity' in patch || 'unitPrice' in patch) {
        updated.totalPrice = updated.quantity * updated.unitPrice;
      }
      return updated;
    }));
  }, []);

  const addItem = useCallback(() => {
    const tempId = crypto.randomUUID();
    setItems((prev) => [
      ...prev,
      { tempId, serviceId: null, description: '', quantity: 1, unit: 'UN', unitPrice: 0, totalPrice: 0, pricingSnapshot: null, calculating: false },
    ]);
  }, []);

  const removeItem = useCallback((tempId: string) => {
    setItems((prev) => prev.filter((i) => i.tempId !== tempId));
  }, []);

  const duplicateItem = useCallback((item: EditableItem) => {
    const tempId = crypto.randomUUID();
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.tempId === item.tempId);
      const copy: EditableItem = { ...item, tempId, description: `${item.description} (cópia)`, calculating: false };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }, []);

  const moveItem = useCallback((tempId: string, direction: -1 | 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.tempId === tempId);
      if (idx === -1) return prev;
      const target = idx + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const handleServiceSelect = useCallback(async (tempId: string, serviceId: string) => {
    const svc = MOCK_SERVICES.find((s) => s.id === serviceId);
    if (!svc) return;

    updateItem(tempId, { serviceId, description: svc.name, calculating: true });

    try {
      const result = await pricingEngine.calculate({
        serviceId,
        companyId: '00000000-0000-0000-0000-000000000000',
        quantity: 1,
        variables: {},
        selectedComponents: [],
      });

      updateItem(tempId, {
        unitPrice: result.salePrice,
        totalPrice: result.salePrice,
        pricingSnapshot: result as unknown as Record<string, unknown>,
        calculating: false,
      });
    } catch {
      updateItem(tempId, { calculating: false });
    }
  }, [updateItem]);

  const handleSubmit = useCallback(async () => {
    setSaving(true);
    await onSave({
      title,
      description,
      clientId: clientId || null,
      validUntil: validUntil || null,
      subtotal,
      discount,
      discountType,
      total,
      notes,
      internalNotes,
      items: items.map((item) => ({
        serviceId: item.serviceId,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        pricingSnapshot: item.pricingSnapshot,
      })),
    });
    setSaving(false);
  }, [title, description, clientId, validUntil, subtotal, discount, discountType, total, notes, internalNotes, items, onSave]);

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="informacoes">Informações Gerais</TabsTrigger>
          <TabsTrigger value="itens">Itens</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} readOnly={readOnly} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente</Label>
              <Input id="clientId" value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="ID do cliente" readOnly={readOnly} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">Validade</Label>
              <Input id="validUntil" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} disabled={readOnly} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} readOnly={readOnly} />
          </div>
        </TabsContent>

        <TabsContent value="itens" className="space-y-4 pt-4">
          {!readOnly && (
            <div className="flex gap-2">
              <Button size="sm" onClick={addItem}>
                <Plus className="mr-1 h-4 w-4" /> Adicionar Item
              </Button>
            </div>
          )}

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum item. Clique em &quot;Adicionar Item&quot; para começar.
            </p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead className="w-24">Quantidade</TableHead>
                    <TableHead className="w-16">Un</TableHead>
                    <TableHead className="w-32">Valor Unitário</TableHead>
                    <TableHead className="w-32">Total</TableHead>
                    {!readOnly && <TableHead className="w-28">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={item.tempId}>
                      <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        {readOnly ? (
                          <span className="text-sm">{item.description}</span>
                        ) : (
                          <Select
                            value={item.serviceId ?? ''}
                            onValueChange={(v: string | null) => {
                              if (v) handleServiceSelect(item.tempId, v);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                              {MOCK_SERVICES.map((svc) => (
                                <SelectItem key={svc.id} value={svc.id}>{svc.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        {readOnly ? (
                          <span className="text-sm">{item.quantity}</span>
                        ) : (
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={item.quantity}
                            onChange={(e) => updateItem(item.tempId, { quantity: Number(e.target.value) })}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{item.unit}</TableCell>
                      <TableCell>
                        {item.calculating ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : readOnly ? (
                          <span className="text-sm">
                            R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.tempId, { unitPrice: Number(e.target.value) })}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        R$ {item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      {!readOnly && (
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicateItem(item)} title="Duplicar">
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem(item.tempId, -1)} disabled={idx === 0} title="Mover para cima">
                              <ArrowUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem(item.tempId, 1)} disabled={idx === items.length - 1} title="Mover para baixo">
                              <ArrowDown className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.tempId)} title="Remover">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {items.length > 0 && (
            <div className="rounded border p-3 space-y-1 text-sm">
              <div className="flex justify-between text-base font-bold pt-1">
                <span>Subtotal</span>
                <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">
                  R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Desconto</Label>
                  {readOnly ? (
                    <p className="text-sm font-medium pt-2">
                      {discount > 0
                        ? `${discountType === 'PERCENTAGE' ? `${discount}%` : `R$ ${discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}`
                        : 'Sem desconto'
                      }
                    </p>
                  ) : (
                    <Input
                      type="number"
                      min={0}
                      max={discountType === 'PERCENTAGE' ? 100 : undefined}
                      step={0.01}
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Desconto</Label>
                  {readOnly ? (
                    <p className="text-sm font-medium pt-2">{discountType ? DISCOUNT_TYPE_LABELS[discountType] ?? discountType : '—'}</p>
                  ) : (
                    <Select value={discountType ?? ''} onValueChange={(v: string | null) => setDiscountType(v || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nenhum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum</SelectItem>
                        <SelectItem value="PERCENTAGE">Porcentagem (%)</SelectItem>
                        <SelectItem value="VALUE">Valor (R$)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-xl pt-4 border-t">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Observações para o Cliente</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} readOnly={readOnly} placeholder="Informações que aparecerão no orçamento do cliente..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="internalNotes">Observações Internas</Label>
            <Textarea id="internalNotes" value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} readOnly={readOnly} placeholder="Anotações internas (não aparecem para o cliente)..." />
          </div>
        </TabsContent>
      </Tabs>

      {!readOnly && (
        <div className="flex justify-end gap-2">
          <CancelButton onClick={onCancel} disabled={saving} />
          <SaveButton onClick={handleSubmit} loading={saving} />
        </div>
      )}
    </div>
  );
}
