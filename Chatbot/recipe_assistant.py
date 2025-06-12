import os
import pandas as pd
from dotenv import load_dotenv

from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# === Load API Key ===
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# === Load Recipe Data ===
doc_path = "data/food_recipes.csv"
df = pd.read_csv(doc_path, encoding='utf-8', nrows=200)

documents = [
    Document(
        page_content=f"Title: {row['recipe_title']}\nIngredients: {row['ingredients']}\nInstructions: {row['instructions']}"
    )
    for _, row in df.iterrows()
]

# === Text Splitting ===
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(documents)

# === Embedding + Vector DB ===
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    collection_name="recipe-rag"
)

# === Groq LLaMA Model ===
llm = ChatOpenAI(
    model="llama3-70b-8192",
    openai_api_key=OPENAI_API_KEY,
    openai_api_base="https://api.groq.com/openai/v1",
    temperature=0.1  # دقة عالية بدون عشوائية
)

# === Prompt Template ===
RAG_TEMPLATE = """
You are a helpful cooking assistant called Leapo. Use the context below to answer the user's cooking question.

Chat History:
{chat_history}

Context:
{context}

Question:
{question}

If the context is a recipe, respond with:

Recipe Name: <name>
Ingredients: <list>
Instructions:
- Step 1
- Step 2
...

If there's not enough context, say: "Sorry, I couldn’t find a recipe for that."
"""

prompt = PromptTemplate(
    input_variables=["context", "question", "chat_history"],  # ✅ لازم تكون كلهم موجودين
    template=RAG_TEMPLATE
)

# === Retriever ===
retriever = vector_db.as_retriever(search_kwargs={"k": 4})

# === Separate memory for recipe chat ===
recipe_memory = ConversationBufferMemory(
    memory_key="chat_history",  # ✅ يطابق اسم المتغير في الـ prompt
    return_messages=True
)

# === Main response function ===
def recipe_chat_response(user_input: str) -> str:
    try:
        chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            memory=recipe_memory,
            return_source_documents=False,
            combine_docs_chain_kwargs={"prompt": prompt}
        )

        return chain.run({
            "question": user_input,
            "chat_history": recipe_memory.chat_memory.messages
        })

    except Exception as e:
        return f"⚠️ Error: {str(e)}"
