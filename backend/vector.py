from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

pdfs = [
    "./data/20240716890312078.pdf",
    "./data/LLM_Case_Dataset_v2.pdf"
]

db_location = "./chroma_langchain_db"


def pdfs_to_sqlite_embeddings(pdf_paths, sqlite_db_path):
    embeddings = OllamaEmbeddings(model="mxbai-embed-large")

    vector_store = Chroma(
        collection_name="pdf_embeddings",
        persist_directory=sqlite_db_path,
        embedding_function=embeddings
    )

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    for pdf_path in pdf_paths:
        loader = PyPDFLoader(pdf_path)
        docs = loader.load()

        chunks = text_splitter.split_documents(docs)

        for chunk in chunks:
            chunk.metadata["source"] = pdf_path

        vector_store.add_documents(chunks)

        print(f"✅ Added embeddings for {pdf_path}")

    print(f"\n📦 Embeddings stored in: {sqlite_db_path}")


# ✅ Only run embedding if DB does NOT exist
if not os.path.exists(db_location) or len(os.listdir(db_location)) == 0:
    print("📥 Creating vector database...")
    pdfs_to_sqlite_embeddings(pdfs, db_location)
else:
    print("✅ Using existing vector database")


# ✅ Load DB
vector_store = Chroma(
    collection_name="pdf_embeddings",
    persist_directory=db_location,
    embedding_function=OllamaEmbeddings(model="mxbai-embed-large")
)

retriever = vector_store.as_retriever(search_kwargs={"k": 15})
