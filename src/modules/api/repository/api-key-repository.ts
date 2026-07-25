import { BaseRepository } from '@/lib/repository-base';
import type { ApiKey } from '../types';
import type { ApiKeyInput, ApiKeyUpdate } from '../schemas';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockApiKeys: ApiKey[] = [
  {
    id: 'api-key-001', companyId: COMPANY_ID, name: 'Chave de Produção',
    key: 'vek_prod_samplekey1234567890abcdef', secret: 'sk_prod_secret_hash_placeholder',
    permissions: ['crm.read', 'crm.write', 'financial.read', 'financial.write'],
    active: true, expiresAt: null, lastUsedAt: null,
    createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01'), deletedAt: null,
    createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'api-key-002', companyId: COMPANY_ID, name: 'Chave de Desenvolvimento',
    key: 'vek_dev_samplekey1234567890abcd', secret: 'sk_dev_secret_hash_placeholder',
    permissions: ['crm.read'],
    active: true, expiresAt: new Date('2027-12-31'), lastUsedAt: null,
    createdAt: new Date('2026-07-15'), updatedAt: new Date('2026-07-15'), deletedAt: null,
    createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class ApiKeyRepository extends BaseRepository<ApiKey, ApiKeyInput, ApiKeyUpdate> {
  async findAll(): Promise<ApiKey[]> {
    return mockApiKeys
      .filter((k) => !k.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<ApiKey | null> {
    return mockApiKeys.find((k) => k.id === id && !k.deletedAt) ?? null;
  }

  async findMany(filter: Partial<ApiKey>): Promise<ApiKey[]> {
    return mockApiKeys.filter((k) => {
      if (k.deletedAt) return false;
      return Object.entries(filter).every(([key, value]) =>
        (k as unknown as Record<string, unknown>)[key] === value
      );
    });
  }

  async create(input: ApiKeyInput): Promise<ApiKey> {
    const key = `vek_${crypto.randomUUID().replace(/-/g, '').slice(0, 28)}`;
    const secret = `sk_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
    const entry: ApiKey = {
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      name: input.name,
      key,
      secret,
      permissions: input.permissions,
      active: input.active,
      expiresAt: input.expiresAt ?? null,
      lastUsedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
    };
    mockApiKeys.push(entry);
    return entry;
  }

  async update(id: string, input: ApiKeyUpdate): Promise<ApiKey> {
    const idx = mockApiKeys.findIndex((k) => k.id === id);
    if (idx === -1) throw new Error('ApiKey não encontrada');
    mockApiKeys[idx] = { ...mockApiKeys[idx], ...input, updatedAt: new Date() };
    return mockApiKeys[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockApiKeys.findIndex((k) => k.id === id);
    if (idx !== -1) {
      mockApiKeys[idx] = { ...mockApiKeys[idx], deletedAt: new Date(), active: false };
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<ApiKey> {
    const idx = mockApiKeys.findIndex((k) => k.id === id);
    if (idx === -1) throw new Error('ApiKey não encontrada');
    mockApiKeys[idx] = { ...mockApiKeys[idx], deletedAt: null, active: true };
    return mockApiKeys[idx];
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    return mockApiKeys.find((k) => k.key === key && !k.deletedAt && k.active) ?? null;
  }

  async updateLastUsed(id: string): Promise<void> {
    const idx = mockApiKeys.findIndex((k) => k.id === id);
    if (idx !== -1) {
      mockApiKeys[idx].lastUsedAt = new Date();
    }
  }

  async regenerateSecret(id: string): Promise<string> {
    const idx = mockApiKeys.findIndex((k) => k.id === id);
    if (idx === -1) throw new Error('ApiKey não encontrada');
    const secret = `sk_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
    mockApiKeys[idx] = { ...mockApiKeys[idx], secret, updatedAt: new Date() };
    return secret;
  }
}

export const apiKeyRepository = new ApiKeyRepository();