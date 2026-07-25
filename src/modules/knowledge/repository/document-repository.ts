import { BaseRepository } from '@/lib/repository-base';
import type { KnowledgeDocument } from '../types';
import type { DocumentInput, DocumentUpdate } from '../schemas';

const mockDocuments: KnowledgeDocument[] = [
  {
    id: 'kd-001', collectionId: 'kc-001',
    title: 'Manual de Vendas', fileName: 'manual-vendas.pdf', fileType: 'pdf',
    fileSize: 1024000, source: 'upload', status: 'indexed',
    chunks: [], createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'kd-002', collectionId: 'kc-002',
    title: 'Procedimento de Produção', fileName: 'proc-producao.md', fileType: 'markdown',
    fileSize: 256000, source: 'upload', status: 'indexed',
    chunks: [], createdAt: new Date('2026-07-03'), updatedAt: new Date('2026-07-03'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class DocumentRepository extends BaseRepository<KnowledgeDocument, DocumentInput, DocumentUpdate> {
  async findAll(): Promise<KnowledgeDocument[]> {
    return [...mockDocuments]
      .filter((d) => !d.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<KnowledgeDocument | null> {
    return mockDocuments.find((d) => d.id === id && !d.deletedAt) ?? null;
  }

  async findMany(filter: Partial<KnowledgeDocument>): Promise<KnowledgeDocument[]> {
    return mockDocuments.filter((d) => {
      if (d.deletedAt) return false;
      return Object.entries(filter).every(([key, value]) =>
        (d as unknown as Record<string, unknown>)[key] === value
      );
    });
  }

  async create(input: DocumentInput): Promise<KnowledgeDocument> {
    const entry: KnowledgeDocument = {
      id: crypto.randomUUID(),
      collectionId: input.collectionId,
      title: input.title,
      fileName: input.fileName,
      fileType: input.fileType,
      fileSize: input.fileSize,
      source: input.source,
      status: input.status,
      chunks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
    };
    mockDocuments.push(entry);
    return entry;
  }

  async update(id: string, input: DocumentUpdate): Promise<KnowledgeDocument> {
    const idx = mockDocuments.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Documento não encontrado');
    mockDocuments[idx] = { ...mockDocuments[idx], ...input, updatedAt: new Date() };
    return mockDocuments[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockDocuments.findIndex((d) => d.id === id);
    if (idx !== -1) {
      mockDocuments[idx] = { ...mockDocuments[idx], deletedAt: new Date() };
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<KnowledgeDocument> {
    const idx = mockDocuments.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Documento não encontrado');
    mockDocuments[idx] = { ...mockDocuments[idx], deletedAt: null };
    return mockDocuments[idx];
  }

  async findByCollection(collectionId: string): Promise<KnowledgeDocument[]> {
    return mockDocuments.filter((d) => d.collectionId === collectionId && !d.deletedAt);
  }
}

export const documentRepository = new DocumentRepository();
