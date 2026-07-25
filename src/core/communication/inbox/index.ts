import type { ConversationRecord, InboxFilter, InboxSummary, ConversationWithLastMessage } from '../types';
import { ConversationEngine } from '../conversations';
import { MessageEngine } from '../messages';

export const InboxEngine = {
  async list(companyId: string, filter?: InboxFilter): Promise<ConversationWithLastMessage[]> {
    let conversations = await ConversationEngine.findByCompany(companyId);

    if (filter) {
      if (filter.channel) conversations = conversations.filter((c) => c.channel === filter.channel);
      if (filter.status) conversations = conversations.filter((c) => c.status === filter.status);
      if (filter.assignedUserId) conversations = conversations.filter((c) => c.assignedUserId === filter.assignedUserId);
      if (filter.search) {
        const term = filter.search.toLowerCase();
        conversations = conversations.filter((c) =>
          c.customerName?.toLowerCase().includes(term) || c.id.includes(term),
        );
      }
    }

    const result: ConversationWithLastMessage[] = [];
    for (const conversation of conversations) {
      const msgs = await MessageEngine.findByConversation(conversation.id);
      const lastMessage = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const unreadCount = msgs.filter((m) => m.direction === 'inbound' && m.status !== 'read').length;
      result.push({ conversation, lastMessage, unreadCount });
    }

    result.sort((a, b) => {
      const aTime = a.conversation.lastMessageAt?.getTime() ?? a.conversation.createdAt.getTime();
      const bTime = b.conversation.lastMessageAt?.getTime() ?? b.conversation.createdAt.getTime();
      return bTime - aTime;
    });

    return result;
  },

  async getSummary(companyId: string): Promise<InboxSummary> {
    const conversations = await ConversationEngine.findByCompany(companyId);
    return {
      total: conversations.length,
      active: conversations.filter((c) => c.status === 'active').length,
      waiting: conversations.filter((c) => c.status === 'waiting').length,
      closed: conversations.filter((c) => c.status === 'closed').length,
      unread: 0,
    };
  },

  async markAsRead(conversationId: string): Promise<void> {
    const msgs = await MessageEngine.findByConversation(conversationId);
    for (const msg of msgs) {
      if (msg.direction === 'inbound') {
        await MessageEngine.updateStatus(msg.id, 'read');
      }
    }
  },
};
