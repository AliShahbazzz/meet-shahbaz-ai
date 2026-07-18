from langchain_classic.retrievers import EnsembleRetriever
from langchain_community.retrievers.bm25 import BM25Retriever
from langchain_core.documents import Document
from fastembed.rerank.cross_encoder import TextCrossEncoder

from app.document_loader import load_and_split_document
from app.vector_store import get_vector_store

# Same ONNX/fastembed family as the embedding model already in use —
# no torch or sentence-transformers dependency needed.
_cross_encoder = TextCrossEncoder(model_name="Xenova/ms-marco-MiniLM-L-6-v2")

_CANDIDATE_K = 10
_RERANK_TOP_N = 5


def _build_ensemble_retriever() -> EnsembleRetriever:
    chunks = load_and_split_document()

    bm25_retriever = BM25Retriever.from_documents(chunks)
    bm25_retriever.k = _CANDIDATE_K

    vector_retriever = get_vector_store().as_retriever(
        search_kwargs={"k": _CANDIDATE_K},
    )

    return EnsembleRetriever(
        retrievers=[bm25_retriever, vector_retriever],
        weights=[0.4, 0.6],
    )


_ensemble_retriever = _build_ensemble_retriever()

def retrieve_with_scores(question: str) -> list[tuple[Document, float]]:
    candidates = _ensemble_retriever.invoke(question)

    if not candidates:
        return []

    scores = list(
        _cross_encoder.rerank(
            question,
            [doc.page_content for doc in candidates],
        )
    )

    ranked = sorted(
        zip(candidates, scores),
        key=lambda pair: pair[1],
        reverse=True,
    )

    return ranked[:_RERANK_TOP_N]


def retrieve(question: str) -> list[Document]:
    return [doc for doc, _score in retrieve_with_scores(question)]