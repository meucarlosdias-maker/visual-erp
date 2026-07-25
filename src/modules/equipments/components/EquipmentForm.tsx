'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { EQUIPMENT_COST_LABELS } from '../schemas/equipment-schema';
import type { Equipment, EquipmentCategory, EquipmentCostType } from '../types';

interface EquipmentFormProps {
  equipment?: Equipment | null;
  categories: EquipmentCategory[];
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
}

export function EquipmentForm({ equipment, categories, onSave, onCancel }: EquipmentFormProps) {
  const [tab, setTab] = useState('informacoes');
  const [categoryId, setCategoryId] = useState(equipment?.categoryId ?? '');
  const [code, setCode] = useState(equipment?.code ?? '');
  const [name, setName] = useState(equipment?.name ?? '');
  const [costType, setCostType] = useState<EquipmentCostType>(equipment?.costType ?? 'HOUR');
  const [brand, setBrand] = useState(equipment?.brand ?? '');
  const [model, setModel] = useState(equipment?.model ?? '');
  const [serialNumber, setSerialNumber] = useState(equipment?.serialNumber ?? '');
  const [patrimonyNumber, setPatrimonyNumber] = useState(equipment?.patrimonyNumber ?? '');
  const [supplier, setSupplier] = useState(equipment?.supplier ?? '');
  const [purchaseValue, setPurchaseValue] = useState(equipment?.purchaseValue ?? 0);
  const [residualValue, setResidualValue] = useState(equipment?.residualValue ?? 0);
  const [hourCost, setHourCost] = useState(equipment?.hourCost ?? 0);
  const [dailyCost, setDailyCost] = useState(equipment?.dailyCost ?? 0);
  const [kmCost, setKmCost] = useState(equipment?.kmCost ?? 0);
  const [monthlyCost, setMonthlyCost] = useState(equipment?.monthlyCost ?? 0);
  const [fuelConsumption, setFuelConsumption] = useState<number | null>(equipment?.fuelConsumption ?? null);
  const [capacity, setCapacity] = useState<number | null>(equipment?.capacity ?? null);
  const [unit, setUnit] = useState(equipment?.unit ?? '');
  const [notes, setNotes] = useState(equipment?.notes ?? '');
  const [active, setActive] = useState(equipment?.active ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const ok = await onSave({
      categoryId, costType, code, name, brand, model, serialNumber, patrimonyNumber, supplier,
      purchaseDate: equipment?.purchaseDate ?? null,
      purchaseValue, residualValue,
      hourCost, dailyCost, kmCost, monthlyCost,
      fuelConsumption, capacity, unit, notes, active,
    });
    setSaving(false);
  };

  const costTypeOptions = Object.entries(EQUIPMENT_COST_LABELS).map(([value, label]) => ({ value, label }));

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
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex: IMP-001" />
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
                <SelectValue placeholder="Selecione uma categoria" />
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
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Número de Série</Label>
              <Input id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patrimonyNumber">Patrimônio</Label>
              <Input id="patrimonyNumber" value={patrimonyNumber} onChange={(e) => setPatrimonyNumber(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input id="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            </div>
            <div className="flex items-end gap-2">
              <Switch id="active" checked={active} onCheckedChange={setActive} />
              <Label htmlFor="active">Equipamento ativo</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="custos" className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="costType">Tipo de Custo</Label>
            <Select value={costType} onValueChange={(v) => v !== null && setCostType(v as EquipmentCostType)}>
              <SelectTrigger id="costType" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {costTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hourCost">Custo / Hora (R$)</Label>
              <Input id="hourCost" type="number" min={0} step={0.01} value={hourCost} onChange={(e) => setHourCost(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyCost">Custo / Diária (R$)</Label>
              <Input id="dailyCost" type="number" min={0} step={0.01} value={dailyCost} onChange={(e) => setDailyCost(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kmCost">Custo / KM (R$)</Label>
              <Input id="kmCost" type="number" min={0} step={0.01} value={kmCost} onChange={(e) => setKmCost(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyCost">Custo / Mês (R$)</Label>
              <Input id="monthlyCost" type="number" min={0} step={0.01} value={monthlyCost} onChange={(e) => setMonthlyCost(Number(e.target.value))} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="purchaseValue">Valor de Compra (R$)</Label>
              <Input id="purchaseValue" type="number" min={0} step={0.01} value={purchaseValue} onChange={(e) => setPurchaseValue(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="residualValue">Valor Residual (R$)</Label>
              <Input id="residualValue" type="number" min={0} step={0.01} value={residualValue} onChange={(e) => setResidualValue(Number(e.target.value))} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="caracteristicas" className="space-y-4 max-w-lg">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade</Label>
              <Input id="capacity" type="number" min={0} value={capacity ?? ''} onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade</Label>
              <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Ex: KG, L, M3" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuelConsumption">Consumo de Combustível</Label>
            <Input id="fuelConsumption" type="number" min={0} step={0.1} value={fuelConsumption ?? ''} onChange={(e) => setFuelConsumption(e.target.value ? Number(e.target.value) : null)} />
          </div>
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} placeholder="Observações sobre o equipamento..." />
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
