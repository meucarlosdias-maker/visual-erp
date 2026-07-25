import type { InstallationVehicle } from '../types';

const mockVehicles: InstallationVehicle[] = [
  { id: 'iv-001', installationId: 'inst-001', vehicle: 'Fiorino', driver: 'José', plate: 'ABC-1234', notes: '' },
];

export class InstallationVehicleRepository {
  async listByInstallationId(installationId: string): Promise<InstallationVehicle[]> {
    return mockVehicles.filter((v) => v.installationId === installationId);
  }

  async getById(id: string): Promise<InstallationVehicle | null> {
    return mockVehicles.find((v) => v.id === id) ?? null;
  }

  async create(data: InstallationVehicle): Promise<InstallationVehicle> {
    mockVehicles.push(data);
    return data;
  }

  async update(id: string, data: Partial<InstallationVehicle>): Promise<InstallationVehicle> {
    const idx = mockVehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Registro não encontrado');
    mockVehicles[idx] = { ...mockVehicles[idx], ...data };
    return mockVehicles[idx];
  }

  async delete(id: string): Promise<void> {
    const idx = mockVehicles.findIndex((v) => v.id === id);
    if (idx !== -1) mockVehicles.splice(idx, 1);
  }
}

export const installationVehicleRepository = new InstallationVehicleRepository();
