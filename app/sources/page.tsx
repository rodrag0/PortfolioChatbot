import { getDb, listSources } from '@/app/lib/db';

export const runtime = 'nodejs';

export default function SourcesPage() {
  const db = getDb();
  const sources = listSources(db);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
      <h2 className="text-2xl font-semibold">Portfolio Sources</h2>
      <p className="mt-2 text-sm text-slate-400">
        These documents are ingested into the local SQLite vector store.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/70 text-slate-300">
            <tr>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Chunks</th>
              <th className="px-4 py-3">Last ingested</th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={3}>
                  No sources yet. Run the ingestion script to populate the database.
                </td>
              </tr>
            ) : (
              sources.map((source) => (
                <tr key={source.docPath} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-slate-100">{source.docPath}</td>
                  <td className="px-4 py-3 text-slate-300">{source.chunkCount}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {source.lastIngestedAt ? new Date(source.lastIngestedAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
