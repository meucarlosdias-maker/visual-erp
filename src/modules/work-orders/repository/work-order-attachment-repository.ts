import { BaseRepository, PaginationInput } from '@/lib/repository-base';
import type { WorkOrderAttachment } from '../types';

const mockAttachments: WorkOrderAttachment[] = [];

export class WorkOrderAttachmentRepository extends BaseRepository<WorkOrderAttachment, WorkOrderAttachment, Partial<WorkOrderAttachment>> {
  async findAll(_params?: PaginationInput): Promise<WorkOrderAttachment[]> {
    return [...mockAttachments];
  }

  async findById(id: string): Promise<WorkOrderAttachment | null> {
    return mockAttachments.find((a) => a.id === id) ?? null;
  }

  async findMany(filter: Partial<WorkOrderAttachment>): Promise<WorkOrderAttachment[]> {
    return mockAttachments.filter((a) =>
      Object.entries(filter).every(([key, value]) => (a as Record<string, unknown>)[key] === value)
    );
  }

  async create(data: WorkOrderAttachment): Promise<WorkOrderAttachment> {
    mockAttachments.push(data);
    return data;
  }

  async update(id: string, data: Partial<WorkOrderAttachment>): Promise<WorkOrderAttachment> {
    const idx = mockAttachments.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Attachment not found');
    mockAttachments[idx] = { ...mockAttachments[idx], ...data };
    return mockAttachments[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockAttachments.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    mockAttachments.splice(idx, 1);
    return true;
  }

  async restore(id: string): Promise<WorkOrderAttachment> {
    const attachment = mockAttachments.find((a) => a.id === id);
    if (!attachment) throw new Error('Attachment not found');
    return attachment;
  }

  async listByWorkOrderId(workOrderId: string): Promise<WorkOrderAttachment[]> {
    return mockAttachments.filter((a) => a.workOrderId === workOrderId);
  }
}

export const workOrderAttachmentRepository = new WorkOrderAttachmentRepository();
