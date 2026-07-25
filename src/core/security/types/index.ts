export type AuditAction =
  | 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE'
  | 'PERMISSION_CHANGE' | 'PASSWORD_CHANGE' | 'EXPORT' | 'IMPORT'
  | 'UPLOAD' | 'WORKFLOW_EXECUTE' | 'AI_EXECUTE'
  | 'FINANCIAL_CHANGE';

export type ComplianceFramework = 'LGPD' | 'ISO_27001' | 'SOC_2' | 'OWASP';

export type PolicyRuleType = 'password' | 'session' | 'access' | 'encryption' | 'audit';

export type PolicyEffect = 'allow' | 'deny';

export interface PolicyRule {
  type: PolicyRuleType;
  effect: PolicyEffect;
  conditions: Record<string, unknown>;
  priority: number;
}

export interface SecurityPolicyDefinition {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  rules: PolicyRule[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditEntry {
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

export interface AccessLogEntry {
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

export interface RetentionPolicyDefinition {
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

export interface ComplianceCheck {
  framework: ComplianceFramework;
  status: 'compliant' | 'partial' | 'non_compliant';
  score: number;
  checks: ComplianceCheckItem[];
}

export interface ComplianceCheckItem {
  rule: string;
  status: 'passed' | 'failed' | 'warning';
  description: string;
}

export interface GovernanceApproval {
  id: string;
  companyId: string;
  requestorId: string;
  changeType: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}
