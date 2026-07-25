import type { ProviderInterface, CommunicationChannel, MessageRecord, MessageStatus } from '../types';

const providerRegistry = new Map<CommunicationChannel, ProviderInterface>();

const baseProvider: Omit<ProviderInterface, 'channel' | 'name'> = {
  async send(_conversationId: string, content: string, _attachments?: { name: string; url: string; type: string }[]): Promise<MessageRecord> {
    return {
      id: `msg-${Date.now()}`,
      conversationId: _conversationId,
      direction: 'outbound',
      sender: 'system',
      content,
      attachments: _attachments ?? null,
      status: 'sent',
      channel: null,
      metadata: null,
      createdAt: new Date(),
    };
  },
  async getStatus(_messageId: string): Promise<MessageStatus> {
    return 'delivered';
  },
};

export const providers: ProviderInterface[] = [
  { ...baseProvider, channel: 'whatsapp', name: 'WhatsApp' },
  { ...baseProvider, channel: 'email', name: 'E-mail' },
  { ...baseProvider, channel: 'sms', name: 'SMS' },
  { ...baseProvider, channel: 'telegram', name: 'Telegram' },
  { ...baseProvider, channel: 'instagram', name: 'Instagram' },
  { ...baseProvider, channel: 'facebook', name: 'Facebook Messenger' },
  { ...baseProvider, channel: 'chat', name: 'Chat Interno' },
  { ...baseProvider, channel: 'push', name: 'Push Notification' },
];

for (const p of providers) {
  providerRegistry.set(p.channel, p);
}

export function getProvider(channel: CommunicationChannel): ProviderInterface | undefined {
  return providerRegistry.get(channel);
}

export function getAllProviders(): ProviderInterface[] {
  return providers;
}

export function getChannelLabel(channel: CommunicationChannel): string {
  const labels: Record<CommunicationChannel, string> = {
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    sms: 'SMS',
    telegram: 'Telegram',
    instagram: 'Instagram',
    facebook: 'Facebook Messenger',
    chat: 'Chat Interno',
    push: 'Push Notification',
  };
  return labels[channel];
}
