import pymupdf4llm

from langchain_core.documents import Document
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


PDF_PATH = "documents/syed-shahbaz-ali.pdf"


def load_and_split_pdf() -> list[Document]:
    markdown = pymupdf4llm.to_markdown(PDF_PATH)

    header_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=[
            ("#", "title"),
            ("##", "section"),
            ("###", "subsection"),
            ("####", "role"),
        ],
        strip_headers=False,
    )

    header_chunks = header_splitter.split_text(markdown)

    # Only drop genuinely empty chunks, not ones missing a "section" key
    header_chunks = [c for c in header_chunks if c.page_content.strip()]

    # Second pass: cap chunk size so nothing is too large for the embedding model
    size_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150,
    )
    chunks = size_splitter.split_documents(header_chunks)

    for chunk in chunks:
        chunk.metadata["source"] = PDF_PATH

    return chunks