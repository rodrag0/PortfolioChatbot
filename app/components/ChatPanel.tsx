'use client';

import { useMemo, useState } from 'react';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
};

const suggestedPrompts = [
  'What projects best showcase my API work?',
  'Summarize my experience with data visualization.',
  'What skills am I strongest in based on my portfolio?'
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [strictEvidence, setStrictEvidence] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasMessages = messages.length > 0;

  const suggested = useMemo(
    () => suggestedPrompts.filter((prompt) => !messages.some((msg) => msg.content === prompt)),
    [messages]
  );

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    setError(null);
    setIsLoading(true);
    const nextMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content
    };
    setMessages((prev) => [...prev, nextMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: content, strictEvidence })
      });

      if (!response.ok) {
        throw new Error('Unable to reach the assistant.');
      }

      const data = (await response.json()) as {
        answer: string;
        citations: string[];
      };

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer,
        citations: data.citations
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Chat with my portfolio</h2>
            <p className="text-sm text-slate-400">
              Answers are grounded in curated documents only.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 accent-emerald-400"
              checked={strictEvidence}
              onChange={(event) => setStrictEvidence(event.target.checked)}
            />
            Strict Evidence Mode
          </label>
        </div>

        <div className="flex flex-col gap-4">
          {!hasMessages ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
              Ask a question about my projects, skills, or experience. The assistant will cite
              portfolio sources for every claim.
            </div>
          ) : (
            <div className="flex max-h-[420px] flex-col gap-4 overflow-y-auto pr-2">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`rounded-xl border p-4 text-sm shadow-sm ${
                    message.role === 'user'
                      ? 'border-slate-700 bg-slate-950/70'
                      : 'border-emerald-500/40 bg-emerald-500/10'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  {message.citations && message.citations.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-emerald-200">
                      {message.citations.map((citation) => (
                        <span
                          key={citation}
                          className="rounded-full border border-emerald-400/40 px-2 py-1"
                        >
                          {citation}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about projects, skills, or outcomes..."
              rows={3}
              className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-100 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow"
            >
              {isLoading ? 'Thinking...' : 'Send message'}
            </button>
          </form>
        </div>
      </div>

      <aside className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        <h3 className="text-lg font-semibold">Suggested prompts</h3>
        <p className="text-sm text-slate-400">
          Click a prompt to populate the chat input.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {suggested.map((prompt) => (
            <button
              type="button"
              key={prompt}
              onClick={() => setInput(prompt)}
              className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-left text-sm text-slate-200 transition hover:border-emerald-400/50"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="mt-6 text-xs text-slate-500">
          <p className="font-semibold text-slate-300">Links</p>
          <ul className="mt-2 space-y-1">
            <li>
              <a className="hover:text-white" href="https://github.com/your-handle">
                GitHub (placeholder)
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="https://linkedin.com/in/your-handle">
                LinkedIn (placeholder)
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  );
}
