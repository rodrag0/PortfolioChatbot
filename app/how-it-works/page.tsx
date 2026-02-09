export default function HowItWorksPage() {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
      <div>
        <h2 className="text-2xl font-semibold">How it works</h2>
        <p className="mt-2 text-sm text-slate-400">
          The assistant uses Retrieval-Augmented Generation (RAG) to stay grounded in your portfolio
          documents.
        </p>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-emerald-200">
        {`User question
     │
     ▼
Embed question → Similarity search in SQLite → Top chunks
     │
     ▼
System prompt + context → OpenAI model → Answer + citations`}
      </pre>
      <div className="grid gap-4 text-sm text-slate-300">
        <div>
          <h3 className="font-semibold text-slate-100">RAG flow</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Markdown documents are chunked by headings and embedded.</li>
            <li>Each question is embedded and matched via cosine similarity.</li>
            <li>The model only sees the top-ranked chunks and must cite them.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">Safety measures</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Strict Evidence Mode enforces citations per paragraph.</li>
            <li>Guardrails refuse unsupported questions or sensitive requests.</li>
            <li>Prompt injection is blocked by overriding instructions.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
