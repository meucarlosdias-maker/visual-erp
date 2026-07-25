'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { UNIT_LABELS } from '../schemas/material-schema';
import type { Material } from '../types';
import type { MaterialCategory } from '../types';

interface MaterialFormProps {
  material?: Material | null;
  categories: MaterialCategory[];
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
}

export function MaterialForm({ material, categories, onSave, onCancel }: MaterialFormProps) {
  const [tab, setTab] = useState('informacoes');
  const [saving, setSaving] = useState(false);

  const [categoryId, setCategoryId] = useState(material?.categoryId ?? '');
  const [code, setCode] = useState(material?.code ?? '');
  const [name, setName] = useState(material?.name ?? '');
  const [brand, setBrand] = useState(material?.brand ?? '');
  const [manufacturer, setManufacturer] = useState(material?.manufacturer ?? '');
  const [supplier, setSupplier] = useState(material?.supplier ?? '');
  const [unit, setUnit] = useState(material?.unit ?? 'UN');
  const [reference, setReference] = useState(material?.reference ?? '');
  const [barcode, setBarcode] = useState(material?.barcode ?? '');
  const [active, setActive] = useState(material?.active ?? true);
  const [cost, setCost] = useState(material?.cost ?? 0);
  const [salePrice, setSalePrice] = useState(material?.salePrice ?? 0);
  const [lossPercent, setLossPercent] = useState(material?.lossPercent ?? 0);
  const [minimumStock, setMinimumStock] = useState(material?.minimumStock ?? 0);
  const [currentStock, setCurrentStock] = useState(material?.currentStock ?? 0);
  const [weight, setWeight] = useState<number | null>(material?.weight ?? null);
  const [width, setWidth] = useState<number | null>(material?.width ?? null);
  const [height, setHeight] = useState<number | null>(material?.height ?? null);
  const [thickness, setThickness] = useState<number | null>(material?.thickness ?? null);
  const [color, setColor] = useState(material?.color ?? '');
  const [notes, setNotes] = useState(material?.notes ?? '');

  const handleSubmit = async () => {
    setSaving(true);
    const ok = await onSave({
      categoryId, code, name, brand, manufacturer, supplier,
      unit, reference, barcode, active,
      cost, salePrice, lossPercent, minimumStock, currentStock,
      weight, width, height, thickness, color,
      notes,
    });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
          <TabsTrigger value="caracteristicas">Características</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes" className="space-y-4 max-w-lg">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex: PAP-0001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select value={categoryId} onValueChange={(v) => v !== null && setCategoryId(v)}>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Fabricante</Label>
              <Input id="manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input id="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade</Label>
              <Select value={unit} onValueChange={(v) => v !== null && setUnit(v)}>
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(UNIT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label} ({value})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reference">Referência</Label>
              <Input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Código de Barras</Label>
              <Input id="barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="active" checked={active} onCheckedChange={setActive} />
            <Label htmlFor="active">Ativo</Label>
          </div>
        </TabsContent>

        <TabsContent value="custos" className="space-y-4 max-w-lg">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cost">Custo</Label>
              <Input id="cost" type="number" min={0} step={0.01} value={cost} onChange={(e) => setCost(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Preço sugerido</Label>
              <Input id="salePrice" type="number" min={0} step={0.01} value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lossPercent">Perda (%)</Label>
              <Input id="lossPercent" type="number" min={0} value={lossPercent} onChange={(e) => setLossPercent(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumStock">Estoque mínimo</Label>
              <Input id="minimumStock" type="number" min={0} value={minimumStock} onChange={(e) => setMinimumStock(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentStock">Estoque atual</Label>
              <Input id="currentStock" type="number" min={0} value={currentStock} onChange={(e) => setCurrentStock(Number(e.target.value))} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="caracteristicas" className="space-y-4 max-w-lg">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso</Label>
              <Input id="weight" type="number" min={0} step={0.001} value={weight ?? ''} onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Largura</Label>
              <Input id="width" type="number" min={0} value={width ?? ''} onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura</Label>
              <Input id="height" type="number" min={0} value={height ?? ''} onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness">Espessura</Label>
              <Input id="thickness" type="number" min={0} step={0.01} value={thickness ?? ''} onChange={(e) => setThickness(e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-2 pt-2 border-t">
        <SaveButton onClick={handleSubmit} loading={saving} />
        <CancelButton onClick={onCancel} disabled={saving} />
      </div>
    </div>
  );
}
