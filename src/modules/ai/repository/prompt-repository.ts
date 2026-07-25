import { BaseRepository } from '@/lib/repository-base';
import type { AiPrompt } from '../types';
import type { PromptInput, PromptUpdate } from '../schemas';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockPrompts: AiPrompt[] = [
  {
    id: 'prompt-001', companyId: COMPANY_ID, name: 'Análise de Lead',
    module: 'CRM', version: 1,
    prompt: 'Analise o lead e sugira ações.',
    systemPrompt: 'Você é um assistente de CRM.',
    active: true,
    createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01'), deletedAt: null,
    createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'prompt-002', companyId: COMPANY_ID, name: 'Análise Financeira',
    module: 'Financeiro', version: 1,
    prompt: 'Analise os dados financeiros.',
    systemPrompt: 'Você é um assistente financeiro.',
    active: true,
    createdAt: new Date('2026-07-05'), updatedAt: new Date('2026-07-05'), deletedAt: null,
    createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class PromptRepository extends BaseRepository<AiPrompt, PromptInput, PromptUpdate> {
  async findAll(): Promise<AiPrompt[]> {
    return mockPrompts
      .filter((p) => !p.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<AiPrompt | null> {
    return mockPrompts.find((p) => p.id === id && !p.deletedAt) ?? null;
  }

  async findMany(filter: Partial<AiPrompt>): Promise<AiPrompt[]> {
    return mockPrompts.filter((p) => {
      if (p.deletedAt) return false;
      return Object.entries(filter).every(([key, value]) =>
        (p as unknown as Record<string, unknown>)[key] === value
      );
    });
  }

  async create(input: PromptInput): Promise<AiPrompt> {
    const entry: AiPrompt = {
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      name: input.name,
      module: input.module,
      version: 1,
      prompt: input.prompt,
      systemPrompt: input.systemPrompt ?? null,
      active: input.active,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
    };
    mockPrompts.push(entry);
    return entry;
  }

  async update(id: string, input: PromptUpdate): Promise<AiPrompt> {
    const idx = mockPrompts.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Prompt não encontrado');
    const old = mockPrompts[idx];
    if (input.prompt && input.prompt !== old.prompt) {
      const { prompt: _p, ...rest } = input;
      mockPrompts[idx] = {
        ...old,
        ...rest,
        prompt: input.prompt,
        version: old.version + 1,
        updatedAt: new Date(),
      };
    } else {
      mockPrompts[idx] = { ...old, ...input, updatedAt: new Date() };
    }
    return mockPrompts[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockPrompts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      mockPrompts[idx] = { ...mockPrompts[idx], deletedAt: new Date(), active: false };
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<AiPrompt> {
    const idx = mockPrompts.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Prompt não encontrado');
    mockPrompts[idx] = { ...mockPrompts[idx], deletedAt: null, active: true };
    return mockPrompts[idx];
  }

  async findByModule(module: string): Promise<AiPrompt[]> {
    return mockPrompts.filter((p) => !p.deletedAt && p.module === module);
  }
}

export const promptRepository = new PromptRepository();
