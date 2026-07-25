'use client';

import { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { ComponentType } from '@/modules/catalog/schemas/component-schema';
import { Modal } from '@/components/feedback';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/feedback';
import { COMPONENT_TYPE_LABELS } from '../validators';
import {
  Trash2, CheckCircle2, OctagonXIcon, Plus, ArrowUp, ArrowDown, Puzzle,
} from '@/constants/icons';
import type { ServiceCategory, ServiceSubcategory, ServiceComponent } from '../types';
import type { ServiceSchemaType } from '../schemas/service-schema';

interface ServiceWithComponents extends ServiceSchemaType {
  components?: ServiceComponent[];
}

interface CatalogServiceFormProps {
  service?: ServiceSchemaType | null;
  categories: ServiceCategory[];
  subcategories: ServiceSubcategory[];
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
}

const emptyComponent = (): Partial<ServiceComponent> => ({
  name: '', description: '', componentType: 'MATERIAL' as const,
  required: true, sequence: 0, active: true,
});

export function CatalogServiceForm({ service, categories, subcategories, onSave, onCancel }: CatalogServiceFormProps) {
  const [tab, setTab] = useState('gerais');
  const [saving, setSaving] = useState(false);

  const [code, setCode] = useState(service?.code ?? '');
  const [name, setName] = useState(service?.name ?? '');
  const [categoryId, setCategoryId] = useState(service?.categoryId ?? '');
  const [subcategoryId, setSubcategoryId] = useState(service?.subcategoryId ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [image, setImage] = useState(service?.image ?? '');
  const [version, setVersion] = useState(service?.version ?? '1.0.0');
  const [active, setActive] = useState(service?.active ?? true);

  const [requiresVisit, setRequiresVisit] = useState(service?.requiresVisit ?? false);
  const [requiresApproval, setRequiresApproval] = useState(service?.requiresApproval ?? false);
  const [requiresArt, setRequiresArt] = useState(service?.requiresArt ?? false);
  const [hasPrinting, setHasPrinting] = useState(service?.hasPrinting ?? false);
  const [hasInstallation, setHasInstallation] = useState(service?.hasInstallation ?? false);
  const [hasPainting, setHasPainting] = useState(service?.hasPainting ?? false);
  const [hasTransport, setHasTransport] = useState(service?.hasTransport ?? false);

  const [defaultMargin, setDefaultMargin] = useState(service?.defaultMargin ?? 0);
  const [minimumMargin, setMinimumMargin] = useState(service?.minimumMargin ?? 0);
  const [maximumMargin, setMaximumMargin] = useState(service?.maximumMargin ?? 100);
  const [commission, setCommission] = useState(service?.commission ?? 0);
  const [markup, setMarkup] = useState(service?.markup ?? 0);
  const [tax, setTax] = useState(service?.tax ?? 0);
  const [minimumCost, setMinimumCost] = useState(service?.minimumCost ?? 0);

  const [components, setComponents] = useState<Partial<ServiceComponent>[]>(
    (service as ServiceWithComponents | null)?.components?.map((c) => ({ ...c })) ?? []
  );
  const [componentModal, setComponentModal] = useState(false);
  const [editingCompIdx, setEditingCompIdx] = useState<number | null>(null);
  const [compForm, setCompForm] = useState<Partial<ServiceComponent>>(emptyComponent());

  const filteredSubcategories = useMemo(
    () => subcategories.filter((s) => s.categoryId === categoryId),
    [subcategories, categoryId]
  );

  const openNewComponent = useCallback(() => {
    setEditingCompIdx(null);
    setCompForm({ ...emptyComponent(), sequence: components.length + 1 });
    setComponentModal(true);
  }, [components.length]);

  const openEditComponent = useCallback((idx: number) => {
    setEditingCompIdx(idx);
    setCompForm({ ...components[idx] });
    setComponentModal(true);
  }, [components]);

  const saveComponent = useCallback(() => {
    if (!compForm.name?.trim()) return;
    if (editingCompIdx !== null) {
      setComponents((prev) => prev.map((c, i) => i === editingCompIdx ? compForm : c));
    } else {
      setComponents((prev) => [...prev, { ...compForm, sequence: prev.length + 1 }]);
    }
    setComponentModal(false);
  }, [compForm, editingCompIdx]);

  const removeComponent = useCallback((idx: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== idx).map((c, i) => ({ ...c, sequence: i + 1 })));
  }, []);

  const moveComponent = useCallback((idx: number, dir: -1 | 1) => {
    setComponents((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next.map((c, i) => ({ ...c, sequence: i + 1 }));
    });
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    const ok = await onSave({
      code, name, categoryId, subcategoryId: subcategoryId || null,
      description, image, version, active,
      requiresVisit, requiresApproval, requiresArt,
      hasPrinting, hasInstallation, hasPainting, hasTransport,
      defaultMargin, minimumMargin, maximumMargin, commission, markup, tax, minimumCost,
      _components: components,
    });
    setSaving(false);
  };

  const fieldsDirty =
    code !== (service?.code ?? '') ||
    name !== (service?.name ?? '') ||
    categoryId !== (service?.categoryId ?? '') ||
    subcategoryId !== (service?.subcategoryId ?? '') ||
    description !== (service?.description ?? '') ||
    image !== (service?.image ?? '') ||
    version !== (service?.version ?? '1.0.0') ||
    active !== (service?.active ?? true) ||
    requiresVisit !== (service?.requiresVisit ?? false) ||
    requiresApproval !== (service?.requiresApproval ?? false) ||
    requiresArt !== (service?.requiresArt ?? false) ||
    hasPrinting !== (service?.hasPrinting ?? false) ||
    hasInstallation !== (service?.hasInstallation ?? false) ||
    hasPainting !== (service?.hasPainting ?? false) ||
    hasTransport !== (service?.hasTransport ?? false) ||
    defaultMargin !== (service?.defaultMargin ?? 0) ||
    minimumMargin !== (service?.minimumMargin ?? 0) ||
    maximumMargin !== (service?.maximumMargin ?? 100) ||
    commission !== (service?.commission ?? 0) ||
    markup !== (service?.markup ?? 0) ||
    tax !== (service?.tax ?? 0) ||
    minimumCost !== (service?.minimumCost ?? 0);

  const characterFeatures = [
    { id: 'requiresVisit', label: 'Necessita Visita', value: requiresVisit, set: setRequiresVisit },
    { id: 'requiresApproval', label: 'Necessita Aprovação', value: requiresApproval, set: setRequiresApproval },
    { id: 'requiresArt', label: 'Necessita ART', value: requiresArt, set: setRequiresArt },
    { id: 'hasPrinting', label: 'Possui Impressão', value: hasPrinting, set: setHasPrinting },
    { id: 'hasInstallation', label: 'Possui Instalação', value: hasInstallation, set: setHasInstallation },
    { id: 'hasPainting', label: 'Possui Pintura', value: hasPainting, set: setHasPainting },
    { id: 'hasTransport', label: 'Possui Transporte', value: hasTransport, set: setHasTransport },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="gerais">Informações Gerais</TabsTrigger>
          <TabsTrigger value="caracteristicas">Características</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="componentes">Componentes</TabsTrigger>
        </TabsList>

        <TabsContent value="gerais" className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex: WEB-0001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select value={categoryId} onValueChange={(v) => { if (v !== null) { setCategoryId(v); setSubcategoryId(''); } }}>
              <SelectTrigger id="categoryId" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcategoryId">Subcategoria</Label>
            <Select value={subcategoryId} onValueChange={(v) => v !== null && setSubcategoryId(v)}>
              <SelectTrigger id="subcategoryId" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhuma</SelectItem>
                {filteredSubcategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Imagem (URL)</Label>
            <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="version">Versão</Label>
              <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="active" checked={active} onCheckedChange={setActive} />
            <Label htmlFor="active">Serviço ativo</Label>
          </div>
        </TabsContent>

        <TabsContent value="caracteristicas" className="space-y-4 max-w-lg">
          {characterFeatures.map((feat) => (
            <div key={feat.id} className="flex items-center justify-between">
              <Label htmlFor={feat.id}>{feat.label}</Label>
              <Switch id={feat.id} checked={feat.value} onCheckedChange={feat.set} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4 max-w-lg">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="defaultMargin">Margem Padrão (%)</Label>
              <Input id="defaultMargin" type="number" min={0} max={100} value={defaultMargin} onChange={(e) => setDefaultMargin(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumMargin">Margem Mínima (%)</Label>
              <Input id="minimumMargin" type="number" min={0} max={100} value={minimumMargin} onChange={(e) => setMinimumMargin(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maximumMargin">Margem Máxima (%)</Label>
              <Input id="maximumMargin" type="number" min={0} max={100} value={maximumMargin} onChange={(e) => setMaximumMargin(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">Comissão (%)</Label>
              <Input id="commission" type="number" min={0} value={commission} onChange={(e) => setCommission(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="markup">Markup</Label>
              <Input id="markup" type="number" min={0} step={0.01} value={markup} onChange={(e) => setMarkup(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Impostos (%)</Label>
              <Input id="tax" type="number" min={0} value={tax} onChange={(e) => setTax(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumCost">Custo Mínimo (R$)</Label>
              <Input id="minimumCost" type="number" min={0} value={minimumCost} onChange={(e) => setMinimumCost(Number(e.target.value))} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="componentes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Componentes do Serviço</h3>
            <Button variant="outline" size="sm" onClick={openNewComponent}>
              <Plus className="mr-1 h-4 w-4" /> Adicionar
            </Button>
          </div>

          {components.length === 0 ? (
            <EmptyState
              icon={<Puzzle className="h-10 w-10 text-muted-foreground" />}
              title="Nenhum componente"
              description="Adicione componentes a este serviço."
            />
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium w-8">#</th>
                    <th className="p-2 text-left font-medium">Nome</th>
                    <th className="p-2 text-left font-medium">Tipo</th>
                    <th className="p-2 text-center font-medium w-20">Obrigatório</th>
                    <th className="p-2 text-center font-medium w-16">Ativo</th>
                    <th className="p-2 text-center font-medium w-24">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((comp, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="p-2 text-muted-foreground">{comp.sequence}</td>
                      <td className="p-2 font-medium">{comp.name}</td>
                      <td className="p-2">
                        <Badge variant="outline">
                          {COMPONENT_TYPE_LABELS[comp.componentType ?? 'MATERIAL'] || comp.componentType}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        {comp.required ? <CheckCircle2 className="inline h-4 w-4 text-green-600" /> : <OctagonXIcon className="inline h-4 w-4 text-muted-foreground" />}
                      </td>
                      <td className="p-2 text-center">
                        {comp.active ? <CheckCircle2 className="inline h-4 w-4 text-green-600" /> : <OctagonXIcon className="inline h-4 w-4 text-muted-foreground" />}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-0.5">
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Mover para cima" disabled={idx === 0} onClick={() => moveComponent(idx, -1)}>
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Mover para baixo" disabled={idx === components.length - 1} onClick={() => moveComponent(idx, 1)}>
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Editar" onClick={() => openEditComponent(idx)}>
                            <span className="text-xs">Ed</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Remover" onClick={() => removeComponent(idx)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-2 pt-2 border-t">
        <SaveButton onClick={handleSubmit} loading={saving} disabled={!fieldsDirty} />
        <CancelButton onClick={onCancel} disabled={saving} />
      </div>

      <Modal
        open={componentModal}
        onOpenChange={setComponentModal}
        title={editingCompIdx !== null ? 'Editar Componente' : 'Novo Componente'}
        size="sm"
        submitLabel="Salvar"
        onSubmit={saveComponent}
        cancelLabel="Cancelar"
        onCancel={() => setComponentModal(false)}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="comp-name">Nome</Label>
            <Input id="comp-name" value={compForm.name ?? ''} onChange={(e) => setCompForm((prev) => ({ ...prev, name: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="comp-type">Tipo</Label>
            <Select value={compForm.componentType ?? 'MATERIAL'} onValueChange={(v) => v !== null && setCompForm((prev) => ({ ...prev, componentType: v as ComponentType }))}>
              <SelectTrigger id="comp-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COMPONENT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="comp-required">Obrigatório</Label>
            <Switch id="comp-required" checked={compForm.required ?? true} onCheckedChange={(v) => setCompForm((prev) => ({ ...prev, required: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="comp-active">Ativo</Label>
            <Switch id="comp-active" checked={compForm.active ?? true} onCheckedChange={(v) => setCompForm((prev) => ({ ...prev, active: v }))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
