import type { CommunicationChannel, ConversationRecord, MessageRecord, NotificationRecord, MessageTemplateRecord, InboxFilter, InboxSummary, ConversationWithLastMessage, NotificationFilter, TemplateFilter, SendMessageInput } from '../types';
import { ConversationEngine } from '../conversations';
import { MessageEngine } from '../messages';
import { InboxEngine } from '../inbox';
import { NotificationEngine } from '../notifications';
import { TemplateEngine } from '../templates';
import { getProvider } from '../providers';

export const CommunicationService = {
  async sendMessage(companyId: string, input: SendMessageInput, channel: CommunicationChannel): Promise<MessageRecord | null> {
    const conversation = await ConversationEngine.findById(input.conversationId);
    if (!conversation) return null;

    const provider = getProvider(channel);
    if (!provider) return null;

    const message = await provider.send(input.conversationId, input.content, input.attachments);
    await ConversationEngine.updateLastMessage(input.conversationId, new Date());
    return message;
  },

  async getConversationMessages(conversationId: string): Promise<MessageRecord[]> {
    return MessageEngine.findByConversation(conversationId);
  },
};

export const InboxService = {
  async list(companyId: string, filter?: InboxFilter): Promise<ConversationWithLastMessage[]> {
    return InboxEngine.list(companyId, filter);
  },

  async getSummary(companyId: string): Promise<InboxSummary> {
    return InboxEngine.getSummary(companyId);
  },

  async markAsRead(conversationId: string): Promise<void> {
    return InboxEngine.markAsRead(conversationId);
  },
};

export const ConversationService = {
  async create(data: Omit<ConversationRecord, 'createdAt' | 'updatedAt'>): Promise<ConversationRecord> {
    return ConversationEngine.create(data);
  },

  async getById(id: string): Promise<ConversationRecord | null> {
    return ConversationEngine.findById(id);
  },

  async update(id: string, data: Partial<ConversationRecord>): Promise<ConversationRecord | null> {
    return ConversationEngine.update(id, data);
  },

  async assign(id: string, userId: string): Promise<ConversationRecord | null> {
    return ConversationEngine.assign(id, userId);
  },

  async close(id: string): Promise<ConversationRecord | null> {
    return ConversationEngine.updateStatus(id, 'closed');
  },
};

export const MessageService = {
  async getByConversation(conversationId: string): Promise<MessageRecord[]> {
    return MessageEngine.findByConversation(conversationId);
  },
};

export const NotificationService = {
  async create(data: Omit<NotificationRecord, 'id' | 'createdAt' | 'read'>): Promise<NotificationRecord> {
    return NotificationEngine.create(data);
  },

  async list(companyId: string, filter?: NotificationFilter): Promise<NotificationRecord[]> {
    return NotificationEngine.findByCompany(companyId, filter);
  },

  async markAsRead(id: string): Promise<NotificationRecord | null> {
    return NotificationEngine.markAsRead(id);
  },

  async markAllAsRead(userId: string): Promise<number> {
    return NotificationEngine.markAllAsRead(userId);
  },

  async countUnread(userId: string): Promise<number> {
    return NotificationEngine.countUnread(userId);
  },

  async delete(id: string): Promise<boolean> {
    return NotificationEngine.delete(id);
  },
};

export const TemplateService = {
  async create(data: Omit<MessageTemplateRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MessageTemplateRecord> {
    return TemplateEngine.create(data);
  },

  async list(companyId: string, filter?: TemplateFilter): Promise<MessageTemplateRecord[]> {
    return TemplateEngine.findByCompany(companyId, filter);
  },

  async getById(id: string): Promise<MessageTemplateRecord | null> {
    return TemplateEngine.findById(id);
  },

  async update(id: string, data: Partial<MessageTemplateRecord>): Promise<MessageTemplateRecord | null> {
    return TemplateEngine.update(id, data);
  },

  async delete(id: string): Promise<boolean> {
    return TemplateEngine.delete(id);
  },

  render(template: MessageTemplateRecord, variables: Record<string, string>): string {
    return TemplateEngine.renderContent(template, variables);
  },

  extractVariables(content: string): string[] {
    return TemplateEngine.extractVariables(content);
  },

  getCategories(): { value: string; label: string }[] {
    return TemplateEngine.getCategories();
  },
};
