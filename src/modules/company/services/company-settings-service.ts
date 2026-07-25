import { companySettingsRepository } from '../repository/company-settings-repository';
import { companySettingsSchema, companyPreferencesSchema, companySequenceSchema } from '../schemas/company-settings-schema';
import type { CompanySettings, CompanyPreferences, CompanySequence } from '../types/company-settings';

export class CompanySettingsService {
  async get(): Promise<CompanySettings | null> {
    return companySettingsRepository.get();
  }

  async save(data: Record<string, unknown>): Promise<CompanySettings> {
    const parsed = companySettingsSchema.parse({
      ...data,
      id: (await companySettingsRepository.get())?.id ?? crypto.randomUUID(),
      updatedAt: new Date(),
    });
    return companySettingsRepository.update(parsed);
  }

  async getPreferences(): Promise<CompanyPreferences | null> {
    return companySettingsRepository.getPreferences();
  }

  async savePreferences(data: Record<string, unknown>): Promise<CompanyPreferences> {
    const existing = await companySettingsRepository.getPreferences();
    const parsed = companyPreferencesSchema.parse({
      ...data,
      id: existing?.id ?? crypto.randomUUID(),
      companyId: (await companySettingsRepository.get())?.id ?? '',
      updatedAt: new Date(),
    });
    return companySettingsRepository.updatePreferences(parsed);
  }

  async listSequences(): Promise<CompanySequence[]> {
    return companySettingsRepository.listSequences();
  }

  async updateSequence(id: string, data: Partial<CompanySequence>): Promise<CompanySequence> {
    const parsed = companySequenceSchema.partial().parse(data);
    return companySettingsRepository.updateSequence(id, parsed);
  }

  async getNextNumber(entity: string): Promise<string> {
    return companySettingsRepository.getNextNumber(entity);
  }
}

export const companySettingsService = new CompanySettingsService();
