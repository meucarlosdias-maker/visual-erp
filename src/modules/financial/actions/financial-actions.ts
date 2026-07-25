'use server';

import { financialService } from '../services/financial-service';

export async function listFinancialAccounts() {
  return financialService.listAccounts();
}

export async function createFinancialAccount(data: Record<string, unknown>) {
  return financialService.createAccount(data);
}

export async function updateFinancialAccount(id: string, data: Record<string, unknown>) {
  return financialService.updateAccount(id, data);
}

export async function getFinancialOverview() {
  return financialService.getOverview();
}

export async function listReceivables() {
  return financialService.listReceivables();
}

export async function getReceivable(id: string) {
  return financialService.getReceivable(id);
}

export async function createReceivable(data: Record<string, unknown>) {
  return financialService.createReceivable(data);
}

export async function updateReceivable(id: string, data: Record<string, unknown>) {
  return financialService.updateReceivable(id, data);
}

export async function receiveReceivable(id: string, receivedAmount: number, paymentMethod: string) {
  return financialService.receiveReceivable(id, receivedAmount, paymentMethod);
}

export async function deleteReceivable(id: string) {
  await financialService.deleteReceivable(id);
}

export async function listPayables() {
  return financialService.listPayables();
}

export async function getPayable(id: string) {
  return financialService.getPayable(id);
}

export async function createPayable(data: Record<string, unknown>) {
  return financialService.createPayable(data);
}

export async function updatePayable(id: string, data: Record<string, unknown>) {
  return financialService.updatePayable(id, data);
}

export async function payPayable(id: string, paidAmount: number, paymentMethod: string) {
  return financialService.payPayable(id, paidAmount, paymentMethod);
}

export async function deletePayable(id: string) {
  await financialService.deletePayable(id);
}

export async function listCashFlow() {
  return financialService.listCashFlow();
}

export async function getCashFlowBalance() {
  return financialService.getCashFlowBalance();
}
