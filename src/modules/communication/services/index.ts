import type { ConversationRecord, NotificationRecord, MessageTemplateRecord, CommunicationChannel, ConversationWithLastMessage, InboxSummary, InboxFilter } from '@/core/communication';
import { ConversationRepository, MessageRepository, NotificationRepository, TemplateRepository } from '../repository';
import type { ConversationCreateInput, ConversationUpdateInput, TemplateCreateInput, TemplateUpdateInput } from '../schemas';

export const CommunicationModuleService = {
  async sendMessage(conversationId: string, content: string, _channel: CommunicationChannel): Promise<boolean> {
    const conversation = await ConversationRepository.findById(conversationId);
    if (!conversation) return false;

    await MessageRepository.create({
      conversationId,
      direction: 'outbound',
      sender: 'system',
      content,
      attachments: null,
      status: 'sent',
      channel: _channel,
      metadata: null,
    });

    await ConversationRepository.update(conversationId, { lastMessageAt: new Date() });
    return true;
  },
};

export const ConversationModuleService = {
  async list(companyId: string): Promise<ConversationRecord[]> {
    return ConversationRepository.findAll(companyId);
  },

  async getById(id: string): Promise<ConversationRecord | null> {
    return ConversationRepository.findById(id);
  },

  async create(companyId: string, input: ConversationCreateInput): Promise<ConversationRecord> {
    return ConversationRepository.create({
      id: `conv-${Date.now()}`,
      companyId,
      channel: input.channel,
      customerId: input.customerId ?? null,
      customerName: input.customerName ?? null,
      assignedUserId: input.assignedUserId ?? null,
      status: input.status ?? 'active',
      lastMessageAt: null,
      metadata: (input.metadata as Record<string, unknown>) ?? null,
    });
  },

  async update(id: string, input: ConversationUpdateInput): Promise<ConversationRecord | null> {
    const existing = await ConversationRepository.findById(id);
    if (!existing) return null;
    return ConversationRepository.update(id, input as Partial<ConversationRecord>);
  },

  async delete(id: string): Promise<boolean> {
    return ConversationRepository.delete(id);
  },
};

export const InboxModuleService = {
  async list(companyId: string, filter?: InboxFilter): Promise<ConversationWithLastMessage[]> {
    const conversations = await ConversationRepository.findAll(companyId);
    let filtered = conversations;

    if (filter) {
      if (filter.channel) filtered = filtered.filter((c) => c.channel === filter.channel);
      if (filter.status) filtered = filtered.filter((c) => c.status === filter.status);
      if (filter.assignedUserId) filtered = filtered.filter((c) => c.assignedUserId === filter.assignedUserId);
      if (filter.search) {
        const term = filter.search.toLowerCase();
        filtered = filtered.filter((c) => c.customerName?.toLowerCase().includes(term));
      }
    }

    const result: ConversationWithLastMessage[] = [];
    for (const conv of filtered) {
      const msgs = await MessageRepository.findByConversation(conv.id);
      const lastMessage = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const unreadCount = msgs.filter((m) => m.direction === 'inbound' && m.status !== 'read').length;
      result.push({ conversation: conv, lastMessage, unreadCount });
    }

    result.sort((a, b) => {
      const aTime = a.conversation.lastMessageAt?.getTime() ?? a.conversation.createdAt.getTime();
      const bTime = b.conversation.lastMessageAt?.getTime() ?? b.conversation.createdAt.getTime();
      return bTime - aTime;
    });

    return result;
  },

  async getSummary(companyId: string): Promise<InboxSummary> {
    const conversations = await ConversationRepository.findAll(companyId);
    return {
      total: conversations.length,
      active: conversations.filter((c) => c.status === 'active').length,
      waiting: conversations.filter((c) => c.status === 'waiting').length,
      closed: conversations.filter((c) => c.status === 'closed').length,
      unread: 0,
    };
  },
};

export const NotificationModuleService = {
  async list(companyId: string): Promise<NotificationRecord[]> {
    return NotificationRepository.findAll(companyId);
  },

  async markAsRead(id: string): Promise<NotificationRecord | null> {
    return NotificationRepository.markAsRead(id);
  },

  async markAllAsRead(companyId: string, userId: string): Promise<number> {
    return NotificationRepository.markAllAsRead(companyId, userId);
  },

  async delete(id: string): Promise<boolean> {
    return NotificationRepository.delete(id);
  },

  async countUnread(companyId: string, userId: string): Promise<number> {
    return NotificationRepository.countUnread(companyId, userId);
  },
};

export const TemplateModuleService = {
  async list(companyId: string): Promise<MessageTemplateRecord[]> {
    return TemplateRepository.findAll(companyId);
  },

  async getById(id: string): Promise<MessageTemplateRecord | null> {
    return TemplateRepository.findById(id);
  },

  async create(companyId: string, input: TemplateCreateInput): Promise<MessageTemplateRecord> {
    return TemplateRepository.create({
      companyId,
      name: input.name,
      category: input.category,
      content: input.content,
      variables: input.variables ?? null,
      active: input.active,
    });
  },

  async update(id: string, input: TemplateUpdateInput): Promise<MessageTemplateRecord | null> {
    const existing = await TemplateRepository.findById(id);
    if (!existing) return null;
    return TemplateRepository.update(id, input as Partial<MessageTemplateRecord>);
  },

  async delete(id: string): Promise<boolean> {
    return TemplateRepository.delete(id);
  },
};
