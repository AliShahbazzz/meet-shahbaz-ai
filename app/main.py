from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from app.rag import stream_rag
from app.schemas import ChatRequest, ChatResponse
from app.document_loader import load_and_split_pdf
from app.vector_store import index_documents
from app.run_sanity_check import run_sanity_check

app = FastAPI(title="Basic RAG API")


@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(request: ChatRequest):
    return StreamingResponse(
        stream_rag(request.message),
        media_type="text/plain",
    )

@app.get("/documents/chunks")
def get_document_chunks():
    chunks = load_and_split_pdf()

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

from app.vector_store import vector_store


@app.get("/debug/search")
def debug_search(query: str):

    run_sanity_check()

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