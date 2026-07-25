'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, DollarSign, Plus, Pencil, Trash2, Copy, Save, Clock, CheckCircle2, Upload, FileText } from '@/constants/icons';
import { WorkOrderStatusBadge, PriorityBadge } from './WorkOrderBadge';
import { WORK_ORDER_STATUS_LABELS, WORK_ORDER_PRIORITY_LABELS } from '../validators';
import { ATTACHMENT_CATEGORIES } from '../services/attachment-service';
import { toast } from '@/components/feedback';
import type { WorkOrder, WorkOrderItem, WorkOrderEvent, WorkOrderAttachment, WorkOrderStatus } from '../types';

interface WorkOrderDetailProps {
  order: WorkOrder;
  items: WorkOrderItem[];
  events: WorkOrderEvent[];
  attachments: WorkOrderAttachment[];
  onUpdateStatus: (status: WorkOrderStatus) => Promise<boolean>;
  onAddItem?: (data: Record<string, unknown>) => Promise<boolean>;
  onUpdateItem?: (id: string, data: Partial<WorkOrderItem>) => Promise<boolean>;
  onDeleteItem?: (id: string) => Promise<boolean>;
  onDuplicateItem?: (item: WorkOrderItem) => Promise<boolean>;
  onAddAttachment?: (data: Record<string, unknown>) => Promise<boolean>;
  onDeleteAttachment?: (id: string) => Promise<boolean>;
  onSaveNotes?: (clientNotes: string, internalNotes: string) => Promise<boolean>;
}

function formatCurrency(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}
function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleString('pt-BR');
}

export function WorkOrderDetail({
  order, items, events, attachments, onUpdateStatus,
  onAddItem, onUpdateItem, onDeleteItem, onDuplicateItem,
  onAddAttachment, onDeleteAttachment, onSaveNotes,
}: WorkOrderDetailProps) {
  const [clientNotes, setClientNotes] = useState(order.notes || '');
  const [internalNotes, setInternalNotes] = useState(order.internalNotes || '');
  const [savingNotes, setSavingNotes] = useState(false);

  const [itemDialog, setItemDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemUnit, setItemUnit] = useState('m2');
  const [itemWidth, setItemWidth] = useState('0');
  const [itemHeight, setItemHeight] = useState('0');
  const [itemUnitPrice, setItemUnitPrice] = useState('0');
  const [itemSector, setItemSector] = useState('');

  const [attachDialog, setAttachDialog] = useState(false);
  const [attachName, setAttachName] = useState('');
  const [attachType, setAttachType] = useState('Outros');

  const saveNotes = async () => {
    if (!onSaveNotes) return;
    setSavingNotes(true);
    const ok = await onSaveNotes(clientNotes, internalNotes);
    if (ok) toast.success('Observações salvas');
    else toast.error('Erro ao salvar');
    setSavingNotes(false);
  };

  const openNewItem = () => {
    setEditingItemId(null);
    setItemDescription(''); setItemQuantity('1'); setItemUnit('m2');
    setItemWidth('0'); setItemHeight('0'); setItemUnitPrice('0'); setItemSector('');
    setItemDialog(true);
  };

  const openEditItem = (item: WorkOrderItem) => {
    setEditingItemId(item.id);
    setItemDescription(item.description); setItemQuantity(String(item.quantity));
    setItemUnit(item.unit); setItemWidth(String(item.width)); setItemHeight(String(item.height));
    setItemUnitPrice(String(item.unitPrice)); setItemSector(item.productionSector);
    setItemDialog(true);
  };

  const handleSaveItem = async () => {
    if (!itemDescription.trim()) { toast.error('Descrição é obrigatória'); return; }
    const qty = Number(itemQuantity) || 1;
    const w = Number(itemWidth) || 0;
    const h = Number(itemHeight) || 0;
    const area = w * h * qty;
    const perimeter = w > 0 && h > 0 ? 2 * (w + h) : 0;
    const unitPrice = Number(itemUnitPrice) || 0;
    const totalPrice = unitPrice * qty;

    const data = {
      description: itemDescription.trim(),
      quantity: qty, unit: itemUnit, width: w, height: h,
      area, perimeter, unitPrice, totalPrice,
      productionSector: itemSector,
      sortOrder: items.length + 1,
    };

    if (editingItemId && onUpdateItem) {
      const ok = await onUpdateItem(editingItemId, data);
      if (ok) toast.success('Item atualizado');
      else { toast.error('Erro ao atualizar'); return; }
    } else if (onAddItem) {
      const ok = await onAddItem(data);
      if (ok) toast.success('Item adicionado');
      else { toast.error('Erro ao adicionar'); return; }
    }
    setItemDialog(false);
  };

  const handleDuplicate = async (item: WorkOrderItem) => {
    if (!onDuplicateItem) return;
    const ok = await onDuplicateItem({ ...item, id: '', sortOrder: items.length + 1 });
    if (ok) toast.success('Item duplicado');
    else toast.error('Erro ao duplicar');
  };

  const handleAddAttachment = async () => {
    if (!attachName.trim()) { toast.error('Nome é obrigatório'); return; }
    if (!onAddAttachment) return;
    const ok = await onAddAttachment({ name: attachName.trim(), type: attachType, workOrderId: order.id });
    if (ok) { toast.success('Arquivo adicionado'); setAttachDialog(false); setAttachName(''); }
    else toast.error('Erro ao adicionar');
  };

  const itemTotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

  return (
    <Tabs defaultValue="summary">
      <TabsList>
        <TabsTrigger value="summary">Resumo</TabsTrigger>
        <TabsTrigger value="items">Itens</TabsTrigger>
        <TabsTrigger value="files">Arquivos</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
        <TabsTrigger value="notes">Observações</TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="mt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{order.title}</h2>
            <p className="text-sm text-muted-foreground">{order.number}</p>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={order.priority} />
            <WorkOrderStatusBadge status={order.status as WorkOrderStatus} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /> Valor Total</CardTitle></CardHeader>
            <CardContent><p className="text-xl font-bold">{formatCurrency(order.totalValue)}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Início</CardTitle></CardHeader>
            <CardContent><p className="text-xl font-bold">{formatDate(order.startDate)}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Previsão</CardTitle></CardHeader>
            <CardContent><p className="text-xl font-bold">{formatDate(order.expectedEndDate)}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Conclusão</CardTitle></CardHeader>
            <CardContent><p className="text-xl font-bold">{formatDate(order.finishedDate)}</p></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Informações da OS</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
            <div><span className="text-muted-foreground">Cliente:</span><span className="font-medium ml-1">{order.clientId || '—'}</span></div>
            <div><span className="text-muted-foreground">Projeto:</span><span className="font-medium ml-1">{order.projectId || '—'}</span></div>
            <div><span className="text-muted-foreground">Orçamento:</span><span className="font-medium ml-1">{order.quotationId || '—'}</span></div>
            <div><span className="text-muted-foreground">Prioridade:</span><span className="font-medium ml-1">{WORK_ORDER_PRIORITY_LABELS[order.priority] ?? order.priority}</span></div>
            <div><span className="text-muted-foreground">Status:</span><span className="font-medium ml-1">{WORK_ORDER_STATUS_LABELS[order.status] ?? order.status}</span></div>
            <div className="sm:col-span-2"><span className="text-muted-foreground">Descrição:</span><p className="font-medium mt-0.5">{order.description || '—'}</p></div>
          </CardContent>
        </Card>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Alterar Status</span>
          <Select value={order.status} onValueChange={(v) => v && v !== order.status && onUpdateStatus(v as WorkOrderStatus)}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(WORK_ORDER_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="items" className="mt-6">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={openNewItem}><Plus className="h-4 w-4 mr-1" /> Novo Item</Button>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Medidas</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Valor Un.</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">Nenhum item cadastrado.</TableCell></TableRow>
                ) : items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm">{item.sortOrder}</TableCell>
                    <TableCell className="text-sm">{item.productionSector || '—'}</TableCell>
                    <TableCell className="text-sm font-medium max-w-[200px] truncate">{item.description}</TableCell>
                    <TableCell className="text-sm">{item.quantity}</TableCell>
                    <TableCell className="text-sm">{item.width > 0 || item.height > 0 ? `${item.width}x${item.height} ${item.unit}` : '—'}</TableCell>
                    <TableCell className="text-sm">{item.area > 0 ? `${item.area} ${item.unit}` : '—'}</TableCell>
                    <TableCell className="text-sm">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-sm font-medium">{formatCurrency(item.totalPrice)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditItem(item)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDuplicate(item)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        {onDeleteItem && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDeleteItem(item.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {items.length > 0 && (
            <div className="text-right text-sm font-medium">
              Total: {formatCurrency(itemTotal)}
            </div>
          )}
        </div>

        <Dialog open={itemDialog} onOpenChange={setItemDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingItemId ? 'Editar Item' : 'Novo Item'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Descrição *</Label><Input value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="Descrição do serviço" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Quantidade</Label><Input type="number" min="1" value={itemQuantity} onChange={(e) => setItemQuantity(e.target.value)} /></div>
                <div className="space-y-2"><Label>Unidade</Label>
                  <Select value={itemUnit} onValueChange={(v) => setItemUnit(v ?? 'm2')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">Metro</SelectItem>
                      <SelectItem value="m2">M²</SelectItem>
                      <SelectItem value="un">Unidade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Largura</Label><Input type="number" step="0.01" value={itemWidth} onChange={(e) => setItemWidth(e.target.value)} /></div>
                <div className="space-y-2"><Label>Altura</Label><Input type="number" step="0.01" value={itemHeight} onChange={(e) => setItemHeight(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Valor Unitário (R$)</Label><Input type="number" step="0.01" value={itemUnitPrice} onChange={(e) => setItemUnitPrice(e.target.value)} /></div>
                <div className="space-y-2"><Label>Setor</Label><Input value={itemSector} onChange={(e) => setItemSector(e.target.value)} placeholder="Ex: costura" /></div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setItemDialog(false)}>Cancelar</Button>
                <Button onClick={handleSaveItem}>Salvar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TabsContent>

      <TabsContent value="files" className="mt-6">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setAttachDialog(true)}><Upload className="h-4 w-4 mr-1" /> Adicionar Arquivo</Button>
          </div>

          {ATTACHMENT_CATEGORIES.map((cat) => {
            const catFiles = attachments.filter((a) => a.type === cat);
            if (catFiles.length === 0) return null;
            return (
              <div key={cat}>
                <h4 className="text-sm font-medium mb-2">{cat}</h4>
                <div className="space-y-1">
                  {catFiles.map((f) => (
                    <div key={f.id} className="flex items-center justify-between p-2 rounded border text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{f.name}</span>
                        <span className="text-xs text-muted-foreground">{f.description}</span>
                      </div>
                      {onDeleteAttachment && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDeleteAttachment(f.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {attachments.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhum arquivo anexado.</p>
          )}
        </div>

        <Dialog open={attachDialog} onOpenChange={setAttachDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>Adicionar Arquivo</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome do Arquivo *</Label><Input value={attachName} onChange={(e) => setAttachName(e.target.value)} placeholder="Ex: foto_fachada.jpg" /></div>
              <div className="space-y-2"><Label>Categoria</Label>
                <Select value={attachType} onValueChange={(v) => setAttachType(v ?? 'Outros')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ATTACHMENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAttachDialog(false)}>Cancelar</Button>
                <Button onClick={handleAddAttachment}>Adicionar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Timeline</CardTitle></CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Nenhum evento registrado.</p>
            ) : (
              <div className="space-y-0">
                {events.map((event, idx) => (
                  <div key={event.id} className="flex gap-3 pb-4 relative">
                    {idx < events.length - 1 && (
                      <div className="absolute left-3.5 top-8 bottom-0 w-px bg-border" />
                    )}
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center z-10">
                      {event.type === 'STATUS_CHANGE' || event.type === 'FINISHED' || event.type === 'DELIVERED' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(event.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Observações para o Cliente</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={clientNotes} onChange={(e) => setClientNotes(e.target.value)} placeholder="Observações visíveis ao cliente..." rows={4} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Observações Internas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} placeholder="Observações internas da equipe..." rows={4} />
              <div className="flex justify-end">
                <Button onClick={saveNotes} disabled={savingNotes}>
                  <Save className="h-4 w-4 mr-1" /> {savingNotes ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
