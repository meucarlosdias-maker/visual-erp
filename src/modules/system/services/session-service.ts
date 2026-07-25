import { sessionRepository } from '../repository/session-repository';
import type { UserSession } from '../types';

export class SessionService {
  async list(): Promise<UserSession[]> {
    return sessionRepository.list();
  }

  async listByUserId(userId: string): Promise<UserSession[]> {
    return sessionRepository.listByUserId(userId);
  }

  async revoke(id: string): Promise<void> {
    return sessionRepository.revoke(id);
  }

  async getActiveCount(): Promise<number> {
    return (await sessionRepository.list()).filter((s) => s.active).length;
  }

  async countActiveByUser(userId: string): Promise<number> {
    return sessionRepository.countActiveByUser(userId);
  }
}

export const sessionService = new SessionService();
