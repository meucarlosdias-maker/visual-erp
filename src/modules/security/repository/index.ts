import type { AuditEvent, AccessLog, SecurityPolicy, DataRetentionPolicy } from '../types';
import type { AuditInput, PolicyInput, PolicyUpdate, RetentionInput, RetentionUpdate } from '../schemas';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockAuditEvents: AuditEvent[] = [
  { id: 'aud-001', companyId: COMPANY_ID, userId: 'usr-001', entity: 'User', entityId: 'usr-001', action: 'LOGIN', oldValues: null, newValues: null, ip: '192.168.1.100', userAgent: 'Mozilla/5.0', sessionId: 'sess-001', createdAt: new Date('2026-07-20T08:00:00') },
  { id: 'aud-002', companyId: COMPANY_ID, userId: 'usr-002', entity: 'Client', entityId: 'cli-123', action: 'CREATE', oldValues: null, newValues: { name: 'Empresa ABC', email: 'contato@abc.com' }, ip: '192.168.1.101', userAgent: 'Mozilla/5.0', sessionId: 'sess-002', createdAt: new Date('2026-07-20T09:30:00') },
  { id: 'aud-003', companyId: COMPANY_ID, userId: 'usr-001', entity: 'Quote', entityId: 'orc-1024', action: 'UPDATE', oldValues: { status: 'pending' }, newValues: { status: 'approved' }, ip: '192.168.1.100', userAgent: 'Mozilla/5.0', sessionId: 'sess-001', createdAt: new Date('2026-07-20T10:00:00') },
  { id: 'aud-004', companyId: COMPANY_ID, userId: 'usr-003', entity: 'Permission', entityId: 'role-admin', action: 'PERMISSION_CHANGE', oldValues: { permissions: ['user.view'] }, newValues: { permissions: ['user.view', 'user.edit'] }, ip: '192.168.1.102', userAgent: 'Mozilla/5.0', sessionId: 'sess-003', createdAt: new Date('2026-07-20T11:00:00') },
  { id: 'aud-005', companyId: COMPANY_ID, userId: 'usr-001', entity: 'User', entityId: 'usr-001', action: 'PASSWORD_CHANGE', oldValues: null, newValues: null, ip: '192.168.1.100', userAgent: 'Mozilla/5.0', sessionId: 'sess-001', createdAt: new Date('2026-07-20T12:00:00') },
  { id: 'aud-006', companyId: COMPANY_ID, userId: 'usr-002', entity: 'Financial', entityId: 'fin-456', action: 'FINANCIAL_CHANGE', oldValues: { status: 'pending' }, newValues: { status: 'paid' }, ip: '192.168.1.101', userAgent: 'Mozilla/5.0', sessionId: 'sess-002', createdAt: new Date('2026-07-20T14:00:00') },
  { id: 'aud-007', companyId: COMPANY_ID, userId: 'usr-001', entity: 'Workflow', entityId: 'wf-001', action: 'WORKFLOW_EXECUTE', oldValues: null, newValues: { status: 'completed' }, ip: '192.168.1.100', userAgent: 'Mozilla/5.0', sessionId: 'sess-002', createdAt: new Date('2026-07-20T15:00:00') },
];

const mockAccessLogs: AccessLog[] = [
  { id: 'log-001', companyId: COMPANY_ID, userId: 'usr-001', action: 'READ', resource: '/api/users', status: 'success', ip: '192.168.1.100', userAgent: 'Mozilla/5.0', createdAt: new Date('2026-07-20T08:00:00') },
  { id: 'log-002', companyId: COMPANY_ID, userId: 'usr-002', action: 'CREATE', resource: '/api/clients', status: 'success', ip: '192.168.1.101', userAgent: 'Mozilla/5.0', createdAt: new Date('2026-07-20T09:30:00') },
  { id: 'log-003', companyId: COMPANY_ID, userId: null, action: 'LOGIN', resource: '/auth/login', status: 'failed', ip: '10.0.0.50', userAgent: 'curl/7.68', createdAt: new Date('2026-07-20T10:15:00') },
  { id: 'log-004', companyId: COMPANY_ID, userId: 'usr-003', action: 'UPDATE', resource: '/api/permissions', status: 'success', ip: '192.168.1.102', userAgent: 'Mozilla/5.0', createdAt: new Date('2026-07-20T11:00:00') },
  { id: 'log-005', companyId: COMPANY_ID, userId: 'usr-001', action: 'EXPORT', resource: '/api/financial/report', status: 'success', ip: '192.168.1.100', userAgent: 'Mozilla/5.0', createdAt: new Date('2026-07-20T14:00:00') },
];

const mockPolicies: SecurityPolicy[] = [
  { id: 'pol-001', companyId: COMPANY_ID, name: 'Política de Senhas', description: 'Requisitos de complexidade de senhas', rules: [{ type: 'password', effect: 'deny', conditions: { minLength: 8, requireSpecialChar: true }, priority: 1 }], active: true, createdAt: new Date('2026-07-01T00:00:00'), updatedAt: new Date('2026-07-01T00:00:00') },
  { id: 'pol-002', companyId: COMPANY_ID, name: 'Política de Sessão', description: 'Controle de tempo de sessão', rules: [{ type: 'session', effect: 'deny', conditions: { maxDuration: 3600, maxInactive: 1800 }, priority: 1 }], active: true, createdAt: new Date('2026-07-01T00:00:00'), updatedAt: new Date('2026-07-01T00:00:00') },
  { id: 'pol-003', companyId: COMPANY_ID, name: 'Controle de Acesso API', description: 'Restrições para acesso à API', rules: [{ type: 'access', effect: 'allow', conditions: { path: '/api/public' }, priority: 1 }, { type: 'access', effect: 'deny', conditions: { path: '/api/admin', role: 'VIEWER' }, priority: 2 }], active: true, createdAt: new Date('2026-07-05T00:00:00'), updatedAt: new Date('2026-07-05T00:00:00') },
];

const mockRetentionPolicies: DataRetentionPolicy[] = [
  { id: 'ret-001', companyId: COMPANY_ID, entity: 'audit', retentionDays: 365, archiveAfter: 90, deleteAfter: 365, active: true, createdAt: new Date('2026-07-01T00:00:00'), updatedAt: new Date('2026-07-01T00:00:00') },
  { id: 'ret-002', companyId: COMPANY_ID, entity: 'logs', retentionDays: 90, archiveAfter: 30, deleteAfter: 90, active: true, createdAt: new Date('2026-07-01T00:00:00'), updatedAt: new Date('2026-07-01T00:00:00') },
  { id: 'ret-003', companyId: COMPANY_ID, entity: 'conversations', retentionDays: 180, archiveAfter: null, deleteAfter: 180, active: false, createdAt: new Date('2026-07-01T00:00:00'), updatedAt: new Date('2026-07-05T00:00:00') },
  { id: 'ret-004', companyId: COMPANY_ID, entity: 'jobs', retentionDays: 30, archiveAfter: null, deleteAfter: 30, active: true, createdAt: new Date('2026-07-01T00:00:00'), updatedAt: new Date('2026-07-01T00:00:00') },
];

function toAudit(row: typeof mockAuditEvents[0]): AuditEvent { return { ...row }; }
function toLog(row: typeof mockAccessLogs[0]): AccessLog { return { ...row }; }
function toPolicy(row: typeof mockPolicies[0]): SecurityPolicy { return { ...row }; }
function toRetention(row: typeof mockRetentionPolicies[0]): DataRetentionPolicy { return { ...row }; }

export class SecurityRepository {
  async findAllAuditEvents(): Promise<AuditEvent[]> { return mockAuditEvents.map(toAudit); }
  async findAuditById(id: string): Promise<AuditEvent | null> { return mockAuditEvents.find((e) => e.id === id) ?? null; }
  async createAudit(input: AuditInput): Promise<AuditEvent> {
    const entry: AuditEvent = {
      id: crypto.randomUUID(), companyId: COMPANY_ID,
      userId: input.userId ?? null, entity: input.entity,
      entityId: input.entityId ?? null, action: input.action as AuditEvent['action'],
      oldValues: (input.oldValues as Record<string, unknown>) ?? null,
      newValues: (input.newValues as Record<string, unknown>) ?? null,
      ip: input.ip ?? null, userAgent: input.userAgent ?? null,
      sessionId: input.sessionId ?? null, createdAt: new Date(),
    };
    mockAuditEvents.push(entry);
    return entry;
  }

  async findAllAccessLogs(): Promise<AccessLog[]> { return mockAccessLogs.map(toLog); }
  async createAccessLog(input: { userId?: string | null; action: string; resource: string; status: string; ip?: string | null; userAgent?: string | null }): Promise<AccessLog> {
    const entry: AccessLog = {
      id: crypto.randomUUID(), companyId: COMPANY_ID,
      userId: input.userId ?? null, action: input.action,
      resource: input.resource, status: input.status,
      ip: input.ip ?? null, userAgent: input.userAgent ?? null,
      createdAt: new Date(),
    };
    mockAccessLogs.push(entry);
    return entry;
  }

  async findAllPolicies(): Promise<SecurityPolicy[]> { return mockPolicies.map(toPolicy); }
  async findPolicyById(id: string): Promise<SecurityPolicy | null> { return mockPolicies.find((p) => p.id === id) ?? null; }
  async createPolicy(input: PolicyInput): Promise<SecurityPolicy> {
    const entry: SecurityPolicy = {
      id: crypto.randomUUID(), companyId: COMPANY_ID,
      name: input.name, description: input.description ?? null,
      rules: input.rules as SecurityPolicy['rules'], active: input.active,
      createdAt: new Date(), updatedAt: new Date(),
    };
    mockPolicies.push(entry);
    return entry;
  }
  async updatePolicy(id: string, input: PolicyUpdate): Promise<SecurityPolicy> {
    const idx = mockPolicies.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Política não encontrada');
    mockPolicies[idx] = { ...mockPolicies[idx], ...input, updatedAt: new Date() } as SecurityPolicy;
    return mockPolicies[idx];
  }
  async deletePolicy(id: string): Promise<boolean> {
    const idx = mockPolicies.findIndex((p) => p.id === id);
    if (idx !== -1) { mockPolicies.splice(idx, 1); return true; }
    return false;
  }

  async findAllRetentionPolicies(): Promise<DataRetentionPolicy[]> { return mockRetentionPolicies.map(toRetention); }
  async findRetentionById(id: string): Promise<DataRetentionPolicy | null> { return mockRetentionPolicies.find((r) => r.id === id) ?? null; }
  async createRetentionPolicy(input: RetentionInput): Promise<DataRetentionPolicy> {
    const entry: DataRetentionPolicy = {
      id: crypto.randomUUID(), companyId: COMPANY_ID,
      entity: input.entity, retentionDays: input.retentionDays,
      archiveAfter: input.archiveAfter ?? null,
      deleteAfter: input.deleteAfter ?? null,
      active: input.active, createdAt: new Date(), updatedAt: new Date(),
    };
    mockRetentionPolicies.push(entry);
    return entry;
  }
  async updateRetentionPolicy(id: string, input: RetentionUpdate): Promise<DataRetentionPolicy> {
    const idx = mockRetentionPolicies.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Política de retenção não encontrada');
    mockRetentionPolicies[idx] = { ...mockRetentionPolicies[idx], ...input, updatedAt: new Date() } as DataRetentionPolicy;
    return mockRetentionPolicies[idx];
  }
  async deleteRetentionPolicy(id: string): Promise<boolean> {
    const idx = mockRetentionPolicies.findIndex((r) => r.id === id);
    if (idx !== -1) { mockRetentionPolicies.splice(idx, 1); return true; }
    return false;
  }
}
