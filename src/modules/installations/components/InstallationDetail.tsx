'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InstallationBadge } from './InstallationBadge';
import { LoadingLocal, toast } from '@/components/feedback';
import { Clock, MapPin, User, Pencil, Truck, Plus, Trash2 } from '@/constants/icons';
import { INSTALLATION_STATUS_LABELS } from '../validators';
import { installationTeamRepository } from '../repository/installation-team-repository';
import { installationEquipmentRepository } from '../repository/installation-equipment-repository';
import { installationVehicleRepository } from '../repository/installation-vehicle-repository';
import type { Installation, InstallationTeam, InstallationEquipment, InstallationVehicle } from '../types';

interface InstallationDetailProps {
  installation: Installation | null;
  loading: boolean;
  onUpdateStatus: (status: string) => void;
  onBack: () => void;
}

function TeamForm({ installationId, onSaved }: { installationId: string; onSaved: () => void }) {
  const [teamId, setTeamId] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const handleSave = async () => {
    if (!teamId.trim()) { toast.error('Equipe é obrigatória'); return; }
    await installationTeamRepository.create({
      id: crypto.randomUUID(), installationId, teamId: teamId.trim(),
      leaderId: leaderId.trim() || null, estimatedHours: estimatedHours ? Number(estimatedHours) : null, actualHours: null,
    });
    toast.success('Equipe adicionada');
    onSaved();
  };
  return (
    <div className="flex items-end gap-2">
      <div className="space-y-1"><Label className="text-xs">Equipe</Label><Input size={1} value={teamId} onChange={(e) => setTeamId(e.target.value)} placeholder="ID da equipe" /></div>
      <div className="space-y-1"><Label className="text-xs">Líder</Label><Input size={1} value={leaderId} onChange={(e) => setLeaderId(e.target.value)} placeholder="ID do líder" /></div>
      <div className="space-y-1"><Label className="text-xs">Horas Prev.</Label><Input size={1} type="number" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)} placeholder="0" className="w-20" /></div>
      <Button size="sm" onClick={handleSave}><Plus className="h-4 w-4" /></Button>
    </div>
  );
}

function EquipmentForm({ installationId, onSaved }: { installationId: string; onSaved: () => void }) {
  const [equipmentId, setEquipmentId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const handleSave = async () => {
    if (!equipmentId.trim()) { toast.error('Equipamento é obrigatório'); return; }
    await installationEquipmentRepository.create({
      id: crypto.randomUUID(), installationId, equipmentId: equipmentId.trim(), quantity: Number(quantity) || 1,
    });
    toast.success('Equipamento adicionado');
    onSaved();
  };
  return (
    <div className="flex items-end gap-2">
      <div className="space-y-1"><Label className="text-xs">Equipamento</Label><Input size={1} value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} placeholder="ID do equipamento" /></div>
      <div className="space-y-1"><Label className="text-xs">Qtd</Label><Input size={1} type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" className="w-20" /></div>
      <Button size="sm" onClick={handleSave}><Plus className="h-4 w-4" /></Button>
    </div>
  );
}

function VehicleForm({ installationId, onSaved }: { installationId: string; onSaved: () => void }) {
  const [vehicle, setVehicle] = useState('');
  const [driver, setDriver] = useState('');
  const [plate, setPlate] = useState('');
  const handleSave = async () => {
    if (!vehicle.trim()) { toast.error('Veículo é obrigatório'); return; }
    await installationVehicleRepository.create({
      id: crypto.randomUUID(), installationId, vehicle: vehicle.trim(),
      driver: driver.trim() || '', plate: plate.trim() || '', notes: '',
    });
    toast.success('Veículo adicionado');
    onSaved();
  };
  return (
    <div className="flex items-end gap-2">
      <div className="space-y-1"><Label className="text-xs">Veículo</Label><Input size={1} value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Ex: Fiorino" /></div>
      <div className="space-y-1"><Label className="text-xs">Motorista</Label><Input size={1} value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="Nome" /></div>
      <div className="space-y-1"><Label className="text-xs">Placa</Label><Input size={1} value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="ABC-1234" className="w-28" /></div>
      <Button size="sm" onClick={handleSave}><Plus className="h-4 w-4" /></Button>
    </div>
  );
}

export function InstallationDetail({ installation, loading, onUpdateStatus, onBack }: InstallationDetailProps) {
  const router = useRouter();
  const [teams, setTeams] = useState<InstallationTeam[]>(installation?.teams ?? []);
  const [equipments, setEquipments] = useState<InstallationEquipment[]>(installation?.equipments ?? []);
  const [vehicles, setVehicles] = useState<InstallationVehicle[]>(installation?.vehicles ?? []);

  const refreshTeams = async () => {
    if (!installation) return;
    const list = await installationTeamRepository.listByInstallationId(installation.id);
    setTeams(list);
  };
  const refreshEquipments = async () => {
    if (!installation) return;
    const list = await installationEquipmentRepository.listByInstallationId(installation.id);
    setEquipments(list);
  };
  const refreshVehicles = async () => {
    if (!installation) return;
    const list = await installationVehicleRepository.listByInstallationId(installation.id);
    setVehicles(list);
  };

  if (loading) {
    return <LoadingLocal message="Carregando instalação..." />;
  }

  if (!installation) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Instalação não encontrada.</p>
        <Button variant="outline" className="mt-4" onClick={onBack}>Voltar</Button>
      </div>
    );
  }

  const STATUS_ACTIONS: Record<string, { label: string; status: string }[]> = {
    PLANNING: [{ label: 'Agendar', status: 'SCHEDULED' }],
    SCHEDULED: [{ label: 'Sair para Instalação', status: 'ON_ROUTE' }],
    ON_ROUTE: [{ label: 'Iniciar Instalação', status: 'IN_PROGRESS' }],
    IN_PROGRESS: [{ label: 'Pausar', status: 'PAUSED' }],
    PAUSED: [{ label: 'Retomar', status: 'IN_PROGRESS' }, { label: 'Concluir', status: 'FINISHED' }],
    FINISHED: [{ label: 'Registrar Entrega', status: 'DELIVERED' }],
    DELIVERED: [],
    CANCELLED: [],
  };

  const actions = STATUS_ACTIONS[installation.status] ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Instalação {installation.number}</h1>
          <p className="text-sm text-muted-foreground">
            Projeto: {installation.projectId} · Criada em {installation.createdAt.toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InstallationBadge status={installation.status} />
          {actions.map((action) => (
            <Button key={action.status} size="sm" onClick={() => onUpdateStatus(action.status)}>
              {action.label}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => router.push(`/app/instalacoes/${installation.id}/editar`)}>
            <Pencil className="mr-1 h-4 w-4" /> Editar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Status</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold">{INSTALLATION_STATUS_LABELS[installation.status] ?? installation.status}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> Local</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold truncate">{installation.city || '—'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> Contato</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold truncate">{installation.contactName || '—'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Truck className="h-4 w-4 text-muted-foreground" /> Equipes</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold">{teams.length}</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="informacoes">
        <TabsList>
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="equipes">Equipes</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="veiculos">Veículos</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Endereço</p>
              <p className="text-sm font-medium">{installation.address || '—'}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Cidade</p>
                <p className="text-sm font-medium">{installation.city || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <p className="text-sm font-medium">{installation.state || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CEP</p>
                <p className="text-sm font-medium">{installation.zipCode || '—'}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Contato</p>
                <p className="text-sm font-medium">{installation.contactName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Telefone</p>
                <p className="text-sm font-medium">{installation.contactPhone || '—'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Agendamento</p>
              <p className="text-sm font-medium">
                {installation.scheduledDate ? installation.scheduledDate.toLocaleDateString('pt-BR') : '—'}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Início</p>
                <p className="text-sm font-medium">
                  {installation.startDate ? installation.startDate.toLocaleDateString('pt-BR') : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Término</p>
                <p className="text-sm font-medium">
                  {installation.endDate ? installation.endDate.toLocaleDateString('pt-BR') : '—'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="equipes" className="space-y-4 pt-4">
          <TeamForm installationId={installation.id} onSaved={refreshTeams} />
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipe</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead className="text-right">Horas Prev.</TableHead>
                  <TableHead className="text-right">Horas Real.</TableHead>
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma equipe alocada.</TableCell></TableRow>
                ) : teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.teamId}</TableCell>
                    <TableCell>{team.leaderId || '—'}</TableCell>
                    <TableCell className="text-right">{team.estimatedHours ?? '—'}</TableCell>
                    <TableCell className="text-right">{team.actualHours ?? '—'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={async () => { await installationTeamRepository.delete(team.id); refreshTeams(); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="equipamentos" className="space-y-4 pt-4">
          <EquipmentForm installationId={installation.id} onSaved={refreshEquipments} />
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipamento</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipments.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Nenhum equipamento alocado.</TableCell></TableRow>
                ) : equipments.map((eq) => (
                  <TableRow key={eq.id}>
                    <TableCell className="font-medium">{eq.equipmentId}</TableCell>
                    <TableCell className="text-right">{eq.quantity}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={async () => { await installationEquipmentRepository.delete(eq.id); refreshEquipments(); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="veiculos" className="space-y-4 pt-4">
          <VehicleForm installationId={installation.id} onSaved={refreshVehicles} />
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum veículo alocado.</TableCell></TableRow>
                ) : vehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.vehicle}</TableCell>
                    <TableCell>{v.driver || '—'}</TableCell>
                    <TableCell className="font-mono">{v.plate || '—'}</TableCell>
                    <TableCell className="text-xs">{v.notes || '—'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={async () => { await installationVehicleRepository.delete(v.id); refreshVehicles(); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              {installation.notes ? (
                <p className="text-sm whitespace-pre-wrap">{installation.notes}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma observação registrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
