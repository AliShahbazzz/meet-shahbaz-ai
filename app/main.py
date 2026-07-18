from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import BackgroundTasks, FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from app.rag import stream_rag
from app.schemas import ChatRequest
from app.document_loader import DOCUMENT_PATH, load_and_split_document
from app.vector_store import index_documents, get_vector_store
from app.run_sanity_check import run_sanity_check
from app.sheets import log_question
from app.retriever import retrieve_with_scores

@asynccontextmanager
async def lifespan(app: FastAPI):
    get_vector_store()
    yield

app = FastAPI(title="Basic RAG API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://alishahbazzz.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(log_question, request.message)

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

@app.post("/documents/reindex")
async def reindex_document(file: UploadFile = File(...)):
    content = await file.read()
    Path(DOCUMENT_PATH).write_bytes(content)

    count = index_documents()

    return {
        "message": "Document reindexed successfully",
        "chunks": count,
    }


@app.get("/debug/search")
def debug_search(query: str):

    results = retrieve_with_scores(query)

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