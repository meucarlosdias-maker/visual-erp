import { installationRepository } from '../repository/installation-repository';
import { installationSchema } from '../schemas';
import { projectService } from '../../projects/services/project-service';
import type { Installation } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class InstallationService {
  async list(): Promise<Installation[]> {
    return installationRepository.list(COMPANY_ID);
  }

  async getById(id: string): Promise<Installation | null> {
    return installationRepository.getById(id);
  }

  async getByProjectId(projectId: string): Promise<Installation | null> {
    return installationRepository.getByProjectId(projectId);
  }

  async createFromProject(
    projectId: string,
    clientId: string | null,
    _name: string,
  ): Promise<Installation> {
    const number = await installationRepository.getNextNumber();
    const now = new Date();
    const installation = installationSchema.parse({
      id: crypto.randomUUID(),
      projectId,
      clientId,
      number,
      status: 'PLANNING',
      scheduledDate: null,
      startDate: null,
      endDate: null,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      latitude: null,
      longitude: null,
      contactName: '',
      contactPhone: '',
      notes: '',
      teams: [],
      equipments: [],
      vehicles: [],
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: '',
      updatedBy: null,
      deletedBy: null,
    });
    return installationRepository.create(installation);
  }

  async update(id: string, data: Record<string, unknown>): Promise<Installation> {
    const existing = await installationRepository.getById(id);
    if (!existing) throw new Error('Instalação não encontrada');

    const patch: Partial<Installation> = {
      address: (data.address as string) ?? existing.address,
      city: (data.city as string) ?? existing.city,
      state: (data.state as string) ?? existing.state,
      zipCode: (data.zipCode as string) ?? existing.zipCode,
      contactName: (data.contactName as string) ?? existing.contactName,
      contactPhone: (data.contactPhone as string) ?? existing.contactPhone,
      notes: (data.notes as string) ?? existing.notes,
      scheduledDate: data.scheduledDate
        ? new Date(data.scheduledDate as string)
        : data.scheduledDate === null ? null : existing.scheduledDate,
      status: (data.status as Installation['status']) ?? existing.status,
    };

    if (data.status === 'IN_PROGRESS' && !existing.startDate) {
      patch.startDate = new Date();
    }
    if (data.status === 'FINISHED' || data.status === 'DELIVERED' || data.status === 'CANCELLED') {
      patch.endDate = new Date();
    }

    const updated = await installationRepository.update(id, patch);

    if (data.status === 'DELIVERED' && existing.projectId) {
      await projectService.updateStatus(existing.projectId, 'DELIVERED').catch(() => {});
    }

    return updated;
  }

  async updateStatus(id: string, status: string): Promise<Installation> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    return installationRepository.softDelete(id);
  }

  async listByStatus(status: string): Promise<Installation[]> {
    return installationRepository.listByStatus(COMPANY_ID, status);
  }
}

export const installationService = new InstallationService();
