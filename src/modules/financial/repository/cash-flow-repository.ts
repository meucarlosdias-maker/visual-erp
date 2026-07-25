import type { CashFlow } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockCashFlow: CashFlow[] = [
  {
    id: 'cf-001', companyId: COMPANY_ID,
    date: new Date('2026-07-22'), type: 'INCOME',
    description: 'Recebimento REC-2026-0001', origin: 'Contas a Receber',
    referenceId: 'ar-001', amount: 25000, balanceAfter: 82350,
    createdAt: new Date('2026-07-22'),
  },
  {
    id: 'cf-002', companyId: COMPANY_ID,
    date: new Date('2026-07-20'), type: 'EXPENSE',
    description: 'Pagamento PAG-2026-0001', origin: 'Contas a Pagar',
    referenceId: 'ap-001', amount: -11500, balanceAfter: 57350,
    createdAt: new Date('2026-07-20'),
  },
  {
    id: 'cf-003', companyId: COMPANY_ID,
    date: new Date('2026-07-15'), type: 'INCOME',
    description: 'Venda avulsa', origin: 'Avulso',
    referenceId: null, amount: 3500, balanceAfter: 68850,
    createdAt: new Date('2026-07-15'),
  },
];

export class CashFlowRepository {
  async list(_companyId: string): Promise<CashFlow[]> {
    return [...mockCashFlow].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getById(id: string): Promise<CashFlow | null> {
    return mockCashFlow.find((c) => c.id === id) ?? null;
  }

  async create(data: CashFlow): Promise<CashFlow> {
    mockCashFlow.push(data);
    return data;
  }

  async findByReference(referenceId: string, type: 'INCOME' | 'EXPENSE'): Promise<CashFlow | null> {
    return mockCashFlow.find((c) => c.referenceId === referenceId && c.type === type) ?? null;
  }

  async listByDateRange(_companyId: string, start: Date, end: Date): Promise<CashFlow[]> {
    return mockCashFlow.filter((c) => c.date >= start && c.date <= end)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getMonthBalance(_companyId: string): Promise<{ income: number; expense: number }> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const entries = mockCashFlow.filter((c) => c.date >= start && c.date <= end);
    const income = entries
      .filter((c) => c.type === 'INCOME')
      .reduce((sum, c) => sum + c.amount, 0);
    const expense = entries
      .filter((c) => c.type === 'EXPENSE')
      .reduce((sum, c) => sum + Math.abs(c.amount), 0);
    return { income, expense };
  }

  async getBalance(_companyId: string): Promise<{ income: number; expense: number; balance: number }> {
    const income = mockCashFlow
      .filter((c) => c.type === 'INCOME')
      .reduce((sum, c) => sum + c.amount, 0);
    const expense = mockCashFlow
      .filter((c) => c.type === 'EXPENSE')
      .reduce((sum, c) => sum + Math.abs(c.amount), 0);
    const lastEntry = mockCashFlow.length > 0
      ? mockCashFlow.reduce((latest, c) => c.date > latest.date ? c : latest)
      : null;
    return { income, expense, balance: lastEntry?.balanceAfter ?? 0 };
  }
}

export const cashFlowRepository = new CashFlowRepository();
