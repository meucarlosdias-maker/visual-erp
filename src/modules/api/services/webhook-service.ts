import { BaseService } from '@/lib/service-base';
import { webhookRepository, WebhookRepository } from '../repository/webhook-repository';
import { NotFoundError } from '@/lib/errors';
import type { Webhook } from '../types';
import type { WebhookInput, WebhookUpdate } from '../schemas';
import type { WebhookEvent } from '../types';

export class WebhookService extends BaseService<Webhook, WebhookInput, WebhookUpdate, WebhookRepository> {
  protected entityName = 'Webhook';

  constructor() {
    super(webhookRepository);
  }

  async list(): Promise<Webhook[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<Webhook> {
    const webhook = await this.repository.findById(id);
    if (!webhook) throw new NotFoundError('Webhook', id);
    return webhook;
  }

  async create(input: WebhookInput): Promise<Webhook> {
    return this.repository.create(input);
  }

  async update(id: string, input: WebhookUpdate): Promise<Webhook> {
    await this.get(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    await this.get(id);
    return this.repository.delete(id);
  }

  async restore(id: string): Promise<Webhook> {
    return this.repository.restore(id);
  }

  async duplicate(id: string): Promise<Webhook> {
    const original = await this.get(id);
    return this.repository.create({
      name: `${original.name} (cópia)`,
      url: original.url,
      events: original.events as WebhookInput['events'],
      active: false,
    });
  }

  async findByEvent(event: WebhookEvent): Promise<Webhook[]> {
    return this.repository.findByEvent(event);
  }

  async regenerateSecret(id: string): Promise<string> {
    await this.get(id);
    return this.repository.regenerateSecret(id);
  }

  async test(id: string): Promise<boolean> {
    const webhook = await this.get(id);
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'test', data: { message: 'Teste de webhook' } }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const webhookService = new WebhookService();