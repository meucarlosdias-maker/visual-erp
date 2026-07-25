import type { SecuritySettings } from '../types';

let mockSettings: SecuritySettings = {
  sessionExpirationMinutes: 60,
  maxLoginAttempts: 5,
  autoBlockMinutes: 30,
  mfaEnabled: false,
  mfaMethod: 'none',
  passwordMinLength: 8,
  passwordRequireSpecialChar: true,
  passwordRequireNumber: true,
  sessionConcurrentLimit: 3,
};

export class SecurityRepository {
  async get(): Promise<SecuritySettings> {
    return { ...mockSettings };
  }

  async update(data: Partial<SecuritySettings>): Promise<SecuritySettings> {
    mockSettings = { ...mockSettings, ...data };
    return { ...mockSettings };
  }
}

export const securityRepository = new SecurityRepository();
