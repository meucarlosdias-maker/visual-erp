import type { VisitAttachment } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const mockAttachments: VisitAttachment[] = [];

export class VisitAttachmentRepository extends BaseRepository<VisitAttachment, VisitAttachment, Partial<VisitAttachment>> {
  async findAll(): Promise<VisitAttachment[]> {
    return [...mockAttachments];
  }

  async findById(id: string): Promise<VisitAttachment | null> {
    return mockAttachments.find((a) => a.id === id) ?? null;
  }

  async findMany(filter: Partial<VisitAttachment>): Promise<VisitAttachment[]> {
    return mockAttachments.filter((a) =>
      Object.entries(filter).every(([key, value]) =>
        (a as Record<string, unknown>)[key] === value
      )
    );
  }

  async create(data: VisitAttachment): Promise<VisitAttachment> {
    mockAttachments.push(data);
    return data;
  }

  async update(id: string, data: Partial<VisitAttachment>): Promise<VisitAttachment> {
    const idx = mockAttachments.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Anexo não encontrado');
    mockAttachments[idx] = { ...mockAttachments[idx], ...data };
    return mockAttachments[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockAttachments.findIndex((a) => a.id === id);
    if (idx !== -1) {
      mockAttachments.splice(idx, 1);
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<VisitAttachment> {
    const entity = await this.findById(id);
    if (!entity) throw new Error('Anexo não encontrado');
    return entity;
  }

  async listByVisitId(visitId: string): Promise<VisitAttachment[]> {
    return mockAttachments.filter((a) => a.visitId === visitId);
  }
}

export const visitAttachmentRepository = new VisitAttachmentRepository();
