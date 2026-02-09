# Portfolio Chat

A production-ready Next.js 14 app that lets recruiters chat with an AI assistant grounded in your curated portfolio documents.

## Features
- Next.js 14 (App Router) + TypeScript + TailwindCSS.
- Retrieval-Augmented Generation (RAG) using local SQLite and OpenAI embeddings.
- Strict evidence mode with citations per paragraph.
- Rate limiting + spam filtering guardrails.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file:
   ```bash
   OPENAI_API_KEY=your_key_here
   ```
3. Run the ingestion script to build the local SQLite index:
   ```bash
   npm run ingest
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## How to add or edit docs
- Update markdown files inside the `/knowledge` directory.
- Re-run `npm run ingest` to update embeddings.

## Deployment (Vercel)
1. Commit your updates, including the latest knowledge docs.
2. Ensure the build step runs `npm run ingest` (use a Vercel build command like `npm run ingest && npm run build`).
3. Set `OPENAI_API_KEY` in Vercel environment variables.

**Note:** The app uses `better-sqlite3` (native module) and the Node.js runtime for API routes. Ensure Vercel uses the Node runtime (default) and not Edge for these routes.

## Example questions
- “Which projects show my API design experience?”
- “Summarize my experience with data visualization.”
- “What outcomes did I deliver on Project Rosa?”

## Scripts
- `npm run dev` — Start the dev server.
- `npm run build` — Build the app.
- `npm run start` — Start the production server.
- `npm run ingest` — Embed and ingest markdown files into SQLite.
- `npm run test` — Run unit tests.
- `npm run lint` — Lint with Next.js ESLint rules.
- `npm run format` — Check formatting with Prettier.
