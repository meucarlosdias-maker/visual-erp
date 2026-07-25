import { auditRepository } from '../repository/audit-repository';
import type { AuditLog } from '../types';
import { auditLogSchema } from '../schemas';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class AuditService {
  async list(): Promise<AuditLog[]> {
    return auditRepository.list(COMPANY_ID);
  }

  async getById(id: string): Promise<AuditLog | null> {
    return auditRepository.getById(id);
  }

  async create(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const log = auditLogSchema.parse({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
    return auditRepository.create(log);
  }
}

export const auditService = new AuditService();
