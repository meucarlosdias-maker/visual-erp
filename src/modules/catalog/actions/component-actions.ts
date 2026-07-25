'use server';

import { componentService } from '../services/component-service';

const USER_ID = '00000000-0000-0000-0000-000000000000';

export async function listComponents(serviceId: string) {
  return componentService.listByService(serviceId);
}

export async function getComponent(id: string) {
  return componentService.getById(id);
}

export async function createComponent(data: Record<string, unknown>) {
  return componentService.create(data);
}

export async function updateComponent(id: string, data: Record<string, unknown>) {
  return componentService.update(id, data);
}

export async function deleteComponent(id: string) {
  await componentService.delete(id);
}
