export type CommunicationChannel = 'whatsapp' | 'email' | 'sms' | 'telegram' | 'instagram' | 'facebook' | 'chat' | 'push';

export type MessageDirection = 'inbound' | 'outbound';

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export type ConversationStatus = 'active' | 'waiting' | 'closed';

export type NotificationType = 'system' | 'approval' | 'financial' | 'production' | 'crm' | 'schedule' | 'ai';

export type TemplateCategory = 'commercial' | 'financial' | 'billing' | 'production' | 'installation' | 'pos_sale' | 'support' | 'general';

export interface ConversationRecord {
  id: string;
  companyId: string;
  channel: CommunicationChannel;
  customerId: string | null;
  customerName: string | null;
  assignedUserId: string | null;
  status: ConversationStatus;
  lastMessageAt: Date | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  sender: string | null;
  content: string;
  attachments: { name: string; url: string; type: string }[] | null;
  status: MessageStatus;
  channel: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface NotificationRecord {
  id: string;
  companyId: string;
  userId: string | null;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface MessageTemplateRecord {
  id: string;
  companyId: string;
  name: string;
  category: TemplateCategory;
  content: string;
  variables: string[] | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderInterface {
  channel: CommunicationChannel;
  name: string;
  send(conversationId: string, content: string, attachments?: { name: string; url: string; type: string }[]): Promise<MessageRecord>;
  getStatus(messageId: string): Promise<MessageStatus>;
}

export interface InboxFilter {
  channel?: CommunicationChannel;
  status?: ConversationStatus;
  assignedUserId?: string;
  search?: string;
}

export interface InboxSummary {
  total: number;
  active: number;
  waiting: number;
  closed: number;
  unread: number;
}

export interface ConversationWithLastMessage {
  conversation: ConversationRecord;
  lastMessage: MessageRecord | null;
  unreadCount: number;
}

export interface NotificationFilter {
  type?: NotificationType;
  read?: boolean;
  userId?: string;
}

export interface TemplateFilter {
  category?: TemplateCategory;
  search?: string;
  active?: boolean;
}

export interface SendMessageInput {
  conversationId: string;
  content: string;
  attachments?: { name: string; url: string; type: string }[];
}
