import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));

export const financialStatusSchema = z.enum([
  'PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED',
]);
export type FinancialStatus = z.infer<typeof financialStatusSchema>;

export const accountTypeSchema = z.enum([
  'CHECKING', 'SAVINGS', 'CASH', 'INVESTMENT',
]);
export type AccountType = z.infer<typeof accountTypeSchema>;

export const cashFlowTypeSchema = z.enum(['INCOME', 'EXPENSE']);
export type CashFlowType = z.infer<typeof cashFlowTypeSchema>;

export const financialAccountSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  bank: z.string().optional().default(''),
  agency: z.string().optional().default(''),
  account: z.string().optional().default(''),
  type: accountTypeSchema.default('CHECKING'),
  initialBalance: z.coerce.number().default(0),
  currentBalance: z.coerce.number().default(0),
  active: z.boolean().default(true),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
});
export type FinancialAccountSchemaType = z.infer<typeof financialAccountSchema>;

export const accountsReceivableSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  clientId: z.string().nullable().optional().default(null),
  projectId: z.string().nullable().optional().default(null),
  quotationId: z.string().nullable().optional().default(null),
  number: z.string().min(1, 'Número é obrigatório'),
  description: z.string().optional().default(''),
  issueDate: dateField,
  dueDate: dateField,
  paymentDate: dateField.nullable().optional().default(null),
  status: financialStatusSchema.default('PENDING'),
  amount: z.coerce.number().min(0, 'Valor deve ser positivo'),
  discount: z.coerce.number().min(0).default(0),
  interest: z.coerce.number().min(0).default(0),
  fine: z.coerce.number().min(0).default(0),
  receivedAmount: z.coerce.number().min(0).default(0),
  paymentMethod: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
});
export type AccountsReceivableSchemaType = z.infer<typeof accountsReceivableSchema>;

export const accountsPayableSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  supplierId: z.string().nullable().optional().default(null),
  projectId: z.string().nullable().optional().default(null),
  number: z.string().min(1, 'Número é obrigatório'),
  description: z.string().optional().default(''),
  issueDate: dateField,
  dueDate: dateField,
  paymentDate: dateField.nullable().optional().default(null),
  status: financialStatusSchema.default('PENDING'),
  amount: z.coerce.number().min(0, 'Valor deve ser positivo'),
  discount: z.coerce.number().min(0).default(0),
  interest: z.coerce.number().min(0).default(0),
  fine: z.coerce.number().min(0).default(0),
  paidAmount: z.coerce.number().min(0).default(0),
  paymentMethod: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  createdAt: dateField,
  updatedAt: dateField,
  deletedAt: dateField.nullable().optional().default(null),
});
export type AccountsPayableSchemaType = z.infer<typeof accountsPayableSchema>;

export const cashFlowSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  date: dateField,
  type: cashFlowTypeSchema,
  description: z.string().optional().default(''),
  origin: z.string().optional().default(''),
  referenceId: z.string().nullable().optional().default(null),
  amount: z.coerce.number(),
  balanceAfter: z.coerce.number().default(0),
  createdAt: dateField,
});
export type CashFlowSchemaType = z.infer<typeof cashFlowSchema>;

export const receivableFormSchema = accountsReceivableSchema.omit({
  id: true, companyId: true, number: true,
  createdAt: true, updatedAt: true, deletedAt: true,
});
export type ReceivableFormType = z.infer<typeof receivableFormSchema>;

export const payableFormSchema = accountsPayableSchema.omit({
  id: true, companyId: true, number: true,
  createdAt: true, updatedAt: true, deletedAt: true,
});
export type PayableFormType = z.infer<typeof payableFormSchema>;
