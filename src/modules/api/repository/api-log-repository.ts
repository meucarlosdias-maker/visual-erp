import { BaseRepository } from '@/lib/repository-base';
import type { ApiLog } from '../types';
import type { ApiLogInput } from '../schemas';

const mockApiLogs: ApiLog[] = [];

export class ApiLogRepository extends BaseRepository<ApiLog, ApiLogInput, Partial<ApiLogInput>> {
  async findAll(): Promise<ApiLog[]> {
    return [...mockApiLogs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 100);
  }

  async findById(id: string): Promise<ApiLog | null> {
    return mockApiLogs.find((l) => l.id === id) ?? null;
  }

  async findMany(filter: Partial<ApiLog>): Promise<ApiLog[]> {
    return mockApiLogs
      .filter((l) => Object.entries(filter).every(([key, value]) =>
        (l as unknown as Record<string, unknown>)[key] === value
      ))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(input: ApiLogInput): Promise<ApiLog> {
    const entry: ApiLog = {
      id: crypto.randomUUID(),
      apiKeyId: input.apiKeyId,
      endpoint: input.endpoint,
      method: input.method,
      statusCode: input.statusCode,
      responseTime: input.responseTime,
      ip: input.ip ?? null,
      createdAt: new Date(),
    };
    mockApiLogs.push(entry);
    return entry;
  }

  async update(id: string, _input: Partial<ApiLogInput>): Promise<ApiLog> {
    return mockApiLogs.find((l) => l.id === id) ?? (() => { throw new Error('ApiLog não encontrado'); })();
  }

  async delete(_id: string): Promise<boolean> {
    return true;
  }

  async restore(_id: string): Promise<ApiLog> {
    throw new Error('ApiLog não pode ser restaurado');
  }
}

export const apiLogRepository = new ApiLogRepository();