from fastapi import FastAPI

from app.rag import ask_rag
from app.schemas import ChatRequest, ChatResponse
from app.document_loader import load_and_split_pdf
from app.vector_store import index_documents

app = FastAPI(title="Basic RAG API")


@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    answer = ask_rag(request.message)

    return ChatResponse(answer=answer)

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