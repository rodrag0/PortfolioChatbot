import { NextResponse } from 'next/server';
import { getDb, listSources } from '@/app/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const db = getDb();
  const sources = listSources(db);
  return NextResponse.json({ sources });
}
