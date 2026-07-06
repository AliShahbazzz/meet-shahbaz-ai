from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from app.vector_store import vector_store
from app.rag import stream_rag
from app.schemas import ChatRequest
from app.document_loader import load_and_split_document
from app.vector_store import index_documents, vector_store
from app.run_sanity_check import run_sanity_check

app = FastAPI(title="Basic RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(request: ChatRequest):
    return StreamingResponse(
        stream_rag(request.message),
        media_type="application/x-ndjson",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )

@app.get("/documents/chunks")
def get_document_chunks():
    chunks = load_and_split_document()

    return {
        "count": len(chunks),
        "chunks": [
            {
                "content": chunk.page_content,
                "metadata": chunk.metadata,
            }
            for chunk in chunks
        ],
    }

@app.post("/documents/index")
def index_pdf():
    count = index_documents()

    return {
        "message": "Document indexed successfully",
        "chunks": count,
    }


@app.get("/debug/search")
def debug_search(query: str):

    results = vector_store.similarity_search_with_score(
        query,
        k=5,
    )

    return {
        "query": query,
        "results": [
            {
                "content": document.page_content,
                "metadata": document.metadata,
                "score": score,
            }
            for document, score in results
        ],
    }

@app.post("/sanity-check")
def index_pdf():
    run_sanity_check()

    return True