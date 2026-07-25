import { webhookRepository } from '../repository/webhook-repository';
import type { WebhookEvent } from '../types';

interface WebhookLogEntry {
  id: string;
  webhookId: string;
  event: string;
  payload: Record<string, unknown>;
  responseStatus: number | null;
  responseBody: string | null;
  attempts: number;
  executedAt: Date;
}

const webhookLogs: WebhookLogEntry[] = [];

export async function dispatchWebhookEvent(event: WebhookEvent, payload: Record<string, unknown>): Promise<void> {
  const webhooks = await webhookRepository.findByEvent(event);

  for (const webhook of webhooks) {
    const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });
    const crypto = await import('node:crypto');
    const signature = crypto.createHmac('sha256', webhook.secret).update(body).digest('hex');

    let responseStatus: number | null = null;
    let responseBody: string | null = null;

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': webhook.secret,
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event,
        },
        body,
        signal: AbortSignal.timeout(10000),
      });

      responseStatus = response.status;
      responseBody = await response.text();
    } catch (err) {
      responseStatus = 0;
      responseBody = (err as Error).message;
    }

    webhookLogs.push({
      id: crypto.randomUUID(),
      webhookId: webhook.id,
      event,
      payload,
      responseStatus,
      responseBody,
      attempts: 1,
      executedAt: new Date(),
    });
  }
}