import { BaseService } from '@/lib/service-base';
import { apiKeyRepository, ApiKeyRepository } from '../repository/api-key-repository';
import { NotFoundError } from '@/lib/errors';
import type { ApiKey } from '../types';
import type { ApiKeyInput, ApiKeyUpdate } from '../schemas';

export class ApiKeyService extends BaseService<ApiKey, ApiKeyInput, ApiKeyUpdate, ApiKeyRepository> {
  protected entityName = 'Chave de API';

  constructor() {
    super(apiKeyRepository);
  }

  async list(): Promise<ApiKey[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<ApiKey> {
    const key = await this.repository.findById(id);
    if (!key) throw new NotFoundError('Chave de API', id);
    return key;
  }

  async create(input: ApiKeyInput): Promise<ApiKey & { rawKey: string; rawSecret: string }> {
    const created = await this.repository.create(input);
    return {
      ...created,
      rawKey: (created as unknown as Record<string, string>).key,
      rawSecret: (created as unknown as Record<string, string>).secret,
    };
  }

  async update(id: string, input: ApiKeyUpdate): Promise<ApiKey> {
    await this.get(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    await this.get(id);
    return this.repository.delete(id);
  }

  async restore(id: string): Promise<ApiKey> {
    return this.repository.restore(id);
  }

  async duplicate(id: string): Promise<ApiKey> {
    const original = await this.get(id);
    return this.repository.create({
      name: `${original.name} (cópia)`,
      permissions: original.permissions,
      active: false,
    });
  }

  async validateKey(key: string, secret: string): Promise<ApiKey | null> {
    const apiKey = await this.repository.findByKey(key);
    if (!apiKey) return null;
    if (apiKey.secret !== secret) return null;
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;
    await this.repository.updateLastUsed(apiKey.id);
    return apiKey;
  }

  async regenerateSecret(id: string): Promise<string> {
    await this.get(id);
    return this.repository.regenerateSecret(id);
  }
}

export const apiKeyService = new ApiKeyService();