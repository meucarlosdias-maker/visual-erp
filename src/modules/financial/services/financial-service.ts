import { financialAccountRepository } from '../repository/financial-account-repository';
import { accountsReceivableRepository } from '../repository/accounts-receivable-repository';
import { accountsPayableRepository } from '../repository/accounts-payable-repository';
import { cashFlowRepository } from '../repository/cash-flow-repository';
import { financialAccountSchema, accountsReceivableSchema, accountsPayableSchema, cashFlowSchema } from '../schemas';
import type { FinancialAccount, AccountsReceivable, AccountsPayable, CashFlow } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class FinancialService {
  async listAccounts(): Promise<FinancialAccount[]> {
    return financialAccountRepository.list(COMPANY_ID);
  }

  async createAccount(data: Record<string, unknown>): Promise<FinancialAccount> {
    const now = new Date();
    const parsed = financialAccountSchema.parse({
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      name: data.name || '',
      bank: data.bank || '',
      agency: data.agency || '',
      account: data.account || '',
      type: data.type || 'CHECKING',
      initialBalance: Number(data.initialBalance) || 0,
      currentBalance: Number(data.currentBalance) || Number(data.initialBalance) || 0,
      active: true,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
    return financialAccountRepository.create(parsed);
  }

  async updateAccount(id: string, data: Record<string, unknown>): Promise<FinancialAccount> {
    const now = new Date();
    return financialAccountRepository.update(id, { ...data, updatedAt: now } as Partial<FinancialAccount>);
  }

  async getOverview() {
    const [balance, receivablesPending, payablesPending, receivablesOverdue, payablesOverdue, cashFlowMonth] =
      await Promise.all([
        financialAccountRepository.getTotalBalance(COMPANY_ID),
        accountsReceivableRepository.getTotalPending(COMPANY_ID),
        accountsPayableRepository.getTotalPending(COMPANY_ID),
        accountsReceivableRepository.getTotalOverdue(COMPANY_ID),
        accountsPayableRepository.getTotalOverdue(COMPANY_ID),
        cashFlowRepository.getMonthBalance(COMPANY_ID),
      ]);
    return {
      balance,
      receivablesPending,
      payablesPending,
      receivablesOverdue,
      payablesOverdue,
      cashFlowMonth: cashFlowMonth.income - cashFlowMonth.expense,
      defaultedAmount: receivablesOverdue,
      monthlyResult: cashFlowMonth.income - cashFlowMonth.expense,
      netForecast: balance + receivablesPending - payablesPending,
    };
  }

  async listReceivables(): Promise<AccountsReceivable[]> {
    return accountsReceivableRepository.list(COMPANY_ID);
  }

  async getReceivable(id: string): Promise<AccountsReceivable | null> {
    return accountsReceivableRepository.getById(id);
  }

  async createReceivable(data: Record<string, unknown>): Promise<AccountsReceivable> {
    const number = await accountsReceivableRepository.getNextNumber();
    const now = new Date();
    const parsed = accountsReceivableSchema.parse({
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      number,
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    const created = await accountsReceivableRepository.create(parsed);
    return created;
  }

  async updateReceivable(id: string, data: Record<string, unknown>): Promise<AccountsReceivable> {
    const existing = await accountsReceivableRepository.getById(id);
    if (!existing) throw new Error('Conta a receber não encontrada');

    const patch: Partial<AccountsReceivable> = {
      ...data,
      paymentDate: data.paymentDate ? new Date(data.paymentDate as string) : data.paymentDate === null ? null : existing.paymentDate,
      dueDate: data.dueDate ? new Date(data.dueDate as string) : existing.dueDate,
      status: (data.status as AccountsReceivable['status']) ?? existing.status,
    };

    if (data.status === 'PAID' && !existing.paymentDate) {
      patch.paymentDate = new Date();
      patch.receivedAmount = (data.receivedAmount as number) ?? existing.amount;
      await this.registerCashFlow('INCOME', `Recebimento ${existing.number}`, existing.description, existing.id, patch.receivedAmount);
    }

    return accountsReceivableRepository.update(id, patch);
  }

  async receiveReceivable(id: string, receivedAmount: number, paymentMethod: string): Promise<AccountsReceivable> {
    return this.updateReceivable(id, {
      status: 'PAID',
      receivedAmount,
      paymentMethod,
      paymentDate: new Date().toISOString(),
    });
  }

  async deleteReceivable(id: string): Promise<void> {
    return accountsReceivableRepository.delete(id);
  }

  async listPayables(): Promise<AccountsPayable[]> {
    return accountsPayableRepository.list(COMPANY_ID);
  }

  async getPayable(id: string): Promise<AccountsPayable | null> {
    return accountsPayableRepository.getById(id);
  }

  async createPayable(data: Record<string, unknown>): Promise<AccountsPayable> {
    const number = await accountsPayableRepository.getNextNumber();
    const now = new Date();
    const parsed = accountsPayableSchema.parse({
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      number,
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    const created = await accountsPayableRepository.create(parsed);
    return created;
  }

  async updatePayable(id: string, data: Record<string, unknown>): Promise<AccountsPayable> {
    const existing = await accountsPayableRepository.getById(id);
    if (!existing) throw new Error('Conta a pagar não encontrada');

    const patch: Partial<AccountsPayable> = {
      ...data,
      paymentDate: data.paymentDate ? new Date(data.paymentDate as string) : data.paymentDate === null ? null : existing.paymentDate,
      dueDate: data.dueDate ? new Date(data.dueDate as string) : existing.dueDate,
      status: (data.status as AccountsPayable['status']) ?? existing.status,
    };

    if (data.status === 'PAID' && !existing.paymentDate) {
      patch.paymentDate = new Date();
      patch.paidAmount = (data.paidAmount as number) ?? existing.amount;
      await this.registerCashFlow('EXPENSE', `Pagamento ${existing.number}`, existing.description, existing.id, -(patch.paidAmount));
    }

    return accountsPayableRepository.update(id, patch);
  }

  async payPayable(id: string, paidAmount: number, paymentMethod: string): Promise<AccountsPayable> {
    return this.updatePayable(id, {
      status: 'PAID',
      paidAmount,
      paymentMethod,
      paymentDate: new Date().toISOString(),
    });
  }

  async deletePayable(id: string): Promise<void> {
    return accountsPayableRepository.delete(id);
  }

  async listCashFlow(): Promise<CashFlow[]> {
    return cashFlowRepository.list(COMPANY_ID);
  }

  async getCashFlowBalance(): Promise<{ income: number; expense: number; balance: number }> {
    return cashFlowRepository.getBalance(COMPANY_ID);
  }

  private async registerCashFlow(type: 'INCOME' | 'EXPENSE', description: string, origin: string, referenceId: string | null, amount: number): Promise<void> {
    if (referenceId) {
      const existing = await cashFlowRepository.findByReference(referenceId, type);
      if (existing) return;
    }
    const balance = await cashFlowRepository.getBalance(COMPANY_ID);
    const now = new Date();
    const entry = cashFlowSchema.parse({
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      date: now,
      type,
      description,
      origin: origin || type,
      referenceId,
      amount,
      balanceAfter: balance.balance + amount,
      createdAt: now,
    });
    await cashFlowRepository.create(entry);
  }
}

export const financialService = new FinancialService();
