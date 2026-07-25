export interface KnowledgeCollection {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  active: boolean;
  documents: KnowledgeDocument[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface KnowledgeDocument {
  id: string;
  collectionId: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  source: string;
  status: string;
  chunks: KnowledgeChunk[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  embeddingId: string | null;
  tokens: number;
  createdAt: Date;
}

export interface KnowledgeSearch {
  id: string;
  userId: string | null;
  query: string;
  results: number;
  executionTime: number;
  createdAt: Date;
}
