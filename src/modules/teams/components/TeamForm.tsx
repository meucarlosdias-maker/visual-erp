'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { TEAM_ROLE_LABELS, teamRoleSchema } from '../schemas/member-schema';
import { Trash2, Pencil, X, Check } from '@/constants/icons';
import type { TeamWithRelations, TeamMember } from '../types';

interface TeamFormProps {
  team?: TeamWithRelations | null;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
  onAddMember?: (data: Record<string, unknown>) => Promise<boolean>;
  onUpdateMember?: (id: string, data: Record<string, unknown>) => Promise<boolean>;
  onRemoveMember?: (id: string) => Promise<boolean>;
  onAddProductivity?: (data: Record<string, unknown>) => Promise<boolean>;
  onRemoveProductivity?: (id: string) => Promise<boolean>;
}

const roleOptions = teamRoleSchema.options;

function MemberEditRow({
  member, onSave, onCancel,
}: {
  member: TeamMember;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role ?? 'LEADER');
  const [hourCost, setHourCost] = useState(member.hourCost);
  const [active, setActive] = useState(member.active);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ name, role, hourCost, active });
    setSaving(false);
  };

  return (
    <tr className="border-b bg-muted/30">
      <td className="px-4 py-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-sm" />
      </td>
      <td className="px-4 py-2">
        <Select value={role} onValueChange={(v) => v !== null && setRole(v)}>
          <SelectTrigger className="h-8 text-sm w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((r) => (
              <SelectItem key={r} value={r}>{TEAM_ROLE_LABELS[r] ?? r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 py-2">
        <Input type="number" min={0} step={0.01} value={hourCost} onChange={(e) => setHourCost(Number(e.target.value))} className="h-8 text-sm w-24" />
      </td>
      <td className="px-4 py-2">
        <Switch checked={active} onCheckedChange={setActive} />
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleSave} disabled={saving || !name}>
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onCancel} disabled={saving}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function TeamForm({
  team, onSave, onCancel,
  onAddMember, onUpdateMember, onRemoveMember,
  onAddProductivity, onRemoveProductivity,
}: TeamFormProps) {
  const [tab, setTab] = useState('equipe');
  const [code, setCode] = useState(team?.code ?? '');
  const [name, setName] = useState(team?.name ?? '');
  const [description, setDescription] = useState(team?.description ?? '');
  const [active, setActive] = useState(team?.active ?? true);
  const [hourCost, setHourCost] = useState(team?.hourCost ?? 0);
  const [dailyCost, setDailyCost] = useState(team?.dailyCost ?? 0);
  const [defaultMargin, setDefaultMargin] = useState(team?.defaultMargin ?? 0);
  const [saving, setSaving] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showProdForm, setShowProdForm] = useState(false);

  const isEditing = !!team;

  const handleSubmit = async () => {
    if (isEditing && (!team?.members || team.members.length === 0)) {
      return;
    }
    setSaving(true);
    await onSave({ code, name, description, active, hourCost, dailyCost, defaultMargin });
    setSaving(false);
  };

  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('LEADER');
  const [memberCost, setMemberCost] = useState(0);
  const [memberActive, setMemberActive] = useState(true);
  const [memberSaving, setMemberSaving] = useState(false);

  const resetMemberForm = () => {
    setMemberName('');
    setMemberRole('LEADER');
    setMemberCost(0);
    setMemberActive(true);
    setShowMemberForm(false);
  };

  const handleAddMember = async () => {
    if (!memberName) return;
    setMemberSaving(true);
    const ok = await onAddMember?.({ name: memberName, role: memberRole, hourCost: memberCost, active: memberActive });
    if (ok) resetMemberForm();
    setMemberSaving(false);
  };

  const [prodType, setProdType] = useState('');
  const [prodUnit, setProdUnit] = useState('');
  const [prodProduction, setProdProduction] = useState(0);
  const [prodInstallation, setProdInstallation] = useState(0);
  const [prodSaving, setProdSaving] = useState(false);

  const resetProdForm = () => {
    setProdType('');
    setProdUnit('');
    setProdProduction(0);
    setProdInstallation(0);
    setShowProdForm(false);
  };

  const handleAddProd = async () => {
    if (!prodType) return;
    setProdSaving(true);
    const ok = await onAddProductivity?.({
      serviceType: prodType, unit: prodUnit,
      productionPerHour: prodProduction, installationPerHour: prodInstallation,
    });
    if (ok) resetProdForm();
    setProdSaving(false);
  };

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
          {isEditing && <TabsTrigger value="integrantes">Integrantes</TabsTrigger>}
          {isEditing && <TabsTrigger value="produtividade">Produtividade</TabsTrigger>}
        </TabsList>

        <TabsContent value="equipe" className="space-y-4 max-w-lg">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex: EQP-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="active" checked={active} onCheckedChange={setActive} />
            <Label htmlFor="active">Ativo</Label>
          </div>
        </TabsContent>

        <TabsContent value="custos" className="space-y-4 max-w-lg">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="hourCost">Custo Hora (R$)</Label>
              <Input id="hourCost" type="number" min={0} step={0.01} value={hourCost} onChange={(e) => setHourCost(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyCost">Custo Diário (R$)</Label>
              <Input id="dailyCost" type="number" min={0} step={0.01} value={dailyCost} onChange={(e) => setDailyCost(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultMargin">Margem Padrão (%)</Label>
              <Input id="defaultMargin" type="number" min={0} max={100} value={defaultMargin} onChange={(e) => setDefaultMargin(Number(e.target.value))} />
            </div>
          </div>
        </TabsContent>

        {isEditing && (
          <TabsContent value="integrantes" className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">Nome</th>
                    <th className="px-4 py-2 text-left font-medium">Função</th>
                    <th className="px-4 py-2 text-left font-medium">Custo Hora</th>
                    <th className="px-4 py-2 text-left font-medium">Ativo</th>
                    <th className="px-4 py-2 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {team?.members?.map((mem) =>
                    editingMemberId === mem.id ? (
                      <MemberEditRow
                        key={mem.id}
                        member={mem}
                        onSave={async (data) => {
                          await onUpdateMember?.(mem.id, data);
                          setEditingMemberId(null);
                        }}
                        onCancel={() => setEditingMemberId(null)}
                      />
                    ) : (
                      <tr key={mem.id} className="border-b">
                        <td className="px-4 py-2 font-medium">{mem.name}</td>
                        <td className="px-4 py-2">
                          {mem.role ? (
                            <Badge variant="outline">{TEAM_ROLE_LABELS[mem.role] ?? mem.role}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2">R$ {mem.hourCost.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          <Badge variant={mem.active ? 'default' : 'secondary'}>
                            {mem.active ? 'Sim' : 'Não'}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setEditingMemberId(mem.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onRemoveMember?.(mem.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                  {(!team?.members || team.members.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
                        Nenhum integrante cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {showMemberForm ? (
              <div className="border rounded-md p-4 space-y-3">
                <p className="text-sm font-medium">Novo Integrante</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="mem-name" className="text-xs">Nome</Label>
                    <Input id="mem-name" value={memberName} onChange={(e) => setMemberName(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mem-role" className="text-xs">Função</Label>
                    <Select value={memberRole} onValueChange={(v) => v !== null && setMemberRole(v)}>
                      <SelectTrigger id="mem-role" className="h-8 text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((r) => (
                          <SelectItem key={r} value={r}>{TEAM_ROLE_LABELS[r] ?? r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mem-cost" className="text-xs">Custo Hora (R$)</Label>
                    <Input id="mem-cost" type="number" min={0} step={0.01} value={memberCost} onChange={(e) => setMemberCost(Number(e.target.value))} className="h-8 text-sm" />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <Switch id="mem-active" checked={memberActive} onCheckedChange={setMemberActive} />
                    <Label htmlFor="mem-active" className="text-xs">Ativo</Label>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" onClick={handleAddMember} disabled={memberSaving || !memberName}>
                    {memberSaving ? 'Salvando...' : 'Adicionar'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={resetMemberForm} disabled={memberSaving}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowMemberForm(true)}>
                Inserir Integrante
              </Button>
            )}
          </TabsContent>
        )}

        {isEditing && (
          <TabsContent value="produtividade" className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">Tipo Serviço</th>
                    <th className="px-4 py-2 text-left font-medium">Unidade</th>
                    <th className="px-4 py-2 text-left font-medium">Produção/Hora</th>
                    <th className="px-4 py-2 text-left font-medium">Instalação/Hora</th>
                    <th className="px-4 py-2 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {team?.productivity?.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{p.serviceType}</td>
                      <td className="px-4 py-2 text-muted-foreground">{p.unit || '—'}</td>
                      <td className="px-4 py-2">{p.productionPerHour}</td>
                      <td className="px-4 py-2">{p.installationPerHour}</td>
                      <td className="px-4 py-2">
                        <Button variant="ghost" size="icon" onClick={() => onRemoveProductivity?.(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {(!team?.productivity || team.productivity.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
                        Nenhum registro de produtividade.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {showProdForm ? (
              <div className="border rounded-md p-4 space-y-3">
                <p className="text-sm font-medium">Nova Produtividade</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="prod-type" className="text-xs">Tipo Serviço</Label>
                    <Input id="prod-type" value={prodType} onChange={(e) => setProdType(e.target.value)} placeholder="Ex: Impressão Digital" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prod-unit" className="text-xs">Unidade</Label>
                    <Input id="prod-unit" value={prodUnit} onChange={(e) => setProdUnit(e.target.value)} placeholder="Ex: M2" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prod-production" className="text-xs">Produção/Hora</Label>
                    <Input id="prod-production" type="number" min={0} value={prodProduction} onChange={(e) => setProdProduction(Number(e.target.value))} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prod-installation" className="text-xs">Instalação/Hora</Label>
                    <Input id="prod-installation" type="number" min={0} value={prodInstallation} onChange={(e) => setProdInstallation(Number(e.target.value))} className="h-8 text-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" onClick={handleAddProd} disabled={prodSaving || !prodType}>
                    {prodSaving ? 'Salvando...' : 'Adicionar'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={resetProdForm} disabled={prodSaving}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowProdForm(true)}>
                Adicionar Produtividade
              </Button>
            )}
          </TabsContent>
        )}
      </Tabs>

      <div className="flex items-center gap-2 pt-2 border-t">
        <SaveButton onClick={handleSubmit} loading={saving} />
        <CancelButton onClick={onCancel} disabled={saving} />
        {isEditing && (!team?.members || team.members.length === 0) && (
          <span className="text-xs text-destructive">Adicione pelo menos um integrante antes de salvar</span>
        )}
      </div>
    </div>
  );
}
