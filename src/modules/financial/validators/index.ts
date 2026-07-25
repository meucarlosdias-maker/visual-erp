export const FINANCIAL_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  PARTIALLY_PAID: 'Parcial',
  PAID: 'Pago',
  OVERDUE: 'Vencido',
  CANCELLED: 'Cancelado',
};

export const FINANCIAL_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PARTIALLY_PAID: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CHECKING: 'Conta Corrente',
  SAVINGS: 'Poupança',
  CASH: 'Dinheiro',
  INVESTMENT: 'Investimento',
};

export const CASH_FLOW_TYPE_LABELS: Record<string, string> = {
  INCOME: 'Entrada',
  EXPENSE: 'Saída',
};

export const CASH_FLOW_TYPE_COLORS: Record<string, string> = {
  INCOME: 'text-green-600',
  EXPENSE: 'text-red-600',
};
