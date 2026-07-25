import type { ConversationRecord, ConversationStatus, CommunicationChannel } from '../types';

const conversations: ConversationRecord[] = [];

export const ConversationEngine = {
  async create(data: Omit<ConversationRecord, 'createdAt' | 'updatedAt'>): Promise<ConversationRecord> {
    const record: ConversationRecord = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    conversations.push(record);
    return record;
  },

  async findById(id: string): Promise<ConversationRecord | null> {
    return conversations.find((c) => c.id === id) ?? null;
  },

  async findByCompany(companyId: string): Promise<ConversationRecord[]> {
    return conversations.filter((c) => c.companyId === companyId);
  },

  async update(id: string, data: Partial<ConversationRecord>): Promise<ConversationRecord | null> {
    const index = conversations.findIndex((c) => c.id === id);
    if (index === -1) return null;
    conversations[index] = { ...conversations[index], ...data, updatedAt: new Date() };
    return conversations[index];
  },

  async updateStatus(id: string, status: ConversationStatus): Promise<ConversationRecord | null> {
    return ConversationEngine.update(id, { status });
  },

  async assign(id: string, userId: string): Promise<ConversationRecord | null> {
    return ConversationEngine.update(id, { assignedUserId: userId });
  },

  async updateLastMessage(id: string, timestamp: Date): Promise<void> {
    const index = conversations.findIndex((c) => c.id === id);
    if (index !== -1) {
      conversations[index].lastMessageAt = timestamp;
      conversations[index].updatedAt = new Date();
    }
  },

  async delete(id: string): Promise<boolean> {
    const index = conversations.findIndex((c) => c.id === id);
    if (index === -1) return false;
    conversations.splice(index, 1);
    return true;
  },

  count(): number {
    return conversations.length;
  },

  _getAll(): ConversationRecord[] {
    return conversations;
  },
};
