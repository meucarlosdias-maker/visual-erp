import { BaseService } from '@/lib/service-base';
import { promptRepository, type PromptRepository } from '../repository/prompt-repository';
import { NotFoundError } from '@/lib/errors';
import type { AiPrompt } from '../types';
import type { PromptInput, PromptUpdate } from '../schemas';

export class PromptService extends BaseService<AiPrompt, PromptInput, PromptUpdate, PromptRepository> {
  protected entityName = 'Prompt de IA';

  constructor() {
    super(promptRepository);
  }

  async list(): Promise<AiPrompt[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<AiPrompt> {
    const p = await this.repository.findById(id);
    if (!p) throw new NotFoundError('Prompt', id);
    return p;
  }

  async create(input: PromptInput): Promise<AiPrompt> {
    return this.repository.create(input);
  }

  async update(id: string, input: PromptUpdate): Promise<AiPrompt> {
    await this.get(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    await this.get(id);
    return this.repository.delete(id);
  }

  async restore(id: string): Promise<AiPrompt> {
    return this.repository.restore(id);
  }

  async findByModule(module: string): Promise<AiPrompt[]> {
    return this.repository.findByModule(module);
  }
}

export const promptService = new PromptService();
