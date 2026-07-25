'use server';

import { quotationService } from '../services/quotation-service';

export async function listQuotations() {
  return quotationService.list();
}

export async function getQuotation(id: string) {
  return quotationService.get(id);
}

export async function createQuotation(data: Record<string, unknown>) {
  return quotationService.create(data);
}

export async function updateQuotation(id: string, data: Record<string, unknown>) {
  return quotationService.update(id, data);
}

export async function duplicateQuotation(id: string) {
  return quotationService.duplicate(id);
}

export async function updateQuotationStatus(id: string, status: string) {
  return quotationService.updateStatus(id, status);
}

export async function deleteQuotation(id: string) {
  await quotationService.delete(id);
}
