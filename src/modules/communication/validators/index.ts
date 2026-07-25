import {
  ConversationCreateSchema, ConversationUpdateSchema,
  MessageCreateSchema, NotificationCreateSchema,
  TemplateCreateSchema, TemplateUpdateSchema,
} from '../schemas';
import type {
  ConversationCreateInput, ConversationUpdateInput,
  MessageCreateInput, NotificationCreateInput,
  TemplateCreateInput, TemplateUpdateInput,
} from '../schemas';

export function validateConversationCreate(data: unknown): { success: true; data: ConversationCreateInput } | { success: false; error: string } {
  const result = ConversationCreateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}

export function validateConversationUpdate(data: unknown): { success: true; data: ConversationUpdateInput } | { success: false; error: string } {
  const result = ConversationUpdateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}

export function validateMessage(data: unknown): { success: true; data: MessageCreateInput } | { success: false; error: string } {
  const result = MessageCreateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}

export function validateNotification(data: unknown): { success: true; data: NotificationCreateInput } | { success: false; error: string } {
  const result = NotificationCreateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}

export function validateTemplateCreate(data: unknown): { success: true; data: TemplateCreateInput } | { success: false; error: string } {
  const result = TemplateCreateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}

export function validateTemplateUpdate(data: unknown): { success: true; data: TemplateUpdateInput } | { success: false; error: string } {
  const result = TemplateUpdateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}
