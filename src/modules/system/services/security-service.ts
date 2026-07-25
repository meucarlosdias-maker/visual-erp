import { securityRepository } from '../repository/security-repository';
import type { SecuritySettings } from '../types';

export class SecurityService {
  async get(): Promise<SecuritySettings> {
    return securityRepository.get();
  }

  async update(data: Partial<SecuritySettings>): Promise<SecuritySettings> {
    return securityRepository.update(data);
  }
}

export const securityService = new SecurityService();
