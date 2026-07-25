import type { ChunkConfig, DocumentChunk } from '../types';

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function chunkByFixedSize(content: string, config: ChunkConfig): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < content.length) {
    const end = Math.min(start + config.maxSize, content.length);
    chunks.push(content.slice(start, end));
    start += config.maxSize - config.overlap;
    if (start >= content.length) break;
  }
  return chunks;
}

function chunkByParagraph(content: string, config: ChunkConfig): string[] {
  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const p of paragraphs) {
    if ((current + p).length > config.maxSize && current.length > 0) {
      chunks.push(current.trim());
      current = p;
    } else {
      current += (current ? '\n\n' : '') + p;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function chunkBySentence(content: string, config: ChunkConfig): string[] {
  const sentences = content.match(/[^.!?\n]+[.!?\n]*/g) ?? [content];
  const chunks: string[] = [];
  let current = '';
  for (const s of sentences) {
    if ((current + s).length > config.maxSize && current.length > 0) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function chunkByMarkdown(content: string, config: ChunkConfig): string[] {
  const sections = content.split(/(?=^#{1,3}\s)/m).filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const section of sections) {
    if ((current + section).length > config.maxSize && current.length > 0) {
      chunks.push(current.trim());
      current = section;
    } else {
      current += section;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

export function chunkDocument(
  documentId: string,
  content: string,
  config: ChunkConfig,
): DocumentChunk[] {
  let rawChunks: string[];

  switch (config.strategy) {
    case 'fixed':
      rawChunks = chunkByFixedSize(content, config);
      break;
    case 'paragraph':
      rawChunks = chunkByParagraph(content, config);
      break;
    case 'sentence':
      rawChunks = chunkBySentence(content, config);
      break;
    case 'markdown':
      rawChunks = chunkByMarkdown(content, config);
      break;
    case 'hybrid':
      rawChunks = chunkByParagraph(content, config);
      if (rawChunks.length <= 1) {
        rawChunks = chunkByFixedSize(content, config);
      }
      break;
    default:
      rawChunks = chunkByFixedSize(content, config);
  }

  return rawChunks.map((chunk, index) => ({
    id: '',
    documentId,
    chunkIndex: index,
    content: chunk.trim(),
    tokens: estimateTokens(chunk),
  }));
}

export function getDefaultChunkConfig(): ChunkConfig {
  return {
    strategy: 'paragraph',
    maxSize: 2048,
    overlap: 128,
  };
}
