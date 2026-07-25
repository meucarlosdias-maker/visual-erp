export const QUOTATION_EVENTS = {
  CREATED: 'CREATED',
  EDITED: 'EDITED',
  DUPLICATED: 'DUPLICATED',
  SENT: 'SENT',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type QuotationEventType = (typeof QUOTATION_EVENTS)[keyof typeof QUOTATION_EVENTS];

export const QUOTATION_EVENT_LABELS: Record<QuotationEventType, string> = {
  CREATED: 'Criado',
  EDITED: 'Editado',
  DUPLICATED: 'Duplicado',
  SENT: 'Enviado',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  CANCELLED: 'Cancelado',
};

export interface QuotationEvent {
  id: string;
  quotationId: string;
  quotationNumber: string;
  eventType: QuotationEventType;
  userId: string | null;
  description: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}
