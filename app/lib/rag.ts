import crypto from 'crypto';

export type Chunk = {
  docPath: string;
  heading: string;
  content: string;
  contentHash: string;
};

export type EmbeddedChunk = Chunk & {
  embedding: number[];
};

export type RankedChunk = EmbeddedChunk & {
  score: number;
};

const MAX_CHUNK_CHARS = 1200;
const CHUNK_OVERLAP = 200;

export function chunkMarkdown(docPath: string, markdown: string): Chunk[] {
  const lines = markdown.split(/\r?\n/);
  const sections: { heading: string; content: string }[] = [];
  let currentHeading = 'Introduction';
  let currentContent: string[] = [];

  const flushSection = () => {
    if (currentContent.length === 0) return;
    sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() });
    currentContent = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushSection();
      currentHeading = headingMatch[2].trim();
      continue;
    }
    currentContent.push(line);
  }
  flushSection();

  const chunks: Chunk[] = [];

  for (const section of sections) {
    const content = section.content.trim();
    if (!content) continue;
    let start = 0;
    while (start < content.length) {
      const end = Math.min(start + MAX_CHUNK_CHARS, content.length);
      const slice = content.slice(start, end).trim();
      if (slice.length > 0) {
        chunks.push({
          docPath,
          heading: section.heading,
          content: slice,
          contentHash: hashContent(`${docPath}:${section.heading}:${slice}`)
        });
      }
      if (end === content.length) break;
      start = Math.max(end - CHUNK_OVERLAP, 0);
    }
  }

  return chunks;
}

export function hashContent(content: string) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function cosineSimilarity(a: number[], b: number[]) {
  if (a.length !== b.length) {
    throw new Error('Embedding vectors must be the same length.');
  }
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    aNorm += a[i] * a[i];
    bNorm += b[i] * b[i];
  }
  if (aNorm === 0 || bNorm === 0) return 0;
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
}

export function rankChunks(chunks: EmbeddedChunk[], queryEmbedding: number[], topK = 5) {
  const ranked: RankedChunk[] = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(chunk.embedding, queryEmbedding)
  }));
  return ranked.sort((a, b) => b.score - a.score).slice(0, topK);
}

export function formatCitation(docPath: string, heading: string) {
  return `[source: ${docPath}#${heading}]`;
}

export function buildContext(chunks: RankedChunk[]) {
  return chunks
    .map((chunk, index) => {
      return `Source ${index + 1}: ${formatCitation(chunk.docPath, chunk.heading)}\n${chunk.content}`;
    })
    .join('\n\n');
}
