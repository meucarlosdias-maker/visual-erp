'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoadingLocal, toast } from '@/components/feedback';
import { TaskBadge } from './TaskBadge';
import { Play, Pause, CheckCircle2, RotateCcw, Clock, HardHat, CheckCheck } from '@/constants/icons';
import { useDepartmentTasks } from '../hooks/use-department-tasks';
import { useDepartments } from '../hooks/use-departments';

const STATUS_ORDER: Record<string, number> = {
  PENDING: 0,
  WAITING: 1,
  IN_PROGRESS: 2,
  PAUSED: 3,
  FINISHED: 4,
  CANCELLED: 5,
};

const ALLOWED_ACTIONS: Record<string, { label: string; nextStatus: string; icon: React.ComponentType<{ className?: string }>; variant?: string }[]> = {
  PENDING: [],
  WAITING: [{ label: 'Iniciar', nextStatus: 'IN_PROGRESS', icon: Play }],
  IN_PROGRESS: [
    { label: 'Pausar', nextStatus: 'PAUSED', icon: Pause },
    { label: 'Finalizar', nextStatus: 'FINISHED', icon: CheckCircle2 },
  ],
  PAUSED: [{ label: 'Retomar', nextStatus: 'IN_PROGRESS', icon: RotateCcw }],
  FINISHED: [],
  CANCELLED: [],
};

export function ProductionPanel() {
  const { data: departments } = useDepartments();
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const { data: tasks, loading, updateStatus } = useDepartmentTasks(selectedDeptId || null);

  const handleAction = async (taskId: string, status: string, label: string) => {
    const ok = await updateStatus(taskId, status);
    if (ok) toast.success(`Tarefa ${label.toLowerCase()} com sucesso`);
    else toast.error('Erro ao atualizar tarefa');
  };

  const grouped = tasks.reduce<Record<string, typeof tasks>>((acc, task) => {
    const key = task.projectName ?? task.projectId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  const sortedEntries = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    finished: tasks.filter((t) => t.status === 'FINISHED').length,
    waiting: tasks.filter((t) => t.status === 'WAITING').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel dos Setores</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe e gerencie as tarefas de cada departamento
          </p>
        </div>
        <div className="w-64">
          <Select value={selectedDeptId} onValueChange={(v) => setSelectedDeptId(v ?? '')}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um setor..." />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                    {dept.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedDeptId && (
        <div className="text-center py-16">
          <HardHat className="mx-auto h-16 w-16 text-muted-foreground/40" />
          <h2 className="mt-4 text-lg font-semibold text-muted-foreground">Selecione um setor</h2>
          <p className="text-sm text-muted-foreground">Escolha um departamento para visualizar suas tarefas</p>
        </div>
      )}

      {selectedDeptId && loading && <LoadingLocal message="Carregando tarefas..." />}

      {selectedDeptId && !loading && (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Total</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-600"><Clock className="h-4 w-4" /> Aguardando</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-blue-600">{stats.waiting}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-600"><HardHat className="h-4 w-4" /> Em Andamento</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600"><CheckCheck className="h-4 w-4" /> Finalizadas</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-green-600">{stats.finished}</p></CardContent>
            </Card>
          </div>

          {sortedEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma tarefa encontrada para este setor.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedEntries.map(([projectName, projectTasks]) => {
                const sorted = [...projectTasks].sort(
                  (a, b) => (STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0) || a.sequence - b.sequence,
                );
                return (
                  <div key={projectName}>
                    <h3 className="text-base font-semibold mb-3">{projectName}</h3>
                    <div className="space-y-2">
                      {sorted.map((task) => {
                        const actions = ALLOWED_ACTIONS[task.status] ?? [];
                        return (
                          <Card key={task.id} className={`border-l-4 ${task.status === 'IN_PROGRESS' ? 'border-l-amber-500' : task.status === 'FINISHED' ? 'border-l-green-500' : task.status === 'PAUSED' ? 'border-l-orange-500' : task.status === 'WAITING' ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
                            <CardContent className="py-3">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{task.title}</span>
                                    <TaskBadge status={task.status} />
                                  </div>
                                  {task.description && (
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
                                  )}
                                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                    <span>Seq: {task.sequence + 1}</span>
                                    {task.dependsOnTaskId && <span>· Aguardando anterior</span>}
                                    {task.estimatedHours && <span>· {task.estimatedHours}h previstas</span>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  {actions.map((action) => (
                                    <Button
                                      key={action.nextStatus}
                                      size="sm"
                                      variant={action.nextStatus === 'FINISHED' ? 'default' : 'outline'}
                                      onClick={() => handleAction(task.id, action.nextStatus, action.label)}
                                    >
                                      <action.icon className="mr-1 h-4 w-4" />
                                      {action.label}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
