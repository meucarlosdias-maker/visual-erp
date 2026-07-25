import { z } from 'zod/v4';

export const apiLogSchema = z.object({
  apiKeyId: z.string(),
  endpoint: z.string(),
  method: z.string(),
  statusCode: z.number(),
  responseTime: z.number(),
  ip: z.string().nullable().optional(),
});

export type ApiLogInput = z.infer<typeof apiLogSchema>;