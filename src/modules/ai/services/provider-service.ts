import { BaseService } from '@/lib/service-base';
import { providerRepository, type ProviderRepository } from '../repository/provider-repository';
import { NotFoundError } from '@/lib/errors';
import type { AiProvider } from '../types';
import type { ProviderInput, ProviderUpdate } from '../schemas';

export class ProviderService extends BaseService<AiProvider, ProviderInput, ProviderUpdate, ProviderRepository> {
  protected entityName = 'Provedor de IA';

  constructor() {
    super(providerRepository);
  }

  async list(): Promise<AiProvider[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<AiProvider> {
    const p = await this.repository.findById(id);
    if (!p) throw new NotFoundError('Provedor de IA', id);
    return p;
  }

  async create(input: ProviderInput): Promise<AiProvider> {
    return this.repository.create(input);
  }

  async update(id: string, input: ProviderUpdate): Promise<AiProvider> {
    await this.get(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    await this.get(id);
    return this.repository.delete(id);
  }

  async restore(id: string): Promise<AiProvider> {
    return this.repository.restore(id);
  }

  async findActive(): Promise<AiProvider[]> {
    return this.repository.findActive();
  }
}

export const providerService = new ProviderService();
