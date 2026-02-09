import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export type ChunkRow = {
  id: number;
  doc_path: string;
  heading: string;
  content: string;
  content_hash: string;
  embedding: string;
  updated_at: string;
};

export type SourceSummary = {
  docPath: string;
  chunkCount: number;
  lastIngestedAt: string | null;
};

const DB_PATH = path.join(process.cwd(), 'data', 'portfolio.sqlite');

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    dbInstance = new Database(DB_PATH);
    ensureSchema(dbInstance);
  }
  return dbInstance;
}

export function ensureSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS chunks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doc_path TEXT NOT NULL,
      heading TEXT NOT NULL,
      content TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      embedding TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_chunks_doc_path ON chunks(doc_path);
  `);
}

export function listChunks(db: Database.Database): ChunkRow[] {
  return db.prepare('SELECT * FROM chunks ORDER BY doc_path, id').all() as ChunkRow[];
}

export function listSources(db: Database.Database): SourceSummary[] {
  const rows = db
    .prepare(
      `
      SELECT doc_path as docPath,
             COUNT(*) as chunkCount,
             MAX(updated_at) as lastIngestedAt
      FROM chunks
      GROUP BY doc_path
      ORDER BY doc_path
    `
    )
    .all() as SourceSummary[];
  return rows;
}
