import { z } from 'zod/v4';

const unknownRecord = z.object({}).passthrough();

export const providerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  provider: z.enum(['openai', 'anthropic', 'gemini', 'azure', 'openrouter']),
  model: z.string().min(1, 'Modelo é obrigatório'),
  apiKey: z.string().min(1, 'API Key é obrigatória'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().min(1).default(2048),
  active: z.boolean().default(true),
});

export type ProviderInput = z.infer<typeof providerSchema>;

export const providerUpdateSchema = providerSchema.partial();

export type ProviderUpdate = z.infer<typeof providerUpdateSchema>;

export const promptSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  module: z.string().min(1, 'Módulo é obrigatório'),
  prompt: z.string().min(1, 'Prompt é obrigatório'),
  systemPrompt: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export type PromptInput = z.infer<typeof promptSchema>;

export const promptUpdateSchema = promptSchema.partial();

export type PromptUpdate = z.infer<typeof promptUpdateSchema>;

export const conversationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  module: z.string().nullable().optional(),
  userId: z.string().nullable().optional(),
});

export type ConversationInput = z.infer<typeof conversationSchema>;

export const messageSchema = z.object({
  conversationId: z.string(),
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  tokens: z.number().int().nullable().optional(),
});

export type MessageInput = z.infer<typeof messageSchema>;

export const executionSchema = z.object({
  conversationId: z.string().nullable().optional(),
  provider: z.string(),
  model: z.string(),
  tokensInput: z.number().int().default(0),
  tokensOutput: z.number().int().default(0),
  cost: z.number().default(0),
  duration: z.number().int().default(0),
  status: z.string().default('completed'),
});

export type ExecutionInput = z.infer<typeof executionSchema>;
