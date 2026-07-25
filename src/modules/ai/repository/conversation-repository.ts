import { BaseRepository } from '@/lib/repository-base';
import type { AiConversation, AiMessage } from '../types';
import type { ConversationInput } from '../schemas';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockConversations: AiConversation[] = [
  {
    id: 'conv-001', companyId: COMPANY_ID, userId: 'user-001',
    title: 'Análise de lead novo', module: 'CRM',
    messages: [
      { id: 'msg-001', conversationId: 'conv-001', role: 'user', content: 'Analise este lead da empresa Tech Solutions', tokens: 12, createdAt: new Date('2026-07-10T10:00:00') },
      { id: 'msg-002', conversationId: 'conv-001', role: 'assistant', content: 'Cliente potencial no setor de tecnologia. Recomendo contato imediato.', tokens: 18, createdAt: new Date('2026-07-10T10:00:03') },
    ],
    executions: [],
    createdAt: new Date('2026-07-10'), updatedAt: new Date('2026-07-10'),
  },
];

export class ConversationRepository extends BaseRepository<AiConversation, ConversationInput, Partial<ConversationInput>> {
  async findAll(): Promise<AiConversation[]> {
    return [...mockConversations].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async findById(id: string): Promise<AiConversation | null> {
    return mockConversations.find((c) => c.id === id) ?? null;
  }

  async findMany(filter: Partial<AiConversation>): Promise<AiConversation[]> {
    return mockConversations.filter((c) =>
      Object.entries(filter).every(([key, value]) =>
        (c as unknown as Record<string, unknown>)[key] === value
      )
    );
  }

  async create(input: ConversationInput): Promise<AiConversation> {
    const entry: AiConversation = {
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      userId: input.userId ?? null,
      title: input.title,
      module: input.module ?? null,
      messages: [],
      executions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockConversations.push(entry);
    return entry;
  }

  async update(id: string, input: Partial<ConversationInput>): Promise<AiConversation> {
    const idx = mockConversations.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Conversa não encontrada');
    mockConversations[idx] = { ...mockConversations[idx], ...input, updatedAt: new Date() };
    return mockConversations[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockConversations.findIndex((c) => c.id === id);
    if (idx !== -1) {
      mockConversations.splice(idx, 1);
      return true;
    }
    return false;
  }

  async restore(_id: string): Promise<AiConversation> {
    throw new Error('Conversa não pode ser restaurada');
  }

  async addMessage(conversationId: string, msg: Omit<AiMessage, 'id'>): Promise<AiMessage> {
    const conv = mockConversations.find((c) => c.id === conversationId);
    if (!conv) throw new Error('Conversa não encontrada');
    const entry: AiMessage = { id: crypto.randomUUID(), ...msg };
    conv.messages.push(entry);
    conv.updatedAt = new Date();
    return entry;
  }
}

export const conversationRepository = new ConversationRepository();
