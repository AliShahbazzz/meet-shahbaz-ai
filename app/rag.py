from langchain_core.prompts import ChatPromptTemplate
from collections.abc import Iterator
from app.llm import llm
from app.vector_store import vector_store


prompt = ChatPromptTemplate.from_template("""
You are a precise question-answering assistant.

Answer the question using only the provided context.

Rules:
- Answer more descriptive.
- Try to add more related info than being concise.
- Do not add background information unless necessary.
- Do not repeat the question.
- Do not mention the context or document.
- Prefer 3-5 sentences and bullet points.
- If the question asks for a list, return only the relevant items.
- If the answer is not available, say exactly:
  "I don't know based on the provided document."

Context:
{context}

Question:
{question}

Answer:
""")


def stream_rag(question: str) -> Iterator[str]:
    documents = vector_store.similarity_search(
        question,
        k=5,
    )

    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    chain = prompt | llm

    for chunk in chain.stream({
        "context": context,
        "question": question,
    }):
        if chunk.content:
            yield str(chunk.content)