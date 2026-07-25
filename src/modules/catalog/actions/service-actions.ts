'use server';

import { serviceService } from '../services/service-service';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';
const USER_ID = '00000000-0000-0000-0000-000000000000';

export async function listServices(filters?: { categoryId?: string; subcategoryId?: string }) {
  return serviceService.list(filters);
}

export async function getService(id: string) {
  return serviceService.getById(id);
}

export async function createService(data: Record<string, unknown>) {
  return serviceService.create(data);
}

export async function updateService(id: string, data: Record<string, unknown>) {
  return serviceService.update(id, data);
}

export async function deleteService(id: string) {
  await serviceService.delete(id);
}

export async function toggleServiceActive(id: string) {
  return serviceService.toggleActive(id);
}
