import type { IngestionPipeline, DocumentChunk, IngestionResult } from '../types';
import { chunkDocument, getDefaultChunkConfig } from '../chunking';

export function extractTextFromFile(_fileType: string, _content: Buffer): string {
  throw new Error(
    'Extração de texto não implementada. Suporte planejado para: PDF, DOCX, XLSX, TXT, Markdown.',
  );
}

export function extractTextFromString(_fileType: string, content: string): string {
  return content;
}

export async function processIngestion(pipeline: IngestionPipeline): Promise<IngestionResult> {
  const config = getDefaultChunkConfig();
  const content = extractTextFromString(pipeline.fileType, pipeline.content);
  const chunks = chunkDocument(pipeline.documentId, content, config);
  const totalTokens = chunks.reduce((sum, c) => sum + c.tokens, 0);

  return {
    documentId: pipeline.documentId,
    chunks,
    totalTokens,
    chunkCount: chunks.length,
  };
}
