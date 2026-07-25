export { ConversationModuleService, InboxModuleService, NotificationModuleService, TemplateModuleService, CommunicationModuleService } from './services';
export { ConversationRepository, MessageRepository, NotificationRepository, TemplateRepository } from './repository';
export {
  validateConversationCreate, validateConversationUpdate,
  validateMessage, validateNotification,
  validateTemplateCreate, validateTemplateUpdate,
} from './validators';
export {
  ConversationCreateSchema, ConversationUpdateSchema,
  MessageCreateSchema, NotificationCreateSchema,
  TemplateCreateSchema, TemplateUpdateSchema,
  CommunicationChannelEnum, ConversationStatusEnum,
  NotificationTypeEnum, TemplateCategoryEnum,
} from './schemas';
export { InboxConversationItem, InboxSummaryCards, NotificationItem } from './components';
export {
  useInbox, useConversations, useConversation,
  useNotifications, useTemplates, useInboxFilter,
} from './hooks';
export {
  createConversation, closeConversation, sendMessage,
  markNotificationAsRead, markAllNotificationsAsRead, deleteNotification,
  createTemplate, updateTemplate, deleteTemplate,
} from './actions';
export type { ConversationFormData, NotificationFormData, TemplateFormData, MessageFormData, InboxPageData } from './types';
