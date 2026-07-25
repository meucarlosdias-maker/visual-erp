import { BaseRepository } from '@/lib/repository-base';
import type { Workflow, WorkflowStep } from '../types';
import type { WorkflowInput, WorkflowUpdate } from '../schemas';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockWorkflows: Workflow[] = [
  {
    id: 'wf-001', companyId: COMPANY_ID, name: 'Notificar lead novo',
    description: 'Dispara notificação quando um lead é criado', active: true,
    trigger: 'LEAD_CREATED',
    steps: [
      {
        id: 'wfs-001', workflowId: 'wf-001', order: 0, type: 'action',
        configuration: { actionType: 'send_notification', actionConfig: { title: 'Novo lead', message: 'Um novo lead foi cadastrado', type: 'info' } },
        createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01'), deletedAt: null,
        createdBy: null, updatedBy: null, deletedBy: null,
      },
    ],
    createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01'), deletedAt: null,
    createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'wf-002', companyId: COMPANY_ID, name: 'Criar tarefa após orçamento aprovado',
    description: 'Cria uma tarefa de produção quando orçamento é aprovado', active: true,
    trigger: 'QUOTE_APPROVED',
    steps: [
      {
        id: 'wfs-002', workflowId: 'wf-002', order: 0, type: 'action',
        configuration: { actionType: 'create_task', actionConfig: { title: 'Iniciar produção', description: 'Orçamento aprovado, iniciar produção do projeto' } },
        createdAt: new Date('2026-07-05'), updatedAt: new Date('2026-07-05'), deletedAt: null,
        createdBy: null, updatedBy: null, deletedBy: null,
      },
    ],
    createdAt: new Date('2026-07-05'), updatedAt: new Date('2026-07-05'), deletedAt: null,
    createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class WorkflowRepository extends BaseRepository<Workflow, WorkflowInput, WorkflowUpdate> {
  async findAll(): Promise<Workflow[]> {
    return mockWorkflows
      .filter((w) => !w.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<Workflow | null> {
    return mockWorkflows.find((w) => w.id === id && !w.deletedAt) ?? null;
  }

  async findMany(filter: Partial<Workflow>): Promise<Workflow[]> {
    return mockWorkflows.filter((w) => {
      if (w.deletedAt) return false;
      return Object.entries(filter).every(([key, value]) =>
        (w as unknown as Record<string, unknown>)[key] === value
      );
    });
  }

  async create(input: WorkflowInput): Promise<Workflow> {
    const id = crypto.randomUUID();
    const entry: Workflow = {
      id,
      companyId: COMPANY_ID,
      name: input.name,
      description: input.description ?? null,
      active: input.active,
      trigger: input.trigger,
      steps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
    };
    mockWorkflows.push(entry);
    return entry;
  }

  async update(id: string, input: WorkflowUpdate): Promise<Workflow> {
    const idx = mockWorkflows.findIndex((w) => w.id === id);
    if (idx === -1) throw new Error('Workflow não encontrado');
    const { steps: _steps, ...rest } = input;
    mockWorkflows[idx] = { ...mockWorkflows[idx], ...rest, updatedAt: new Date() };
    return mockWorkflows[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockWorkflows.findIndex((w) => w.id === id);
    if (idx !== -1) {
      mockWorkflows[idx] = { ...mockWorkflows[idx], deletedAt: new Date(), active: false };
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<Workflow> {
    const idx = mockWorkflows.findIndex((w) => w.id === id);
    if (idx === -1) throw new Error('Workflow não encontrado');
    mockWorkflows[idx] = { ...mockWorkflows[idx], deletedAt: null, active: true };
    return mockWorkflows[idx];
  }

  async findByTrigger(trigger: string): Promise<Workflow[]> {
    return mockWorkflows.filter((w) => !w.deletedAt && w.active && w.trigger === trigger);
  }
}

export const workflowRepository = new WorkflowRepository();
