import type { CommunicationChannel, ConversationStatus, NotificationType, TemplateCategory } from '@/core/communication';

export interface ConversationFormData {
  channel: CommunicationChannel;
  customerName: string;
  assignedUserId?: string;
  status: ConversationStatus;
}

export interface NotificationFormData {
  title: string;
  message: string;
  type: NotificationType;
  userId?: string;
  link?: string;
}

export interface TemplateFormData {
  name: string;
  category: TemplateCategory;
  content: string;
  variables: string[];
  active: boolean;
}

export interface MessageFormData {
  conversationId: string;
  content: string;
  attachments?: { name: string; url: string; type: string }[];
}

export interface InboxPageData {
  conversations: import('@/core/communication').ConversationWithLastMessage[];
  summary: import('@/core/communication').InboxSummary;
}
