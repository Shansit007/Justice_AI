from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever

model = OllamaLLM(model="llama3.2")

template = """
You are an expert crime lawyer and judge.

If the user input is NOT a legal case (like "hi", "hello", "hey"):
→ Respond politely and ask the user to provide a legal case description.

If it is a legal case:
1. Identify relevant legal principles
2. Apply them to the case
3. Give two clear judgments:
   - Found guilty
   - Found innocent
4. Give likelihood of guilt
5. Suggest advice from a lawyer’s perspective

Relevant laws and cases:
{laws}

Case:
{question}

Answer:
"""

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model


# ✅ NEW FUNCTION (IMPORTANT)
def get_legal_response(question):

    # 🔍 Retrieve relevant docs
    retrieved_docs = retriever.invoke(question)[:2]

    laws_text = "\n\n".join([
        f"[Source: {doc.metadata.get('source', 'unknown')}]\n{doc.page_content}"
        for doc in retrieved_docs
    ])

    # 🤖 Generate response
    result = chain.invoke({
        "laws": laws_text,
        "question": question
    })

    return result