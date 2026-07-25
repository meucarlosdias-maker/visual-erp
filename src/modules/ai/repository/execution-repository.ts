import { BaseRepository } from '@/lib/repository-base';
import type { AiExecution } from '../types';
import type { ExecutionInput } from '../schemas';

const mockExecutions: AiExecution[] = [
  {
    id: 'exec-ai-001', conversationId: 'conv-001',
    provider: 'mock', model: 'mock-1',
    tokensInput: 50, tokensOutput: 30, cost: 0, duration: 320,
    status: 'completed', createdAt: new Date('2026-07-10T10:00:03'),
  },
];

export class AiExecutionRepository extends BaseRepository<AiExecution, ExecutionInput, Partial<ExecutionInput>> {
  async findAll(): Promise<AiExecution[]> {
    return [...mockExecutions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<AiExecution | null> {
    return mockExecutions.find((e) => e.id === id) ?? null;
  }

  async findMany(filter: Partial<AiExecution>): Promise<AiExecution[]> {
    return mockExecutions.filter((e) =>
      Object.entries(filter).every(([key, value]) =>
        (e as unknown as Record<string, unknown>)[key] === value
      )
    );
  }

  async create(input: ExecutionInput): Promise<AiExecution> {
    const entry: AiExecution = {
      id: crypto.randomUUID(),
      conversationId: input.conversationId ?? null,
      provider: input.provider,
      model: input.model,
      tokensInput: input.tokensInput,
      tokensOutput: input.tokensOutput,
      cost: input.cost,
      duration: input.duration,
      status: input.status,
      createdAt: new Date(),
    };
    mockExecutions.push(entry);
    return entry;
  }

  async update(id: string, input: Partial<ExecutionInput>): Promise<AiExecution> {
    const idx = mockExecutions.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Execução não encontrada');
    mockExecutions[idx] = { ...mockExecutions[idx], ...input };
    return mockExecutions[idx];
  }

  async delete(_id: string): Promise<boolean> {
    return true;
  }

  async restore(_id: string): Promise<AiExecution> {
    throw new Error('Execução não pode ser restaurada');
  }
}

export const aiExecutionRepository = new AiExecutionRepository();
