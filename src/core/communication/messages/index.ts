import type { MessageRecord, MessageDirection, MessageStatus } from '../types';

const messages: MessageRecord[] = [];

export const MessageEngine = {
  async send(data: Omit<MessageRecord, 'id' | 'createdAt'>): Promise<MessageRecord> {
    const record: MessageRecord = {
      ...data,
      id: `msg-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date(),
    };
    messages.push(record);
    return record;
  },

  async findByConversation(conversationId: string): Promise<MessageRecord[]> {
    return messages.filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async findById(id: string): Promise<MessageRecord | null> {
    return messages.find((m) => m.id === id) ?? null;
  },

  async updateStatus(id: string, status: MessageStatus): Promise<MessageRecord | null> {
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) return null;
    messages[index] = { ...messages[index], status };
    return messages[index];
  },

  async countByConversation(conversationId: string): Promise<number> {
    return messages.filter((m) => m.conversationId === conversationId).length;
  },

  _getAll(): MessageRecord[] {
    return messages;
  },
};
