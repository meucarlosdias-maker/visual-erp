import { BaseService } from '@/lib/service-base';
import { documentRepository, type DocumentRepository } from '../repository/document-repository';
import { NotFoundError } from '@/lib/errors';
import type { KnowledgeDocument } from '../types';
import type { DocumentInput, DocumentUpdate } from '../schemas';

export class DocumentService extends BaseService<KnowledgeDocument, DocumentInput, DocumentUpdate, DocumentRepository> {
  protected entityName = 'Documento';

  constructor() {
    super(documentRepository);
  }

  async list(): Promise<KnowledgeDocument[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<KnowledgeDocument> {
    const d = await this.repository.findById(id);
    if (!d) throw new NotFoundError('Documento', id);
    return d;
  }

  async create(input: DocumentInput): Promise<KnowledgeDocument> {
    return this.repository.create(input);
  }

  async update(id: string, input: DocumentUpdate): Promise<KnowledgeDocument> {
    await this.get(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    await this.get(id);
    return this.repository.delete(id);
  }

  async restore(id: string): Promise<KnowledgeDocument> {
    return this.repository.restore(id);
  }

  async findByCollection(collectionId: string): Promise<KnowledgeDocument[]> {
    return this.repository.findByCollection(collectionId);
  }
}

export const documentService = new DocumentService();
