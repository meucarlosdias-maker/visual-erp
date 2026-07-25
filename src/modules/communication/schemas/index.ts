import { z } from 'zod';

export const CommunicationChannelEnum = z.enum([
  'whatsapp', 'email', 'sms', 'telegram', 'instagram', 'facebook', 'chat', 'push',
]);

export const ConversationStatusEnum = z.enum(['active', 'waiting', 'closed']);

export const MessageDirectionEnum = z.enum(['inbound', 'outbound']);

export const NotificationTypeEnum = z.enum([
  'system', 'approval', 'financial', 'production', 'crm', 'schedule', 'ai',
]);

export const TemplateCategoryEnum = z.enum([
  'commercial', 'financial', 'billing', 'production', 'installation', 'pos_sale', 'support', 'general',
]);

export const ConversationCreateSchema = z.object({
  channel: CommunicationChannelEnum,
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  assignedUserId: z.string().optional(),
  status: ConversationStatusEnum.default('active'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ConversationUpdateSchema = z.object({
  customerName: z.string().optional(),
  assignedUserId: z.string().optional(),
  status: ConversationStatusEnum.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const MessageCreateSchema = z.object({
  conversationId: z.string().min(1, 'Conversa é obrigatória'),
  direction: MessageDirectionEnum,
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  sender: z.string().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
});

export const NotificationCreateSchema = z.object({
  userId: z.string().optional(),
  title: z.string().min(1, 'Título é obrigatório'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
  type: NotificationTypeEnum.default('system'),
  link: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const TemplateCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: TemplateCategoryEnum.default('general'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  variables: z.array(z.string()).optional(),
  active: z.boolean().default(true),
});

export const TemplateUpdateSchema = z.object({
  name: z.string().optional(),
  category: TemplateCategoryEnum.optional(),
  content: z.string().optional(),
  variables: z.array(z.string()).optional(),
  active: z.boolean().optional(),
});

export const InboxFilterSchema = z.object({
  channel: CommunicationChannelEnum.optional(),
  status: ConversationStatusEnum.optional(),
  assignedUserId: z.string().optional(),
  search: z.string().optional(),
});

export type ConversationCreateInput = z.infer<typeof ConversationCreateSchema>;
export type ConversationUpdateInput = z.infer<typeof ConversationUpdateSchema>;
export type MessageCreateInput = z.infer<typeof MessageCreateSchema>;
export type NotificationCreateInput = z.infer<typeof NotificationCreateSchema>;
export type TemplateCreateInput = z.infer<typeof TemplateCreateSchema>;
export type TemplateUpdateInput = z.infer<typeof TemplateUpdateSchema>;
export type InboxFilterInput = z.infer<typeof InboxFilterSchema>;
