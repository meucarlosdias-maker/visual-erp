import { logRepository } from '../repository/log-repository';
import type { SystemLog } from '../types';
import { logSchema } from '../schemas';

export class LogService {
  async list(): Promise<SystemLog[]> {
    return logRepository.list();
  }

  async create(level: SystemLog['level'], module: string, message: string, stack?: string): Promise<SystemLog> {
    const log = logSchema.parse({
      id: crypto.randomUUID(),
      level, module, message, stack: stack ?? '',
      createdAt: new Date(),
    });
    return logRepository.create(log);
  }

  async purgeBefore(days: number): Promise<void> {
    const date = new Date(Date.now() - days * 86400000);
    return logRepository.purgeBefore(date);
  }
}

export const logService = new LogService();
