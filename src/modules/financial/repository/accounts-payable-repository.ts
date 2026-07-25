import type { AccountsPayable } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockPayables: AccountsPayable[] = [
  {
    id: 'ap-001', companyId: COMPANY_ID, supplierId: 'forn-001',
    projectId: 'proj-001',
    number: 'PAG-2026-0001', description: 'Fornecedor de Lonas — Matéria-prima',
    issueDate: new Date('2026-01-15'), dueDate: new Date('2026-02-15'),
    paymentDate: new Date('2026-02-10'),
    status: 'PAID', amount: 12000, discount: 500, interest: 0, fine: 0,
    paidAmount: 11500, paymentMethod: 'Boleto', notes: '',
    createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-02-10'), deletedAt: null,
  },
  {
    id: 'ap-002', companyId: COMPANY_ID, supplierId: 'forn-002',
    projectId: null,
    number: 'PAG-2026-0002', description: 'Aluguel do galpão',
    issueDate: new Date('2026-07-01'), dueDate: new Date('2026-07-10'),
    paymentDate: null,
    status: 'PENDING', amount: 6000, discount: 0, interest: 0, fine: 0,
    paidAmount: 0, paymentMethod: '', notes: 'Aluguel mensal',
    createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01'), deletedAt: null,
  },
];

export class AccountsPayableRepository {
  async list(_companyId: string): Promise<AccountsPayable[]> {
    return mockPayables
      .filter((p) => !p.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getById(id: string): Promise<AccountsPayable | null> {
    return mockPayables.find((p) => p.id === id && !p.deletedAt) ?? null;
  }

  async getNextNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const existing = mockPayables.filter((p) => p.number.startsWith(`PAG-${year}`));
    const nums = existing.map((p) => {
      const parts = p.number.split('-');
      return parseInt(parts[parts.length - 1], 10);
    }).filter((n) => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `PAG-${year}-${String(nextSeq).padStart(4, '0')}`;
  }

  async create(data: AccountsPayable): Promise<AccountsPayable> {
    mockPayables.push(data);
    return data;
  }

  async update(id: string, data: Partial<AccountsPayable>): Promise<AccountsPayable> {
    const idx = mockPayables.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Conta a pagar não encontrada');
    mockPayables[idx] = { ...mockPayables[idx], ...data, updatedAt: new Date() };
    return mockPayables[idx];
  }

  async delete(id: string): Promise<void> {
    const idx = mockPayables.findIndex((p) => p.id === id);
    if (idx !== -1) mockPayables.splice(idx, 1);
  }

  async listByStatus(_companyId: string, status: string): Promise<AccountsPayable[]> {
    return mockPayables.filter((p) => !p.deletedAt && p.status === status);
  }

  async getTotalPending(_companyId: string): Promise<number> {
    return mockPayables
      .filter((p) => !p.deletedAt && p.status !== 'PAID' && p.status !== 'CANCELLED')
      .reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);
  }

  async getTotalOverdue(_companyId: string): Promise<number> {
    return mockPayables
      .filter((p) => !p.deletedAt && p.status === 'OVERDUE')
      .reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);
  }

  async getTotalPaid(_companyId: string): Promise<number> {
    return mockPayables
      .filter((p) => !p.deletedAt && p.status === 'PAID')
      .reduce((sum, p) => sum + p.paidAmount, 0);
  }
}

export const accountsPayableRepository = new AccountsPayableRepository();
