import { BaseRepository } from '@/lib/repository-base';
import type { Webhook } from '../types';
import type { WebhookInput, WebhookUpdate } from '../schemas';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockWebhooks: Webhook[] = [
  {
    id: 'wh-001', companyId: COMPANY_ID, name: 'Notificar CRM',
    url: 'https://hooks.example.com/crm', events: ['crm.client.created', 'crm.client.updated'],
    secret: 'whsec_mock_secret_001', active: true,
    createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01'), deletedAt: null,
    createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'wh-002', companyId: COMPANY_ID, name: 'Notificar Financeiro',
    url: 'https://hooks.example.com/financeiro', events: ['financial.receivable.created'],
    secret: 'whsec_mock_secret_002', active: true,
    createdAt: new Date('2026-07-10'), updatedAt: new Date('2026-07-10'), deletedAt: null,
    createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class WebhookRepository extends BaseRepository<Webhook, WebhookInput, WebhookUpdate> {
  async findAll(): Promise<Webhook[]> {
    return mockWebhooks
      .filter((w) => !w.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<Webhook | null> {
    return mockWebhooks.find((w) => w.id === id && !w.deletedAt) ?? null;
  }

  async findMany(filter: Partial<Webhook>): Promise<Webhook[]> {
    return mockWebhooks.filter((w) => {
      if (w.deletedAt) return false;
      return Object.entries(filter).every(([key, value]) =>
        (w as unknown as Record<string, unknown>)[key] === value
      );
    });
  }

  async create(input: WebhookInput): Promise<Webhook> {
    const secret = `whsec_${crypto.randomUUID().replace(/-/g, '')}`;
    const entry: Webhook = {
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      name: input.name,
      url: input.url,
      events: input.events,
      secret,
      active: input.active,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
    };
    mockWebhooks.push(entry);
    return entry;
  }

  async update(id: string, input: WebhookUpdate): Promise<Webhook> {
    const idx = mockWebhooks.findIndex((w) => w.id === id);
    if (idx === -1) throw new Error('Webhook não encontrado');
    mockWebhooks[idx] = { ...mockWebhooks[idx], ...input, updatedAt: new Date() };
    return mockWebhooks[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockWebhooks.findIndex((w) => w.id === id);
    if (idx !== -1) {
      mockWebhooks[idx] = { ...mockWebhooks[idx], deletedAt: new Date(), active: false };
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<Webhook> {
    const idx = mockWebhooks.findIndex((w) => w.id === id);
    if (idx === -1) throw new Error('Webhook não encontrado');
    mockWebhooks[idx] = { ...mockWebhooks[idx], deletedAt: null, active: true };
    return mockWebhooks[idx];
  }

  async findByEvent(event: string): Promise<Webhook[]> {
    return mockWebhooks.filter((w) => !w.deletedAt && w.active && w.events.includes(event));
  }

  async regenerateSecret(id: string): Promise<string> {
    const idx = mockWebhooks.findIndex((w) => w.id === id);
    if (idx === -1) throw new Error('Webhook não encontrado');
    const secret = `whsec_${crypto.randomUUID().replace(/-/g, '')}`;
    mockWebhooks[idx] = { ...mockWebhooks[idx], secret, updatedAt: new Date() };
    return secret;
  }
}

export const webhookRepository = new WebhookRepository();