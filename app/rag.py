from langchain_core.prompts import ChatPromptTemplate
from collections.abc import Iterator
from app.llm import llm
from app.vector_store import vector_store
import json

prompt = ChatPromptTemplate.from_template("""
You are a precise question-answering assistant.

Answer the question using only the provided context.

Rules:
- Answer directly using only information supported by the provided context.
- Be descriptive enough to fully answer the question.
- Include closely related details when they improve the answer.
- Do not add unrelated background information.
- Do not repeat the question.
- Do not mention the context or document.
- Prefer 3-5 sentences for simple questions.
- Use bullet points when multiple distinct items are relevant.
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
    try:
        documents = vector_store.similarity_search(
            question,
            k=5,
        )

        context = "\n\n".join(
            document.page_content
            for document in documents
        )

        yield json.dumps({
            "type": "sources",
            "sources": [
                {
                    "content": document.page_content,
                    "metadata": document.metadata,
                }
                for document in documents
            ],
        }, ensure_ascii=False) + "\n"

        chain = prompt | llm
        full_response = ""

        for chunk in chain.stream({
            "context": context,
            "question": question,
        }):
            if isinstance(chunk.content, str) and chunk.content:
                full_response += chunk.content

                yield json.dumps({
                    "type": "text-delta",
                    "delta": chunk.content,
                }, ensure_ascii=False) + "\n"

        yield json.dumps({
            "type": "done",
            "response": full_response,
        }, ensure_ascii=False) + "\n"

    except Exception as error:
        yield json.dumps({
            "type": "error",
            "message": str(error),
        }, ensure_ascii=False) + "\n"