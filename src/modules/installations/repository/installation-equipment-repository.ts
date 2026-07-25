import type { InstallationEquipment } from '../types';

const mockEquipments: InstallationEquipment[] = [
  { id: 'ie-001', installationId: 'inst-001', equipmentId: 'eq-caminhao', quantity: 1 },
];

export class InstallationEquipmentRepository {
  async listByInstallationId(installationId: string): Promise<InstallationEquipment[]> {
    return mockEquipments.filter((e) => e.installationId === installationId);
  }

  async getById(id: string): Promise<InstallationEquipment | null> {
    return mockEquipments.find((e) => e.id === id) ?? null;
  }

  async create(data: InstallationEquipment): Promise<InstallationEquipment> {
    mockEquipments.push(data);
    return data;
  }

  async update(id: string, data: Partial<InstallationEquipment>): Promise<InstallationEquipment> {
    const idx = mockEquipments.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Registro não encontrado');
    mockEquipments[idx] = { ...mockEquipments[idx], ...data };
    return mockEquipments[idx];
  }

  async delete(id: string): Promise<void> {
    const idx = mockEquipments.findIndex((e) => e.id === id);
    if (idx !== -1) mockEquipments.splice(idx, 1);
  }
}

export const installationEquipmentRepository = new InstallationEquipmentRepository();
