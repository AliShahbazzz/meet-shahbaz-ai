from langchain_chroma import Chroma

from app.embeddings import embeddings
from app.document_loader import load_and_split_document


vector_store = Chroma(
    collection_name="personal_documents",
    embedding_function=embeddings,
    persist_directory="./data/chroma_db",
)


def index_documents():
    chunks = load_and_split_document()

    vector_store.add_documents(chunks)

    return len(chunks)