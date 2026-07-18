# meet-shahbaz-ai

An AI chatbot that answers questions about Shahbaz's background, in first person, grounded in his resume.

## Tech Stack

### Frontend (`client/`)
- **React 19** + **TypeScript**, bundled with **Vite**.
- **@assistant-ui/react** for the chat UI, with `@assistant-ui/react-markdown` + `remark-gfm` for rendering markdown (bullets, bold, links) in responses.

### Backend (`app/`)
- **FastAPI** serving the API, containerized with **Docker** (`python:3.13-slim`, dependencies managed via `uv`).
- **LangChain** for orchestration (prompting, text splitting, retrieval).
- **Groq** (`llama-3.1-8b-instant` via `langchain-groq`) as the LLM.
- **ChromaDB** (via `langchain-chroma`) as the vector store, persisted to `data/chroma_db`.
- **FastEmbed** (`BAAI/bge-small-en-v1.5`) for local embeddings.
- **rank-bm25** for lexical search, combined with the vector store in an ensemble retriever.
- **fastembed's cross-encoder** (`Xenova/ms-marco-MiniLM-L-6-v2`) for reranking retrieved chunks.
- A Google Apps Script webhook receives every chat question and logs it to a Google Sheet in the background.

## RAG Implementation

1. **Source document**: a single markdown resume (`documents/syed-shahbaz-ali.md`) is the sole knowledge source.
2. **Chunking**: the document is first split by markdown headers (title/section/subsection/role) so each chunk keeps its structural context, then further capped to ~1000 characters with overlap so nothing is too large for the embedding model.
3. **Indexing**: chunks are embedded with FastEmbed and stored in a Chroma collection. Re-indexing (via file upload) deletes the previous chunks for that source before adding the new ones, so updates replace rather than duplicate.
4. **Retrieval** (`app/retriever.py`): for each question, candidates are pulled from two retrievers in parallel — a BM25 keyword retriever and the Chroma vector retriever — combined via an `EnsembleRetriever`. The combined candidates are then reranked with a cross-encoder, and only the top results are kept, which improves relevance over using either retriever alone.
5. **Generation** (`app/rag.py`): the top reranked chunks are joined as context and passed, along with the question, into a prompt that instructs the model to answer in Shahbaz's own first-person voice, stay grounded strictly in the provided context, and format answers appropriately (e.g. bullet points for multi-item answers like skills or work history). The response streams back token-by-token over NDJSON, including the source chunks used.
