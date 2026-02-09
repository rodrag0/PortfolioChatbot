import fs from 'fs';
import path from 'path';
import { ensureSchema, getDb } from '@/app/lib/db';
import { chunkMarkdown } from '@/app/lib/rag';
import { openaiClient, EMBEDDING_MODEL } from '@/app/lib/openai';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge');

type ChunkRecord = {
  docPath: string;
  heading: string;
  content: string;
  contentHash: string;
};

function listMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function embedChunk(content: string) {
  const response = await openaiClient.embeddings.create({
    model: EMBEDDING_MODEL,
    input: content
  });
  return response.data[0]?.embedding ?? [];
}

async function ingest() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY.');
  }

  const db = getDb();
  ensureSchema(db);

  const markdownFiles = listMarkdownFiles(KNOWLEDGE_DIR);
  const allChunks: ChunkRecord[] = [];

  for (const filePath of markdownFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const markdown = fs.readFileSync(filePath, 'utf-8');
    const chunks = chunkMarkdown(relativePath, markdown);
    allChunks.push(
      ...chunks.map((chunk) => ({
        docPath: chunk.docPath,
        heading: chunk.heading,
        content: chunk.content,
        contentHash: chunk.contentHash
      }))
    );
  }

  const existingRows = db
    .prepare('SELECT id, doc_path as docPath, content_hash as contentHash FROM chunks')
    .all() as { id: number; docPath: string; contentHash: string }[];

  const existingMap = new Map(
    existingRows.map((row) => [`${row.docPath}:${row.contentHash}`, row.id])
  );
  const incomingMap = new Set(allChunks.map((chunk) => `${chunk.docPath}:${chunk.contentHash}`));

  const removeStmt = db.prepare('DELETE FROM chunks WHERE id = ?');
  const insertStmt = db.prepare(
    'INSERT INTO chunks (doc_path, heading, content, content_hash, embedding, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  );

  db.transaction(() => {
    for (const row of existingRows) {
      if (!incomingMap.has(`${row.docPath}:${row.contentHash}`)) {
        removeStmt.run(row.id);
      }
    }
  })();

  for (const chunk of allChunks) {
    const key = `${chunk.docPath}:${chunk.contentHash}`;
    if (existingMap.has(key)) continue;
    const embedding = await embedChunk(chunk.content);
    insertStmt.run(
      chunk.docPath,
      chunk.heading,
      chunk.content,
      chunk.contentHash,
      JSON.stringify(embedding),
      new Date().toISOString()
    );
  }

  console.log(`Ingested ${allChunks.length} chunks from ${markdownFiles.length} documents.`);
}

void ingest();
