export interface ApiKey {
  id: string;
  companyId: string;
  name: string;
  key: string;
  secret: string;
  permissions: string[];
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface Webhook {
  id: string;
  companyId: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  payload: Record<string, unknown>;
  responseStatus: number | null;
  responseBody: string | null;
  attempts: number;
  executedAt: Date;
}

export interface ApiLog {
  id: string;
  apiKeyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  ip: string | null;
  createdAt: Date;
}

export type WebhookEvent =
  | 'client.created'
  | 'client.updated'
  | 'lead.created'
  | 'lead.converted'
  | 'quote.approved'
  | 'project.created'
  | 'workorder.created'
  | 'production.finished'
  | 'installation.finished'
  | 'financial.received'
  | 'financial.paid'
  | 'user.created';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  errors?: Record<string, string>;
}