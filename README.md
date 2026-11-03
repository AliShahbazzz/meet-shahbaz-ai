# meet-shahbaz-ai

An AI chatbot that answers questions about Shahbaz's professional background —
in his own first-person voice, grounded strictly in his resume via a hybrid
retrieval-augmented generation (RAG) pipeline. Ask it about his work history,
projects, skills, or how the chatbot itself was built.

## Features

- **First-person, grounded answers** — responses are written as Shahbaz
  himself, using only facts present in the source resume; the model is
  instructed to say so rather than invent details it can't support.
- **Hybrid search + reranking** — combines BM25 keyword search with vector
  similarity search, then reranks candidates with a cross-encoder for more
  relevant context than either method alone.
- **Streaming responses** — answers stream token-by-token over NDJSON, with
  the retrieved source chunks sent up front so the UI can show what grounded
  the answer.
- **Markdown-aware chat UI** — bullets, bold text, and links in responses
  render properly (e.g. work history as linked, dated bullet points; contact
  info reproduced verbatim).
- **Rotating suggested prompts** — a welcome screen and post-answer follow-up
  suggestions cycle through a pool of prompts so the same ones don't repeat
  within a session.
- **Hot-swappable knowledge base** — the resume can be re-uploaded via an API
  endpoint, which re-chunks, re-embeds, and replaces the previous index
  without duplicating entries.
- **Debug/inspection endpoints** — routes to inspect the raw document chunks
  and to run a retrieval query directly and see the ranked results with
  scores, useful for tuning retrieval quality.
- **Question logging** — every incoming chat question is fired to a Google
  Sheets webhook in the background (non-blocking, best-effort) for visibility
  into what people are asking.

## Tech Stack

### Frontend (`client/`)
- **React 19** + **TypeScript**, bundled with **Vite**.
- **@assistant-ui/react** for the chat UI primitives (thread, composer,
  streaming messages), with `@assistant-ui/react-markdown` + `remark-gfm`
  for rendering markdown (bullets, bold, links) in responses.
- Deployed as a static site to **GitHub Pages**.

### Backend (`app/`)
- **FastAPI** serving the API, containerized with **Docker**
  (`python:3.13-slim`, dependencies managed via **uv**), deployed to
  **Google Cloud Run**.
- **LangChain** (`langchain`, `langchain-classic`, `langchain-community`)
  for orchestration — prompting, text splitting, retrieval.
- **Groq** (`openai/gpt-oss-20b` via `langchain-groq`) as the LLM,
  streamed with temperature 0 for consistent, grounded answers.
- **ChromaDB** (via `langchain-chroma`) as the vector store, persisted to
  `data/chroma_db`.
- **FastEmbed** (`BAAI/bge-small-en-v1.5`) for local embeddings — no
  external embedding API calls.
- **rank-bm25** for lexical/keyword search, combined with the vector store
  in a LangChain `EnsembleRetriever`.
- **FastEmbed's cross-encoder** (`Xenova/ms-marco-MiniLM-L-6-v2`) for
  reranking retrieved chunks — same ONNX/fastembed family as the embedding
  model, so no extra `torch`/`sentence-transformers` dependency.
- A **Google Apps Script** webhook receives every chat question and logs it
  to a Google Sheet in the background via `httpx`.

## Folder Structure

```
meet-shahbaz-ai/
├── app/                         # FastAPI backend
│   ├── main.py                  # API routes: /chat, /documents/*, /debug/search, /health
│   ├── rag.py                   # System prompt + streaming answer generation
│   ├── retriever.py             # Hybrid (BM25 + vector) retrieval + cross-encoder reranking
│   ├── vector_store.py          # Chroma vector store setup, indexing/re-indexing
│   ├── document_loader.py       # Markdown header splitting + recursive chunking
│   ├── embeddings.py            # FastEmbed embedding model (cached singleton)
│   ├── llm.py                   # Groq LLM client (cached singleton)
│   ├── sheets.py                 # Fire-and-forget question logging to Google Sheets
│   ├── schemas.py               # Pydantic request/response models
│   └── run_sanity_check.py      # Manual script to sanity-check retrieval quality
├── client/                      # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx              # Chat thread, welcome screen, prompt suggestions
│   │   ├── lib/chat-model.ts    # NDJSON streaming chat adapter for assistant-ui
│   │   └── components/          # Markdown renderer, icon set
│   ├── vite.config.ts
│   └── package.json
├── documents/
│   └── syed-shahbaz-ali.md      # Source resume — the sole knowledge base
├── data/
│   └── chroma_db/                # Persisted Chroma vector store (generated)
├── Dockerfile                    # Backend container image (used by Cloud Run)
├── pyproject.toml / uv.lock      # Backend dependencies (managed by uv)
└── .github/workflows/deploy.yml  # CI: builds client and deploys to GitHub Pages
```

## How It Works

### Indexing (offline / on re-index)
1. **Source document**: a single markdown resume (`documents/syed-shahbaz-ali.md`)
   is the sole knowledge source.
2. **Chunking** (`app/document_loader.py`): the document is first split by
   markdown headers (title/section/subsection/role) so each chunk keeps its
   structural context, then further capped to ~1000 characters with 150
   characters of overlap so nothing is too large for the embedding model.
3. **Embedding + storage** (`app/vector_store.py`): chunks are embedded
   locally with FastEmbed and stored in a Chroma collection persisted to
   `data/chroma_db`. Re-indexing (via file upload) deletes the previous
   chunks for that source before adding the new ones, so updates replace
   rather than duplicate.

### Answering a question (per request)
1. **Retrieval** (`app/retriever.py`): for each question, candidates are
   pulled from two retrievers in parallel — a BM25 keyword retriever and the
   Chroma vector retriever (weighted 0.4/0.6) — combined via LangChain's
   `EnsembleRetriever`. The combined candidates are then reranked with a
   cross-encoder, and only the top 5 are kept, which improves relevance over
   using either retriever alone.
2. **Generation** (`app/rag.py`): the top reranked chunks are joined as
   context and passed, along with the question, into a prompt that
   instructs the model to answer in Shahbaz's own first-person voice, stay
   grounded strictly in the provided context, format multi-item answers as
   bullet points, reproduce contact info/URLs verbatim, and decline
   gracefully (in-character) when asked something unsupported or off-topic.
3. **Streaming**: the response streams back token-by-token over NDJSON as
   three event types — `sources` (the chunks used, sent first), `text-delta`
   (incremental answer tokens), and `done`/`error` — so the frontend can
   render the answer as it arrives.
4. **Logging**: the raw question is sent as a background task to a Google
   Sheets webhook — this never blocks or fails the chat response.

### API Endpoints

| Method | Path                  | Description                                                        |
|--------|-----------------------|----------------------------------------------------------------------|
| GET    | `/health`              | Liveness check.                                                     |
| POST   | `/chat`                | `{ "message": string }` → streamed NDJSON answer.                   |
| GET    | `/documents/chunks`    | Returns every chunk the current document splits into (debugging).   |
| POST   | `/documents/reindex`   | Upload a new resume file; replaces the previous index. Requires an `X-API-Key` header matching `REINDEX_API_KEY`. |
| GET    | `/debug/search?query=` | Runs hybrid retrieval + reranking for a query and returns scores.   |
| POST   | `/sanity-check`        | Runs a fixed set of test queries against the index and prints results. |

## Local Development

**Backend** (requires Python 3.10+ and [uv](https://docs.astral.sh/uv/)):
```bash
uv sync
cp .env.example .env   # set GROQ_API_KEY (and optionally SHEETS_WEBHOOK_URL / SHEETS_WEBHOOK_SECRET)
uv run uvicorn app.main:app --reload --port 8000
```

**Frontend**:
```bash
cd client
npm install
npm run dev   # served at http://localhost:5173, expects the API at VITE_API_BASE_URL
```

### Environment Variables

| Location                     | Variable                 | Purpose                                                   |
|-------------------------------|---------------------------|------------------------------------------------------------|
| `.env` (backend)              | `GROQ_API_KEY`             | Required — auth for the Groq LLM.                          |
| `.env` (backend)              | `SHEETS_WEBHOOK_URL`        | Optional — Google Apps Script webhook to log questions to.  |
| `.env` (backend)              | `SHEETS_WEBHOOK_SECRET`     | Optional — shared secret sent with each webhook call.       |
| `.env` (backend)              | `REINDEX_API_KEY`           | Required to call `/documents/reindex` — sent as the `X-API-Key` header. |
| `client/.env`                 | `VITE_API_BASE_URL`         | Backend base URL used by the frontend (local: `http://127.0.0.1:8000`). |
| `client/.env.production`      | `VITE_API_BASE_URL`         | Backend base URL used in the production build (Cloud Run URL). |

## Deployment

- **Frontend**: `.github/workflows/deploy.yml` runs on every push to `main`
  — it installs dependencies, runs `npm run build` in `client/`, and
  publishes `client/dist` to **GitHub Pages** via GitHub's official Pages
  actions. No manual step required once merged to `main`.
- **Backend**: the `Dockerfile` builds a `python:3.13-slim` image, installs
  dependencies with `uv sync --frozen`, and runs the API with `uvicorn` on
  port 8080. This image is deployed to **Google Cloud Run** (region
  `asia-south1`); CORS on the FastAPI app is restricted to the local dev
  origin (`http://localhost:5173`) and the GitHub Pages origin
  (`https://alishahbazzz.github.io`).

## Example Prompts

- "How did Shahbaz turn raw WhatsApp chats into a searchable AI knowledge base?"
- "What tech stack powers Shahbaz's AI and frontend work?"
- "How did you cut page load times by 70% and bundle size by 45%?"
- "Why did Shahbaz split a growing codebase into a micro-frontend monorepo?"
- "How was this very RAG chatbot actually built, end to end?"
- "What embedding model and search technique powers that WhatsApp AI assistant?"
- "How can I get in touch with Shahbaz directly?"
- "What's the toughest trek or expedition Shahbaz has taken on?"
