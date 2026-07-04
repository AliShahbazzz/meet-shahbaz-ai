from langchain_core.prompts import ChatPromptTemplate

from app.llm import llm
from app.vector_store import vector_store


prompt = ChatPromptTemplate.from_template("""
You are a precise question-answering assistant.

Answer the question using only the provided context.

Rules:
- Answer directly and concisely.
- Do not add background information unless necessary.
- Do not repeat the question.
- Do not mention the context or document.
- Prefer 1-3 sentences.
- If the question asks for a list, return only the relevant items.
- If the answer is not available, say exactly:
  "I don't know based on the provided document."

Context:
{context}

Question:
{question}

Answer:
""")


def ask_rag(question: str) -> str:
    documents = vector_store.similarity_search(
        question,
        k=2,
    )

    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    chain = prompt | llm

    response = chain.invoke({
        "context": context,
        "question": question,
    })

    return response.content