import type { FinancialAccount } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockAccounts: FinancialAccount[] = [
  {
    id: 'fa-001', companyId: COMPANY_ID, name: 'Conta Principal',
    bank: 'Banco do Brasil', agency: '0001', account: '12345-6',
    type: 'CHECKING', initialBalance: 50000, currentBalance: 82350,
    active: true,
    createdAt: new Date('2025-01-01'), updatedAt: new Date('2026-07-22'), deletedAt: null,
  },
  {
    id: 'fa-002', companyId: COMPANY_ID, name: 'Caixa',
    bank: '', agency: '', account: '',
    type: 'CASH', initialBalance: 5000, currentBalance: 3200,
    active: true,
    createdAt: new Date('2025-01-01'), updatedAt: new Date('2026-07-22'), deletedAt: null,
  },
];

export class FinancialAccountRepository {
  async list(_companyId: string): Promise<FinancialAccount[]> {
    return mockAccounts.filter((a) => a.active && !a.deletedAt);
  }

  async getById(id: string): Promise<FinancialAccount | null> {
    return mockAccounts.find((a) => a.id === id && !a.deletedAt) ?? null;
  }

  async create(data: FinancialAccount): Promise<FinancialAccount> {
    mockAccounts.push(data);
    return data;
  }

  async getNextNumber(): Promise<string> {
    const nums = mockAccounts.map((a) => {
      const parts = a.name.match(/\d+$/);
      return parts ? parseInt(parts[0], 10) : 0;
    }).filter((n) => !isNaN(n));
    return String(nums.length > 0 ? Math.max(...nums) + 1 : 1);
  }

  async update(id: string, data: Partial<FinancialAccount>): Promise<FinancialAccount> {
    const idx = mockAccounts.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Conta não encontrada');
    mockAccounts[idx] = { ...mockAccounts[idx], ...data, updatedAt: new Date() };
    return mockAccounts[idx];
  }

  async getTotalBalance(_companyId: string): Promise<number> {
    return mockAccounts
      .filter((a) => a.active && !a.deletedAt)
      .reduce((sum, a) => sum + a.currentBalance, 0);
  }
}

export const financialAccountRepository = new FinancialAccountRepository();
