import type { AccountsReceivable } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockReceivables: AccountsReceivable[] = [
  {
    id: 'ar-001', companyId: COMPANY_ID, clientId: 'cliente-001',
    projectId: 'proj-001', quotationId: 'orc-001-v1',
    number: 'REC-2026-0001', description: 'Instalação de Lona Oléfina — 1ª parcela',
    issueDate: new Date('2026-02-01'), dueDate: new Date('2026-03-15'),
    paymentDate: new Date('2026-03-10'),
    status: 'PAID', amount: 25000, discount: 0, interest: 0, fine: 0,
    receivedAmount: 25000, paymentMethod: 'PIX', notes: '',
    createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-03-10'), deletedAt: null,
  },
  {
    id: 'ar-002', companyId: COMPANY_ID, clientId: 'cliente-001',
    projectId: 'proj-001', quotationId: 'orc-001-v1',
    number: 'REC-2026-0002', description: 'Instalação de Lona Oléfina — 2ª parcela',
    issueDate: new Date('2026-02-01'), dueDate: new Date('2026-04-15'),
    paymentDate: null,
    status: 'PENDING', amount: 25000, discount: 0, interest: 0, fine: 0,
    receivedAmount: 0, paymentMethod: '', notes: 'Aguardando vencimento',
    createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01'), deletedAt: null,
  },
  {
    id: 'ar-003', companyId: COMPANY_ID, clientId: 'cliente-002',
    projectId: 'proj-002', quotationId: null,
    number: 'REC-2026-0003', description: 'Aplicação de Adesivo Vinílico',
    issueDate: new Date('2026-03-01'), dueDate: new Date('2026-03-30'),
    paymentDate: null,
    status: 'OVERDUE', amount: 8500, discount: 0, interest: 0, fine: 0,
    receivedAmount: 0, paymentMethod: '', notes: 'Cliente em atraso',
    createdAt: new Date('2026-03-01'), updatedAt: new Date('2026-04-01'), deletedAt: null,
  },
];

export class AccountsReceivableRepository {
  async list(_companyId: string): Promise<AccountsReceivable[]> {
    return mockReceivables
      .filter((r) => !r.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getById(id: string): Promise<AccountsReceivable | null> {
    return mockReceivables.find((r) => r.id === id && !r.deletedAt) ?? null;
  }

  async getNextNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const existing = mockReceivables.filter((r) => r.number.startsWith(`REC-${year}`));
    const nums = existing.map((r) => {
      const parts = r.number.split('-');
      return parseInt(parts[parts.length - 1], 10);
    }).filter((n) => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `REC-${year}-${String(nextSeq).padStart(4, '0')}`;
  }

  async create(data: AccountsReceivable): Promise<AccountsReceivable> {
    mockReceivables.push(data);
    return data;
  }

  async update(id: string, data: Partial<AccountsReceivable>): Promise<AccountsReceivable> {
    const idx = mockReceivables.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Conta a receber não encontrada');
    mockReceivables[idx] = { ...mockReceivables[idx], ...data, updatedAt: new Date() };
    return mockReceivables[idx];
  }

  async delete(id: string): Promise<void> {
    const idx = mockReceivables.findIndex((r) => r.id === id);
    if (idx !== -1) mockReceivables.splice(idx, 1);
  }

  async listByStatus(_companyId: string, status: string): Promise<AccountsReceivable[]> {
    return mockReceivables.filter((r) => !r.deletedAt && r.status === status);
  }

  async getTotalPending(_companyId: string): Promise<number> {
    return mockReceivables
      .filter((r) => !r.deletedAt && r.status !== 'PAID' && r.status !== 'CANCELLED')
      .reduce((sum, r) => sum + (r.amount - r.receivedAmount), 0);
  }

  async getTotalOverdue(_companyId: string): Promise<number> {
    return mockReceivables
      .filter((r) => !r.deletedAt && r.status === 'OVERDUE')
      .reduce((sum, r) => sum + (r.amount - r.receivedAmount), 0);
  }

  async getTotalReceived(_companyId: string): Promise<number> {
    return mockReceivables
      .filter((r) => !r.deletedAt && r.status === 'PAID')
      .reduce((sum, r) => sum + r.receivedAmount, 0);
  }
}

export const accountsReceivableRepository = new AccountsReceivableRepository();
