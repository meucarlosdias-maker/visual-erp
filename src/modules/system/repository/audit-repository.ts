import type { AuditLog } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockAuditLogs: AuditLog[] = [
  { id: 'aud-001', companyId: COMPANY_ID, userId: 'u-000001', userName: 'Administrador', entityName: 'Empresa', entityId: '00000000-0000-0000-0000-000000000000', action: 'Editar', module: 'configuracoes', oldData: { nome: 'Antiga' }, newData: { nome: 'Visual ERP' }, ip: '191.123.45.67', browser: 'Chrome', operatingSystem: 'Windows', userAgent: '', executionTime: 45, createdAt: new Date(Date.now() - 300000) },
  { id: 'aud-002', companyId: COMPANY_ID, userId: 'u-000001', userName: 'Administrador', entityName: 'Usuário', entityId: 'u-000002', action: 'Criar', module: 'administracao', oldData: null, newData: { nome: 'Carlos', email: 'carlos@email.com' }, ip: '191.123.45.67', browser: 'Chrome', operatingSystem: 'Windows', userAgent: '', executionTime: 120, createdAt: new Date(Date.now() - 1800000) },
  { id: 'aud-003', companyId: COMPANY_ID, userId: 'u-000002', userName: 'Carlos', entityName: 'OS #00123', entityId: 'wo-003', action: 'Alterar Status', module: 'producao', oldData: { status: 'Aberta' }, newData: { status: 'Em Produção' }, ip: '191.234.56.78', browser: 'Firefox', operatingSystem: 'Windows', userAgent: '', executionTime: 67, createdAt: new Date(Date.now() - 3600000) },
  { id: 'aud-004', companyId: COMPANY_ID, userId: 'u-000001', userName: 'Administrador', entityName: 'Orçamento #0099', entityId: 'orc-002', action: 'Excluir', module: 'crm', oldData: { total: 8500 }, newData: null, ip: '191.123.45.67', browser: 'Chrome', operatingSystem: 'Windows', userAgent: '', executionTime: 89, createdAt: new Date(Date.now() - 7200000) },
  { id: 'aud-005', companyId: COMPANY_ID, userId: 'u-000003', userName: 'Ana', entityName: 'Conta #005', entityId: 'ap-001', action: 'Cadastrar', module: 'financeiro', oldData: null, newData: { descricao: 'Pagamento Fornecedor' }, ip: '191.345.67.89', browser: 'Edge', operatingSystem: 'Windows', userAgent: '', executionTime: 34, createdAt: new Date(Date.now() - 14400000) },
  { id: 'aud-006', companyId: COMPANY_ID, userId: 'u-000001', userName: 'Administrador', entityName: 'Papel', entityId: 'role-004', action: 'Atualizar', module: 'administracao', oldData: { nome: 'Operador' }, newData: { nome: 'Operador Sênior' }, ip: '191.123.45.67', browser: 'Chrome', operatingSystem: 'Windows', userAgent: '', executionTime: 52, createdAt: new Date(Date.now() - 28800000) },
  { id: 'aud-007', companyId: COMPANY_ID, userId: 'u-000002', userName: 'Carlos', entityName: 'Lead #450', entityId: 'lead-001', action: 'Aprovar', module: 'crm', oldData: { status: 'Em Análise' }, newData: { status: 'Aprovado' }, ip: '191.234.56.78', browser: 'Firefox', operatingSystem: 'Windows', userAgent: '', executionTime: 23, createdAt: new Date(Date.now() - 43200000) },
  { id: 'aud-008', companyId: COMPANY_ID, userId: 'u-000001', userName: 'Administrador', entityName: 'Sessão', entityId: 'sess-005', action: 'Encerrar', module: 'administracao', oldData: { active: true }, newData: { active: false }, ip: '191.123.45.67', browser: 'Chrome', operatingSystem: 'Windows', userAgent: '', executionTime: 15, createdAt: new Date(Date.now() - 86400000) },
];

export class AuditRepository {
  async list(companyId: string): Promise<AuditLog[]> {
    return [...mockAuditLogs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getById(id: string): Promise<AuditLog | null> {
    return mockAuditLogs.find((l) => l.id === id) ?? null;
  }

  async create(data: AuditLog): Promise<AuditLog> {
    mockAuditLogs.unshift(data);
    return data;
  }
}

export const auditRepository = new AuditRepository();
