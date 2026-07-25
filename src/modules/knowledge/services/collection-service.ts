import { BaseService } from '@/lib/service-base';
import { collectionRepository, type CollectionRepository } from '../repository/collection-repository';
import { NotFoundError } from '@/lib/errors';
import type { KnowledgeCollection } from '../types';
import type { CollectionInput, CollectionUpdate } from '../schemas';

export class CollectionService extends BaseService<KnowledgeCollection, CollectionInput, CollectionUpdate, CollectionRepository> {
  protected entityName = 'Coleção';

  constructor() {
    super(collectionRepository);
  }

  async list(): Promise<KnowledgeCollection[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<KnowledgeCollection> {
    const c = await this.repository.findById(id);
    if (!c) throw new NotFoundError('Coleção', id);
    return c;
  }

  async create(input: CollectionInput): Promise<KnowledgeCollection> {
    return this.repository.create(input);
  }

  async update(id: string, input: CollectionUpdate): Promise<KnowledgeCollection> {
    await this.get(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    await this.get(id);
    return this.repository.delete(id);
  }

  async restore(id: string): Promise<KnowledgeCollection> {
    return this.repository.restore(id);
  }
}

export const collectionService = new CollectionService();
