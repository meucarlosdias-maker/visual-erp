import { z } from 'zod/v4';

export const apiKeySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  permissions: z.array(z.string()).min(1, 'Selecione ao menos uma permissão'),
  expiresAt: z.date().nullable().optional(),
  active: z.boolean().default(true),
});

export type ApiKeyInput = z.infer<typeof apiKeySchema>;

export const apiKeyUpdateSchema = apiKeySchema.partial();

export type ApiKeyUpdate = z.infer<typeof apiKeyUpdateSchema>;