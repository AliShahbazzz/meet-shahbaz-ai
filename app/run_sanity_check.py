from app.embeddings import embeddings
from app.vector_store import vector_store  # or wherever you instantiate it
from app.document_loader import load_and_split_document


def run_sanity_check():
    # Make sure the index actually has your data
    chunks = load_and_split_document()
    print(f"Loaded {len(chunks)} chunks\n")

    test_queries = [
        "What frontend frameworks does he know?",
        "How many years of experience does he have?",
        "What did he do at zotok.ai?",
        "What is his contact email?",
        "Does he have experience with AWS?",
    ]

    for query in test_queries:
        print(f"Query: {query}")
        results = vector_store.similarity_search_with_score(query, k=2)

        for doc, score in results:
            role = doc.metadata.get("role", doc.metadata.get("section", "N/A"))
            preview = doc.page_content[:120].replace("\n", " ")
            print(f"  score={score:.4f} | section={role}")
            print(f"    → {preview}...")
        print()