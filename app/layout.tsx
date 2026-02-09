import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio Chat',
  description: 'Chat with an AI assistant grounded in curated portfolio documents.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Portfolio Chat</p>
              <h1 className="text-3xl font-semibold">AI Portfolio Assistant</h1>
            </div>
            <nav className="flex gap-4 text-sm text-slate-300">
              <a className="hover:text-white" href="/">
                Chat
              </a>
              <a className="hover:text-white" href="/sources">
                Sources
              </a>
              <a className="hover:text-white" href="/how-it-works">
                How it works
              </a>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500">
            Built with Next.js + OpenAI. Only curated portfolio sources are used.
          </footer>
        </div>
      </body>
    </html>
  );
}
