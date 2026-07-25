'use server';

import { equipmentService } from '../services/equipment-service';

export async function listEquipments() {
  return equipmentService.list();
}

export async function getEquipment(id: string) {
  return equipmentService.get(id);
}

export async function createEquipment(data: Record<string, unknown>) {
  return equipmentService.create(data);
}

export async function updateEquipment(id: string, data: Record<string, unknown>) {
  return equipmentService.update(id, data);
}

export async function deleteEquipment(id: string) {
  return equipmentService.delete(id);
}

export async function toggleEquipmentActive(id: string) {
  return equipmentService.toggleActive(id);
}
