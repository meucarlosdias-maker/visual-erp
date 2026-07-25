import { BaseRepository } from '@/lib/repository-base';
import type { KnowledgeCollection } from '../types';
import type { CollectionInput, CollectionUpdate } from '../schemas';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockCollections: KnowledgeCollection[] = [
  {
    id: 'kc-001', companyId: COMPANY_ID, name: 'Comercial',
    description: 'Materiais e procedimentos comerciais', active: true,
    documents: [], createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'kc-002', companyId: COMPANY_ID, name: 'Produção',
    description: 'Manuais e procedimentos de produção', active: true,
    documents: [], createdAt: new Date('2026-07-02'), updatedAt: new Date('2026-07-02'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'kc-003', companyId: COMPANY_ID, name: 'Financeiro',
    description: 'Normas e procedimentos financeiros', active: true,
    documents: [], createdAt: new Date('2026-07-05'), updatedAt: new Date('2026-07-05'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class CollectionRepository extends BaseRepository<KnowledgeCollection, CollectionInput, CollectionUpdate> {
  async findAll(): Promise<KnowledgeCollection[]> {
    return mockCollections
      .filter((c) => !c.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<KnowledgeCollection | null> {
    return mockCollections.find((c) => c.id === id && !c.deletedAt) ?? null;
  }

  async findMany(filter: Partial<KnowledgeCollection>): Promise<KnowledgeCollection[]> {
    return mockCollections.filter((c) => {
      if (c.deletedAt) return false;
      return Object.entries(filter).every(([key, value]) =>
        (c as unknown as Record<string, unknown>)[key] === value
      );
    });
  }

  async create(input: CollectionInput): Promise<KnowledgeCollection> {
    const entry: KnowledgeCollection = {
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      name: input.name,
      description: input.description ?? null,
      active: input.active,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
    };
    mockCollections.push(entry);
    return entry;
  }

  async update(id: string, input: CollectionUpdate): Promise<KnowledgeCollection> {
    const idx = mockCollections.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Coleção não encontrada');
    mockCollections[idx] = { ...mockCollections[idx], ...input, updatedAt: new Date() };
    return mockCollections[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockCollections.findIndex((c) => c.id === id);
    if (idx !== -1) {
      mockCollections[idx] = { ...mockCollections[idx], deletedAt: new Date(), active: false };
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<KnowledgeCollection> {
    const idx = mockCollections.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Coleção não encontrada');
    mockCollections[idx] = { ...mockCollections[idx], deletedAt: null, active: true };
    return mockCollections[idx];
  }
}

export const collectionRepository = new CollectionRepository();
