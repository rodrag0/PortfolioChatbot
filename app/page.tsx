import ChatPanel from './components/ChatPanel';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg">
        <h2 className="text-2xl font-semibold">Portfolio Chat</h2>
        <p className="mt-2 text-sm text-slate-300">
          Recruiters can ask questions about my experience, projects, and skills. The assistant is
          grounded exclusively in curated portfolio documents and returns citations for every claim.
        </p>
      </section>
      <ChatPanel />
    </div>
  );
}
