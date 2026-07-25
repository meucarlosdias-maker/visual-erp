import { BaseService } from '@/lib/service-base';
import { aiExecutionRepository, type AiExecutionRepository } from '../repository/execution-repository';
import type { AiExecution } from '../types';
import type { ExecutionInput } from '../schemas';

export class AiExecutionService extends BaseService<AiExecution, ExecutionInput, Partial<ExecutionInput>, AiExecutionRepository> {
  protected entityName = 'Execução de IA';

  constructor() {
    super(aiExecutionRepository);
  }

  async list(): Promise<AiExecution[]> {
    return this.repository.findAll();
  }

  async create(input: ExecutionInput): Promise<AiExecution> {
    return this.repository.create(input);
  }

  async get(id: string): Promise<AiExecution> {
    const exec = await this.repository.findById(id);
    if (!exec) throw new Error('Execução não encontrada');
    return exec;
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async restore(_id: string): Promise<AiExecution> {
    throw new Error('Execução não pode ser restaurada');
  }
}

export const aiExecutionService = new AiExecutionService();
