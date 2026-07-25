import type { ConversationRecord, MessageRecord, NotificationRecord, MessageTemplateRecord, CommunicationChannel, ConversationStatus } from '@/core/communication';

interface ConversationRow {
  id: string;
  companyId: string;
  channel: string;
  customerId: string | null;
  customerName: string | null;
  assignedUserId: string | null;
  status: string;
  lastMessageAt: Date | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MessageRow {
  id: string;
  conversationId: string;
  direction: string;
  sender: string | null;
  content: string;
  attachments: { name: string; url: string; type: string }[] | null;
  status: string;
  channel: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

interface NotificationRow {
  id: string;
  companyId: string;
  userId: string | null;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

interface TemplateRow {
  id: string;
  companyId: string;
  name: string;
  category: string;
  content: string;
  variables: string[] | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conversations: ConversationRow[] = [
  { id: 'conv-1', companyId: 'company-1', channel: 'whatsapp', customerId: 'client-1', customerName: 'João Silva', assignedUserId: 'user-1', status: 'active', lastMessageAt: new Date('2026-07-24T10:30:00'), metadata: null, createdAt: new Date('2026-07-20'), updatedAt: new Date('2026-07-24') },
  { id: 'conv-2', companyId: 'company-1', channel: 'email', customerId: 'client-2', customerName: 'Maria Oliveira', assignedUserId: null, status: 'waiting', lastMessageAt: new Date('2026-07-24T09:15:00'), metadata: null, createdAt: new Date('2026-07-19'), updatedAt: new Date('2026-07-24') },
  { id: 'conv-3', companyId: 'company-1', channel: 'chat', customerId: null, customerName: 'Carlos Santos', assignedUserId: 'user-2', status: 'active', lastMessageAt: new Date('2026-07-24T08:45:00'), metadata: null, createdAt: new Date('2026-07-22'), updatedAt: new Date('2026-07-24') },
  { id: 'conv-4', companyId: 'company-1', channel: 'instagram', customerId: 'client-3', customerName: 'Ana Costa', assignedUserId: null, status: 'closed', lastMessageAt: new Date('2026-07-23T18:00:00'), metadata: null, createdAt: new Date('2026-07-18'), updatedAt: new Date('2026-07-23') },
  { id: 'conv-5', companyId: 'company-1', channel: 'whatsapp', customerId: 'client-4', customerName: 'Pedro Almeida', assignedUserId: 'user-1', status: 'active', lastMessageAt: new Date('2026-07-24T11:00:00'), metadata: null, createdAt: new Date('2026-07-24'), updatedAt: new Date('2026-07-24') },
];

const messages: MessageRow[] = [
  { id: 'msg-1', conversationId: 'conv-1', direction: 'inbound', sender: 'João Silva', content: 'Olá, gostaria de saber o status do meu orçamento #123', attachments: null, status: 'read', channel: 'whatsapp', metadata: null, createdAt: new Date('2026-07-24T10:30:00') },
  { id: 'msg-2', conversationId: 'conv-1', direction: 'outbound', sender: 'Suporte', content: 'Olá João! O orçamento #123 está aprovado e já entrou em produção.', attachments: null, status: 'delivered', channel: 'whatsapp', metadata: null, createdAt: new Date('2026-07-24T10:32:00') },
  { id: 'msg-3', conversationId: 'conv-1', direction: 'inbound', sender: 'João Silva', content: 'Ótimo! Qual a previsão de entrega?', attachments: null, status: 'sent', channel: 'whatsapp', metadata: null, createdAt: new Date('2026-07-24T10:35:00') },
  { id: 'msg-4', conversationId: 'conv-2', direction: 'inbound', sender: 'Maria Oliveira', content: 'Bom dia, enviei o comprovante de pagamento por e-mail. Podem confirmar?', attachments: null, status: 'sent', channel: 'email', metadata: null, createdAt: new Date('2026-07-24T09:15:00') },
  { id: 'msg-5', conversationId: 'conv-3', direction: 'inbound', sender: 'Carlos Santos', content: 'Preciso de ajuda com a instalação do banner.', attachments: null, status: 'read', channel: 'chat', metadata: null, createdAt: new Date('2026-07-24T08:45:00') },
  { id: 'msg-6', conversationId: 'conv-3', direction: 'outbound', sender: 'Suporte Técnico', content: 'Claro, Carlos! Vou verificar sua ordem de serviço.', attachments: null, status: 'read', channel: 'chat', metadata: null, createdAt: new Date('2026-07-24T08:50:00') },
  { id: 'msg-7', conversationId: 'conv-5', direction: 'inbound', sender: 'Pedro Almeida', content: 'Qual o prazo para um novo pedido de adesivos?', attachments: null, status: 'sent', channel: 'whatsapp', metadata: null, createdAt: new Date('2026-07-24T11:00:00') },
];

const notifications: NotificationRow[] = [
  { id: 'notif-1', companyId: 'company-1', userId: 'user-1', title: 'Novo orçamento aprovado', message: 'O orçamento #123 foi aprovado pelo cliente João Silva.', type: 'financial', read: false, link: '/app/orcamentos/123', metadata: null, createdAt: new Date('2026-07-24T10:00:00') },
  { id: 'notif-2', companyId: 'company-1', userId: 'user-1', title: 'Ordem de produção concluída', message: 'A OP #456 foi concluída e está aguardando instalação.', type: 'production', read: false, link: '/app/producao/456', metadata: null, createdAt: new Date('2026-07-24T09:30:00') },
  { id: 'notif-3', companyId: 'company-1', userId: 'user-2', title: 'Nova mensagem no chat', message: 'Carlos Santos enviou uma mensagem no chat interno.', type: 'system', read: true, link: '/app/comunicacao/conversas/conv-3', metadata: null, createdAt: new Date('2026-07-24T08:45:00') },
  { id: 'notif-4', companyId: 'company-1', userId: 'user-1', title: ' agendamento de instalação', message: 'Instalação para o cliente Pedro Almeida agendada para 26/07.', type: 'schedule', read: false, link: '/app/instalacoes/agenda', metadata: null, createdAt: new Date('2026-07-23T16:00:00') },
  { id: 'notif-5', companyId: 'company-1', userId: null, title: 'Relatório semanal disponível', message: 'O relatório de indicadores da semana está disponível.', type: 'system', read: false, link: '/app/analytics', metadata: null, createdAt: new Date('2026-07-23T08:00:00') },
];

const templates: TemplateRow[] = [
  { id: 'tpl-1', companyId: 'company-1', name: 'Orçamento Aprovado', category: 'commercial', content: 'Olá {{cliente}}, seu orçamento #{{projeto}} foi aprovado! O valor total é de R$ {{valor}}. Entraremos em contato para agendar a produção.', variables: ['{{cliente}}', '{{projeto}}', '{{valor}}'], active: true, createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01') },
  { id: 'tpl-2', companyId: 'company-1', name: 'Lembrete de Pagamento', category: 'financial', content: 'Olá {{cliente}}, lembramos que o pagamento do projeto {{projeto}} vence em {{vencimento}}. Valor: R$ {{valor}}.', variables: ['{{cliente}}', '{{projeto}}', '{{valor}}', '{{vencimento}}'], active: true, createdAt: new Date('2026-07-05'), updatedAt: new Date('2026-07-05') },
  { id: 'tpl-3', companyId: 'company-1', name: 'Produção Iniciada', category: 'production', content: '{{cliente}}, a produção do seu pedido {{projeto}} foi iniciada. Previsão de conclusão: {{previsao}}.', variables: ['{{cliente}}', '{{projeto}}', '{{previsao}}'], active: true, createdAt: new Date('2026-07-10'), updatedAt: new Date('2026-07-10') },
  { id: 'tpl-4', companyId: 'company-1', name: 'Instalação Agendada', category: 'installation', content: '{{cliente}}, a instalação do projeto {{projeto}} foi agendada para {{data}}. Nossa equipe estará presente no horário combinado.', variables: ['{{cliente}}', '{{projeto}}', '{{data}}'], active: true, createdAt: new Date('2026-07-15'), updatedAt: new Date('2026-07-15') },
  { id: 'tpl-5', companyId: 'company-1', name: 'Pesquisa de Satisfação', category: 'pos_sale', content: 'Olá {{cliente}}, gostaríamos de saber como foi sua experiência com o projeto {{projeto}}. Sua opinião é muito importante!', variables: ['{{cliente}}', '{{projeto}}'], active: true, createdAt: new Date('2026-07-18'), updatedAt: new Date('2026-07-18') },
  { id: 'tpl-6', companyId: 'company-1', name: 'Cobrança - Boleto Vencido', category: 'billing', content: '{{cliente}}, o boleto referente ao projeto {{projeto}} no valor de R$ {{valor}} venceu em {{vencimento}}. Regularize para evitar juros.', variables: ['{{cliente}}', '{{projeto}}', '{{valor}}', '{{vencimento}}'], active: true, createdAt: new Date('2026-07-20'), updatedAt: new Date('2026-07-20') },
];

function toConversationRecord(row: ConversationRow): ConversationRecord {
  return {
    ...row,
    channel: row.channel as CommunicationChannel,
    status: row.status as ConversationStatus,
  };
}

function toMessageRecord(row: MessageRow): MessageRecord {
  return {
    ...row,
    direction: row.direction as MessageRecord['direction'],
    status: row.status as MessageRecord['status'],
  };
}

function toNotificationRecord(row: NotificationRow): NotificationRecord {
  return {
    ...row,
    type: row.type as NotificationRecord['type'],
  };
}

function toTemplateRecord(row: TemplateRow): MessageTemplateRecord {
  return {
    ...row,
    category: row.category as MessageTemplateRecord['category'],
  };
}

export const ConversationRepository = {
  async findAll(companyId: string): Promise<ConversationRecord[]> {
    return conversations.filter((c) => c.companyId === companyId).map(toConversationRecord);
  },

  async findById(id: string): Promise<ConversationRecord | null> {
    const row = conversations.find((c) => c.id === id);
    return row ? toConversationRecord(row) : null;
  },

  async create(data: Omit<ConversationRecord, 'createdAt' | 'updatedAt'>): Promise<ConversationRecord> {
    const row: ConversationRow = {
      id: data.id,
      companyId: data.companyId,
      channel: data.channel,
      customerId: data.customerId,
      customerName: data.customerName,
      assignedUserId: data.assignedUserId,
      status: data.status,
      lastMessageAt: data.lastMessageAt,
      metadata: data.metadata as Record<string, unknown> | null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    conversations.push(row);
    return toConversationRecord(row);
  },

  async update(id: string, data: Partial<ConversationRecord>): Promise<ConversationRecord | null> {
    const index = conversations.findIndex((c) => c.id === id);
    if (index === -1) return null;
    conversations[index] = {
      ...conversations[index],
      ...data,
      channel: data.channel ?? conversations[index].channel,
      status: data.status ?? conversations[index].status,
      metadata: data.metadata !== undefined ? (data.metadata as Record<string, unknown> | null) : conversations[index].metadata,
      updatedAt: new Date(),
    };
    return toConversationRecord(conversations[index]);
  },

  async delete(id: string): Promise<boolean> {
    const index = conversations.findIndex((c) => c.id === id);
    if (index === -1) return false;
    conversations.splice(index, 1);
    return true;
  },
};

export const MessageRepository = {
  async findByConversation(conversationId: string): Promise<MessageRecord[]> {
    return messages.filter((m) => m.conversationId === conversationId).map(toMessageRecord)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async create(data: Omit<MessageRecord, 'id' | 'createdAt'>): Promise<MessageRecord> {
    const row: MessageRow = {
      id: `msg-${Date.now()}`,
      conversationId: data.conversationId,
      direction: data.direction,
      sender: data.sender,
      content: data.content,
      attachments: data.attachments,
      status: data.status,
      channel: data.channel,
      metadata: data.metadata as Record<string, unknown> | null,
      createdAt: new Date(),
    };
    messages.push(row);
    return toMessageRecord(row);
  },
};

export const NotificationRepository = {
  async findAll(companyId: string): Promise<NotificationRecord[]> {
    const result = notifications.filter((n) => n.companyId === companyId).map(toNotificationRecord);
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return result;
  },

  async findById(id: string): Promise<NotificationRecord | null> {
    const row = notifications.find((n) => n.id === id);
    return row ? toNotificationRecord(row) : null;
  },

  async create(data: Omit<NotificationRecord, 'id' | 'createdAt'>): Promise<NotificationRecord> {
    const row: NotificationRow = {
      id: `notif-${Date.now()}`,
      companyId: data.companyId,
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      read: data.read,
      link: data.link,
      metadata: data.metadata as Record<string, unknown> | null,
      createdAt: new Date(),
    };
    notifications.push(row);
    return toNotificationRecord(row);
  },

  async markAsRead(id: string): Promise<NotificationRecord | null> {
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return null;
    notifications[index].read = true;
    return toNotificationRecord(notifications[index]);
  },

  async markAllAsRead(companyId: string, userId: string): Promise<number> {
    let count = 0;
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].companyId === companyId && (notifications[i].userId === userId || !notifications[i].userId) && !notifications[i].read) {
        notifications[i].read = true;
        count++;
      }
    }
    return count;
  },

  async delete(id: string): Promise<boolean> {
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return false;
    notifications.splice(index, 1);
    return true;
  },

  async countUnread(companyId: string, userId: string): Promise<number> {
    return notifications.filter((n) => n.companyId === companyId && (n.userId === userId || !n.userId) && !n.read).length;
  },
};

export const TemplateRepository = {
  async findAll(companyId: string): Promise<MessageTemplateRecord[]> {
    return templates.filter((t) => t.companyId === companyId).map(toTemplateRecord);
  },

  async findById(id: string): Promise<MessageTemplateRecord | null> {
    const row = templates.find((t) => t.id === id);
    return row ? toTemplateRecord(row) : null;
  },

  async create(data: Omit<MessageTemplateRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MessageTemplateRecord> {
    const row: TemplateRow = {
      id: `tpl-${Date.now()}`,
      companyId: data.companyId,
      name: data.name,
      category: data.category,
      content: data.content,
      variables: data.variables,
      active: data.active,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    templates.push(row);
    return toTemplateRecord(row);
  },

  async update(id: string, data: Partial<MessageTemplateRecord>): Promise<MessageTemplateRecord | null> {
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return null;
    templates[index] = {
      ...templates[index],
      ...data,
      category: data.category ?? templates[index].category,
      variables: data.variables !== undefined ? data.variables : templates[index].variables,
      updatedAt: new Date(),
    };
    return toTemplateRecord(templates[index]);
  },

  async delete(id: string): Promise<boolean> {
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return false;
    templates.splice(index, 1);
    return true;
  },
};
