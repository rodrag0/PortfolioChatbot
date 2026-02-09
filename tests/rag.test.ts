import { describe, expect, it } from 'vitest';
import { chunkMarkdown, cosineSimilarity, formatCitation, rankChunks } from '../app/lib/rag';

const sampleMarkdown = `# Heading One
Some content about projects and results.

## Heading Two
More content about another item that is slightly longer to trigger chunking.`;

describe('chunkMarkdown', () => {
  it('splits markdown into chunks with headings', () => {
    const chunks = chunkMarkdown('knowledge/sample.md', sampleMarkdown);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].heading).toBe('Heading One');
    expect(chunks.some((chunk) => chunk.heading === 'Heading Two')).toBe(true);
  });
});

describe('cosineSimilarity', () => {
  it('calculates cosine similarity for vectors', () => {
    const score = cosineSimilarity([1, 0], [1, 0]);
    expect(score).toBeCloseTo(1);
  });
});

describe('rankChunks', () => {
  it('orders chunks by similarity', () => {
    const ranked = rankChunks(
      [
        {
          docPath: 'a',
          heading: 'A',
          content: 'A',
          contentHash: '1',
          embedding: [1, 0]
        },
        {
          docPath: 'b',
          heading: 'B',
          content: 'B',
          contentHash: '2',
          embedding: [0, 1]
        }
      ],
      [1, 0],
      1
    );

    expect(ranked[0].docPath).toBe('a');
  });
});

describe('formatCitation', () => {
  it('formats citations consistently', () => {
    expect(formatCitation('knowledge/resume.md', 'Summary')).toBe(
      '[source: knowledge/resume.md#Summary]'
    );
  });
});
