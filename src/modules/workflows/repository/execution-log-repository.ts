import type { WorkflowExecutionLog } from '../types';

const mockLogs: WorkflowExecutionLog[] = [
  { id: 'log-001', executionId: 'exec-001', step: 'Notificar lead novo', status: 'completed', message: 'Notificação enviada com sucesso', createdAt: new Date('2026-07-10T10:00:01') },
  { id: 'log-002', executionId: 'exec-002', step: 'Criar tarefa', status: 'failed', message: 'Usuário responsável não encontrado', createdAt: new Date('2026-07-11T14:30:02') },
];

export class ExecutionLogRepository {
  async findByExecution(executionId: string): Promise<WorkflowExecutionLog[]> {
    return mockLogs
      .filter((l) => l.executionId === executionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async create(data: Omit<WorkflowExecutionLog, 'id'>): Promise<WorkflowExecutionLog> {
    const entry: WorkflowExecutionLog = {
      id: crypto.randomUUID(),
      ...data,
    };
    mockLogs.push(entry);
    return entry;
  }

  async findAll(): Promise<WorkflowExecutionLog[]> {
    return [...mockLogs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const executionLogRepository = new ExecutionLogRepository();
