'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ConversationRecord, NotificationRecord, MessageTemplateRecord, ConversationWithLastMessage, InboxSummary, CommunicationChannel, ConversationStatus } from '@/core/communication';
import { ConversationModuleService, InboxModuleService, NotificationModuleService, TemplateModuleService } from '../services';

export function useInbox(companyId = 'company-1') {
  const [data, setData] = useState<ConversationWithLastMessage[]>([]);
  const [summary, setSummary] = useState<InboxSummary>({ total: 0, active: 0, waiting: 0, closed: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [conversations, inboxSummary] = await Promise.all([
        InboxModuleService.list(companyId),
        InboxModuleService.getSummary(companyId),
      ]);
      setData(conversations);
      setSummary(inboxSummary);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, summary, loading, refetch };
}

export function useConversations(companyId = 'company-1') {
  const [data, setData] = useState<ConversationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ConversationModuleService.list(companyId);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, refetch };
}

export function useConversation(id: string) {
  const [conversation, setConversation] = useState<ConversationRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ConversationModuleService.getById(id).then((result) => {
      setConversation(result);
      setLoading(false);
    });
  }, [id]);

  return { conversation, loading };
}

export function useNotifications(companyId = 'company-1', userId = 'user-1') {
  const [data, setData] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [notifications, count] = await Promise.all([
        NotificationModuleService.list(companyId),
        NotificationModuleService.countUnread(companyId, userId),
      ]);
      setData(notifications);
      setUnreadCount(count);
    } finally {
      setLoading(false);
    }
  }, [companyId, userId]);

  useEffect(() => { refetch(); }, [refetch]);

  const markAsRead = useCallback(async (id: string) => {
    await NotificationModuleService.markAsRead(id);
    await refetch();
  }, [refetch]);

  const markAllAsRead = useCallback(async () => {
    await NotificationModuleService.markAllAsRead(companyId, userId);
    await refetch();
  }, [companyId, userId, refetch]);

  const delete_ = useCallback(async (id: string) => {
    await NotificationModuleService.delete(id);
    await refetch();
  }, [refetch]);

  return { data, unreadCount, loading, refetch, markAsRead, markAllAsRead, delete: delete_ };
}

export function useTemplates(companyId = 'company-1') {
  const [data, setData] = useState<MessageTemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TemplateModuleService.list(companyId);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, refetch };
}

export function useInboxFilter() {
  const [channel, setChannel] = useState<CommunicationChannel | ''>('');
  const [status, setStatus] = useState<ConversationStatus | ''>('');
  const [search, setSearch] = useState('');

  const reset = useCallback(() => {
    setChannel('');
    setStatus('');
    setSearch('');
  }, []);

  const hasFilter = channel !== '' || status !== '' || search !== '';

  return { channel, setChannel, status, setStatus, search, setSearch, reset, hasFilter };
}
