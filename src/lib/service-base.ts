import { NotFoundError, BusinessRuleError } from './errors';
import { logger } from './logger';
import type { PaginationInput, PaginatedResult } from './repository-base';

export interface ServiceBase<T, TCreate, TUpdate> {
  list(params?: PaginationInput): Promise<T[] | PaginatedResult<T>>;
  get(id: string): Promise<T>;
  create(input: TCreate): Promise<T>;
  update(id: string, input: TUpdate): Promise<T>;
  delete(id: string): Promise<boolean>;
  restore(id: string): Promise<T>;
  duplicate(id: string): Promise<T>;
}

export abstract class BaseService<T, TCreate, TUpdate, TRepo> {
  constructor(protected repository: TRepo) {}

  protected abstract entityName: string;

  async list(params?: PaginationInput): Promise<T[] | PaginatedResult<T>> {
    try {
      const repo = this.repository as { findAll: (params?: PaginationInput) => Promise<T[] | PaginatedResult<T>> };
      return await repo.findAll(params);
    } catch (err) {
      logger.error(`Error listing ${this.entityName}`, { error: (err as Error).message });
      throw err;
    }
  }

  async get(id: string): Promise<T> {
    try {
      const repo = this.repository as { findById: (id: string) => Promise<T | null> };
      const entity = await repo.findById(id);
      if (!entity) throw new NotFoundError(this.entityName, id);
      return entity;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      logger.error(`Error getting ${this.entityName}`, { id, error: (err as Error).message });
      throw err;
    }
  }

  async create(input: TCreate): Promise<T> {
    try {
      const repo = this.repository as { create: (input: TCreate) => Promise<T> };
      return await repo.create(input);
    } catch (err) {
      logger.error(`Error creating ${this.entityName}`, { error: (err as Error).message });
      throw err;
    }
  }

  async update(id: string, input: TUpdate): Promise<T> {
    const repo = this.repository as { update: (id: string, input: TUpdate) => Promise<T> };
    const entity = await this.get(id);
    if (!entity) throw new NotFoundError(this.entityName, id);
    try {
      return await repo.update(id, input);
    } catch (err) {
      logger.error(`Error updating ${this.entityName}`, { id, error: (err as Error).message });
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    const repo = this.repository as { delete: (id: string) => Promise<boolean> };
    const entity = await this.get(id);
    if (!entity) throw new NotFoundError(this.entityName, id);
    try {
      return await repo.delete(id);
    } catch (err) {
      logger.error(`Error deleting ${this.entityName}`, { id, error: (err as Error).message });
      throw err;
    }
  }

  async restore(id: string): Promise<T> {
    try {
      const repo = this.repository as { restore: (id: string) => Promise<T> };
      return await repo.restore(id);
    } catch (err) {
      logger.error(`Error restoring ${this.entityName}`, { id, error: (err as Error).message });
      throw err;
    }
  }

  async duplicate(id: string): Promise<T> {
    try {
      const entity = await this.get(id);
      const repo = this.repository as { create: (input: TCreate) => Promise<T> };
      const { id: _id, createdAt, updatedAt, deletedAt, ...data } = entity as unknown as Record<string, unknown>;
      return await repo.create(data as unknown as TCreate);
    } catch (err) {
      logger.error(`Error duplicating ${this.entityName}`, { id, error: (err as Error).message });
      throw err;
    }
  }
}
