'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectBadge } from './ProjectBadge';
import { TaskBadge } from './TaskBadge';
import { TaskTable } from './TaskTable';
import { LoadingLocal } from '@/components/feedback';
import { FolderKanban, Clock, HardHat, CheckCircle2, Pencil, Plus } from '@/constants/icons';
import { PROJECT_STATUS_LABELS, PRIORITY_LABELS } from '../validators';
import { PRODUCTION_ORDER_STATUS_LABELS, PRODUCTION_ORDER_STATUS_COLORS } from '../validators/production-order';
import { departmentService } from '../services/department-service';
import { productionOrderService } from '../services/production-order-service';
import type { Project } from '../types';
import type { Department } from '../types';
import type { ProductionOrder } from '../types/production-order';

interface ProjectDetailProps {
  project: Project | null;
  loading: boolean;
  onUpdateStatus: (status: string) => void;
  onBack: () => void;
}

export function ProjectDetail({ project, loading, onUpdateStatus, onBack }: ProjectDetailProps) {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);

  useEffect(() => {
    departmentService.list().then(setDepartments).catch(() => {});
  }, []);

  useEffect(() => {
    if (project) {
      productionOrderService.listByProjectId(project.id).then(setProductionOrders).catch(() => {});
    }
  }, [project]);

  if (loading) {
    return <LoadingLocal message="Carregando projeto..." />;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Projeto não encontrado.</p>
        <Button variant="outline" className="mt-4" onClick={onBack}>Voltar</Button>
      </div>
    );
  }

  const STATUS_ACTIONS: Record<string, { label: string; status: string }[]> = {
    WAITING: [{ label: 'Iniciar Planejamento', status: 'PLANNING' }],
    PLANNING: [{ label: 'Iniciar Produção', status: 'IN_PRODUCTION' }],
    IN_PRODUCTION: [{ label: 'Aguardar Instalação', status: 'WAITING_INSTALLATION' }],
    WAITING_INSTALLATION: [{ label: 'Iniciar Instalação', status: 'INSTALLING' }],
    INSTALLING: [{ label: 'Finalizar', status: 'FINISHED' }],
    FINISHED: [{ label: 'Entregar', status: 'DELIVERED' }],
    DELIVERED: [],
    CANCELLED: [],
  };

  const actions = STATUS_ACTIONS[project.status] ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground">
            {project.number} · {project.createdAt.toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProjectBadge status={project.status} />
          {actions.map((action) => (
            <Button key={action.status} size="sm" onClick={() => onUpdateStatus(action.status)}>
              {action.label}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => router.push(`/app/projetos/${project.id}/editar`)}>
            <Pencil className="mr-1 h-4 w-4" /> Editar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><FolderKanban className="h-4 w-4 text-muted-foreground" /> Status</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold">{PROJECT_STATUS_LABELS[project.status] ?? project.status}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Início Prev.</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold">{project.expectedStartDate ? project.expectedStartDate.toLocaleDateString('pt-BR') : '—'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><HardHat className="h-4 w-4 text-muted-foreground" /> Prioridade</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold">{PRIORITY_LABELS[project.priority] ?? project.priority}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-muted-foreground" /> Tarefas</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold">{project.tasks.length}</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tarefas">
        <TabsList>
          <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
          <TabsTrigger value="ordens">Ordens de Produção</TabsTrigger>
          <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="tarefas" className="space-y-4 pt-4">
          <TaskTable
            tasks={project.tasks}
            departments={departments}
            readOnly
          />
        </TabsContent>

        <TabsContent value="ordens" className="space-y-4 pt-4">
          {productionOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhuma ordem de produção gerada.</p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Nº</th>
                    <th className="text-left py-2 px-3">Título</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Prioridade</th>
                    <th className="text-right py-2 px-3">Início</th>
                    <th className="text-right py-2 px-3">Término</th>
                  </tr>
                </thead>
                <tbody>
                  {productionOrders.map((po) => (
                    <tr key={po.id} className="border-b">
                      <td className="py-2 px-3 font-mono">{po.number}</td>
                      <td className="py-2 px-3 font-medium">{po.title}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRODUCTION_ORDER_STATUS_COLORS[po.status] ?? ''}`}>
                          {PRODUCTION_ORDER_STATUS_LABELS[po.status] ?? po.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">{PRIORITY_LABELS[po.priority] ?? po.priority}</td>
                      <td className="py-2 px-3 text-right">{po.startedAt ? po.startedAt.toLocaleDateString('pt-BR') : '—'}</td>
                      <td className="py-2 px-3 text-right">{po.finishedAt ? po.finishedAt.toLocaleDateString('pt-BR') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cronograma" className="space-y-4 pt-4">
          <div className="space-y-3">
            {project.tasks.map((task, idx) => {
              const prevEnd = idx > 0 ? project.tasks[idx - 1].finishedAt ?? project.tasks[idx - 1].startedAt : null;
              return (
                <div key={task.id} className="flex items-center gap-4 p-3 rounded border">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.departmentId ? departments.find((d) => d.id === task.departmentId)?.name ?? task.departmentId : '—'}
                      {task.estimatedHours && ` · ${task.estimatedHours}h previstas`}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                    {task.startedAt ? (
                      <span>{task.startedAt.toLocaleDateString('pt-BR')}</span>
                    ) : (
                      <span className="italic">não iniciado</span>
                    )}
                    {task.finishedAt && <span> → {task.finishedAt.toLocaleDateString('pt-BR')}</span>}
                  </div>
                  <TaskBadge status={task.status} />
                </div>
              );
            })}
            {project.tasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma tarefa para exibir no cronograma.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              {project.notes ? (
                <p className="text-sm whitespace-pre-wrap">{project.notes}</p>
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
