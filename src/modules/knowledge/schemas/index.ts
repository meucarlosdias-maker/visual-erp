import { z } from 'zod/v4';

export const collectionSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export type CollectionInput = z.infer<typeof collectionSchema>;

export const collectionUpdateSchema = collectionSchema.partial();

export type CollectionUpdate = z.infer<typeof collectionUpdateSchema>;

export const documentSchema = z.object({
  collectionId: z.string(),
  title: z.string().min(1, 'Título é obrigatório'),
  fileName: z.string().min(1, 'Nome do arquivo é obrigatório'),
  fileType: z.string(),
  fileSize: z.number().int().default(0),
  source: z.string().default('upload'),
  status: z.string().default('pending'),
});

export type DocumentInput = z.infer<typeof documentSchema>;

export const documentUpdateSchema = documentSchema.partial();

export type DocumentUpdate = z.infer<typeof documentUpdateSchema>;

export const chunkSchema = z.object({
  documentId: z.string(),
  chunkIndex: z.number().int().min(0),
  content: z.string().min(1),
  tokens: z.number().int().default(0),
});

export type ChunkInput = z.infer<typeof chunkSchema>;

export const searchSchema = z.object({
  query: z.string().min(1, 'Consulta é obrigatória'),
  collectionIds: z.array(z.string()).optional(),
  type: z.enum(['fulltext', 'vector', 'hybrid']).default('fulltext'),
  limit: z.number().int().min(1).max(100).default(10),
});

export type SearchInput = z.infer<typeof searchSchema>;
