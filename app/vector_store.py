from functools import lru_cache

from langchain_chroma import Chroma

from app.document_loader import DOCUMENT_PATH, load_and_split_document
from app.embeddings import get_embeddings


@lru_cache(maxsize=1)
def get_vector_store() -> Chroma:
    return Chroma(
        collection_name="personal_documents",
        embedding_function=get_embeddings(),
        persist_directory="./data/chroma_db",
    )


def index_documents():
    chunks = load_and_split_document()

    vector_store = get_vector_store()
    vector_store.delete(where={"source": DOCUMENT_PATH})
    vector_store.add_documents(chunks)

    return len(chunks)