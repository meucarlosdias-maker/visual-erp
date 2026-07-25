import { BaseService } from '@/lib/service-base';
import { apiLogRepository, ApiLogRepository } from '../repository/api-log-repository';
import type { ApiLog } from '../types';
import type { ApiLogInput } from '../schemas';

export class ApiLogService extends BaseService<ApiLog, ApiLogInput, Partial<ApiLogInput>, ApiLogRepository> {
  protected entityName = 'Log de API';

  constructor() {
    super(apiLogRepository);
  }

  async list(): Promise<ApiLog[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<ApiLog> {
    const log = await this.repository.findById(id);
    if (!log) throw new Error('Log não encontrado');
    return log;
  }

  async create(input: ApiLogInput): Promise<ApiLog> {
    return this.repository.create(input);
  }
}

export const apiLogService = new ApiLogService();