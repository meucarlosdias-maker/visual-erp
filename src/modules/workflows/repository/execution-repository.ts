import { BaseRepository } from '@/lib/repository-base';
import type { WorkflowExecution } from '../types';
import type { ExecutionInput } from '../schemas';

const mockExecutions: WorkflowExecution[] = [
  {
    id: 'exec-001', workflowId: 'wf-001',
    status: 'COMPLETED',
    startedAt: new Date('2026-07-10T10:00:00'),
    finishedAt: new Date('2026-07-10T10:00:01'),
    duration: 1234,
    error: null,
    logs: [
      { id: 'exec-log-001', executionId: 'exec-001', step: 'Notificar lead novo', status: 'completed', message: 'Notificação enviada', createdAt: new Date('2026-07-10T10:00:01') },
    ],
  },
  {
    id: 'exec-002', workflowId: 'wf-002',
    status: 'FAILED',
    startedAt: new Date('2026-07-11T14:30:00'),
    finishedAt: new Date('2026-07-11T14:30:02'),
    duration: 2567,
    error: 'Erro ao criar tarefa: usuário não encontrado',
    logs: [
      { id: 'exec-log-002', executionId: 'exec-002', step: 'Criar tarefa', status: 'failed', message: 'Usuário responsável não encontrado', createdAt: new Date('2026-07-11T14:30:02') },
    ],
  },
];

export class ExecutionRepository extends BaseRepository<WorkflowExecution, ExecutionInput, Partial<ExecutionInput>> {
  async findAll(): Promise<WorkflowExecution[]> {
    return [...mockExecutions].sort((a, b) => {
      const da = a.startedAt?.getTime() ?? 0;
      const db = b.startedAt?.getTime() ?? 0;
      return db - da;
    });
  }

  async findById(id: string): Promise<WorkflowExecution | null> {
    return mockExecutions.find((e) => e.id === id) ?? null;
  }

  async findMany(filter: Partial<WorkflowExecution>): Promise<WorkflowExecution[]> {
    return mockExecutions.filter((e) =>
      Object.entries(filter).every(([key, value]) =>
        (e as unknown as Record<string, unknown>)[key] === value
      )
    );
  }

  async create(input: ExecutionInput): Promise<WorkflowExecution> {
    const entry: WorkflowExecution = {
      id: crypto.randomUUID(),
      workflowId: input.workflowId,
      status: input.status,
      startedAt: input.startedAt ?? null,
      finishedAt: input.finishedAt ?? null,
      duration: input.duration ?? null,
      error: input.error ?? null,
      logs: [],
    };
    mockExecutions.push(entry);
    return entry;
  }

  async update(id: string, input: Partial<ExecutionInput>): Promise<WorkflowExecution> {
    const idx = mockExecutions.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Execução não encontrada');
    mockExecutions[idx] = { ...mockExecutions[idx], ...input };
    return mockExecutions[idx];
  }

  async delete(_id: string): Promise<boolean> {
    return true;
  }

  async restore(_id: string): Promise<WorkflowExecution> {
    throw new Error('Execução não pode ser restaurada');
  }

  async findByWorkflow(workflowId: string): Promise<WorkflowExecution[]> {
    return mockExecutions
      .filter((e) => e.workflowId === workflowId)
      .sort((a, b) => {
        const da = a.startedAt?.getTime() ?? 0;
        const db = b.startedAt?.getTime() ?? 0;
        return db - da;
      });
  }
}

export const executionRepository = new ExecutionRepository();
