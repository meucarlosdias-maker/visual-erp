import { z } from 'zod/v4';

export const webhookEventEnum = z.enum([
  'client.created',
  'client.updated',
  'lead.created',
  'lead.converted',
  'quote.approved',
  'project.created',
  'workorder.created',
  'production.finished',
  'installation.finished',
  'financial.received',
  'financial.paid',
  'user.created',
]);

export const webhookSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  url: z.string().url('URL inválida'),
  events: z.array(webhookEventEnum).min(1, 'Selecione ao menos um evento'),
  active: z.boolean().default(true),
});

export type WebhookInput = z.infer<typeof webhookSchema>;

export const webhookUpdateSchema = webhookSchema.partial();

export type WebhookUpdate = z.infer<typeof webhookUpdateSchema>;