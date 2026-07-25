'use client';

import type { ConversationRecord, NotificationRecord, MessageTemplateRecord } from '@/core/communication';
import { ConversationModuleService, NotificationModuleService, TemplateModuleService, CommunicationModuleService } from '../services';

export async function createConversation(companyId: string, channel: string, customerName: string): Promise<ConversationRecord> {
  return ConversationModuleService.create(companyId, {
    channel: channel as ConversationRecord['channel'],
    customerName,
    status: 'active',
  });
}

export async function closeConversation(id: string): Promise<ConversationRecord | null> {
  return ConversationModuleService.update(id, { status: 'closed' });
}

export async function sendMessage(conversationId: string, content: string, channel: string): Promise<boolean> {
  return CommunicationModuleService.sendMessage(conversationId, content, channel as ConversationRecord['channel']);
}

export async function markNotificationAsRead(id: string): Promise<NotificationRecord | null> {
  return NotificationModuleService.markAsRead(id);
}

export async function markAllNotificationsAsRead(companyId: string, userId: string): Promise<number> {
  return NotificationModuleService.markAllAsRead(companyId, userId);
}

export async function deleteNotification(id: string): Promise<boolean> {
  return NotificationModuleService.delete(id);
}

export async function createTemplate(companyId: string, name: string, category: string, content: string): Promise<MessageTemplateRecord> {
  return TemplateModuleService.create(companyId, {
    name,
    category: category as MessageTemplateRecord['category'],
    content,
    active: true,
  });
}

export async function updateTemplate(id: string, data: { name?: string; content?: string; active?: boolean }): Promise<MessageTemplateRecord | null> {
  return TemplateModuleService.update(id, data);
}

export async function deleteTemplate(id: string): Promise<boolean> {
  return TemplateModuleService.delete(id);
}
