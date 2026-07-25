import type {
  FinancialAccountSchemaType, AccountsReceivableSchemaType,
  AccountsPayableSchemaType, CashFlowSchemaType,
} from '../schemas';
import type { FinancialStatus, AccountType, CashFlowType } from '../schemas';

export type { FinancialStatus, AccountType, CashFlowType };
export type FinancialAccount = FinancialAccountSchemaType;
export type AccountsReceivable = AccountsReceivableSchemaType;
export type AccountsPayable = AccountsPayableSchemaType;
export type CashFlow = CashFlowSchemaType;
