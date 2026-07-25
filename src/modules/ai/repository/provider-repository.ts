import { BaseRepository } from '@/lib/repository-base';
import type { AiProvider } from '../types';
import type { ProviderInput, ProviderUpdate } from '../schemas';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockProviders: AiProvider[] = [
  {
    id: 'prov-001', companyId: COMPANY_ID, name: 'OpenAI Produção',
    provider: 'openai', model: 'gpt-4o', apiKey: 'sk-mock-key-001',
    temperature: 0.7, maxTokens: 4096, active: true,
    createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01'), deletedAt: null,
    createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'prov-002', companyId: COMPANY_ID, name: 'Mock Local',
    provider: 'mock', model: 'mock-1', apiKey: 'mock-key',
    temperature: 0.5, maxTokens: 2048, active: true,
    createdAt: new Date('2026-07-15'), updatedAt: new Date('2026-07-15'), deletedAt: null,
    createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class ProviderRepository extends BaseRepository<AiProvider, ProviderInput, ProviderUpdate> {
  async findAll(): Promise<AiProvider[]> {
    return mockProviders
      .filter((p) => !p.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<AiProvider | null> {
    return mockProviders.find((p) => p.id === id && !p.deletedAt) ?? null;
  }

  async findMany(filter: Partial<AiProvider>): Promise<AiProvider[]> {
    return mockProviders.filter((p) => {
      if (p.deletedAt) return false;
      return Object.entries(filter).every(([key, value]) =>
        (p as unknown as Record<string, unknown>)[key] === value
      );
    });
  }

  async create(input: ProviderInput): Promise<AiProvider> {
    const entry: AiProvider = {
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      name: input.name,
      provider: input.provider,
      model: input.model,
      apiKey: input.apiKey,
      temperature: input.temperature,
      maxTokens: input.maxTokens,
      active: input.active,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
    };
    mockProviders.push(entry);
    return entry;
  }

  async update(id: string, input: ProviderUpdate): Promise<AiProvider> {
    const idx = mockProviders.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Provedor não encontrado');
    const { apiKey: _k, ...rest } = input;
    mockProviders[idx] = { ...mockProviders[idx], ...rest, updatedAt: new Date() };
    return mockProviders[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockProviders.findIndex((p) => p.id === id);
    if (idx !== -1) {
      mockProviders[idx] = { ...mockProviders[idx], deletedAt: new Date(), active: false };
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<AiProvider> {
    const idx = mockProviders.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Provedor não encontrado');
    mockProviders[idx] = { ...mockProviders[idx], deletedAt: null, active: true };
    return mockProviders[idx];
  }

  async findActive(): Promise<AiProvider[]> {
    return mockProviders.filter((p) => !p.deletedAt && p.active);
  }
}

export const providerRepository = new ProviderRepository();
