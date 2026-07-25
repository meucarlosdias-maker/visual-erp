import type { AuditAction, ComplianceFramework } from '@/core/security';

export interface AuditEvent {
  id: string;
  companyId: string;
  userId: string | null;
  entity: string;
  entityId: string | null;
  action: AuditAction;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ip: string | null;
  userAgent: string | null;
  sessionId: string | null;
  createdAt: Date;
}

export interface AccessLog {
  id: string;
  companyId: string;
  userId: string | null;
  action: string;
  resource: string;
  status: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface SecurityPolicy {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  rules: { type: string; effect: string; conditions: Record<string, unknown>; priority: number }[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataRetentionPolicy {
  id: string;
  companyId: string;
  entity: string;
  retentionDays: number;
  archiveAfter: number | null;
  deleteAfter: number | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceStatus {
  framework: ComplianceFramework;
  status: string;
  score: number;
  checks: { rule: string; status: string; description: string }[];
}

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  CREATE: 'Criação',
  UPDATE: 'Alteração',
  DELETE: 'Exclusão',
  PERMISSION_CHANGE: 'Alteração de Permissão',
  PASSWORD_CHANGE: 'Troca de Senha',
  EXPORT: 'Exportação',
  IMPORT: 'Importação',
  UPLOAD: 'Upload',
  WORKFLOW_EXECUTE: 'Execução de Workflow',
  AI_EXECUTE: 'Execução de IA',
  FINANCIAL_CHANGE: 'Alteração Financeira',
};

export const ENTITY_LABELS: Record<string, string> = {
  audit: 'Auditoria',
  logs: 'Logs',
  policies: 'Políticas',
  retention: 'Retenção',
  compliance: 'Compliance',
};

export const COMPLIANCE_FRAMEWORK_LABELS: Record<ComplianceFramework, string> = {
  LGPD: 'LGPD',
  ISO_27001: 'ISO 27001',
  SOC_2: 'SOC 2',
  OWASP: 'OWASP',
};
