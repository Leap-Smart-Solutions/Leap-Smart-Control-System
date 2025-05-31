import os
import pandas as pd
from dotenv import load_dotenv

from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

# Load environment variables (especially GROQ_API_KEY)
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Step 1: Load the CSV file with recipe data
doc_path = "data/food_recipes.csv"  # Make sure this file exists
df = pd.read_csv(doc_path, encoding='utf-8', nrows=500)

# Step 2: Convert each row into a Document format
documents = [
    Document(
        page_content=f"Title: {row['recipe_title']}\nIngredients: {row['ingredients']}\nInstructions: {row['instructions']}"
    )
    for _, row in df.iterrows()
]

# Step 3: Split text into chunks for embedding
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(documents)

# Step 4: Create embedding model and vector database
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

vector_db = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    collection_name="recipe-rag"
)

# Step 5: Setup LLM using Groq (OpenAI-compatible API)
llm = ChatOpenAI(
    model="llama3-70b-8192",
    openai_api_key=GROQ_API_KEY,
    openai_api_base="https://api.groq.com/openai/v1",
    temperature=0.7
)

# Step 6: Custom RAG prompt template
RAG_TEMPLATE = """
You are a recipe assistant. Use the following recipe documents and conversation history to answer the user's question.

Conversation history:
{chat_history}

Context documents:
{context}

User's question:
{question}

Answer format (if applicable):
Recipe Name: <title>
Ingredients: <comma-separated list>
Instructions: <step-by-step instructions>
"""

prompt = PromptTemplate(
    input_variables=["context", "question", "chat_history"],
    template=RAG_TEMPLATE
)

# Step 7: Setup memory and retriever
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
retriever = vector_db.as_retriever(search_kwargs={"k": 4})

# Step 8: Create the RAG chain
chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory,
    return_source_documents=False,
    combine_docs_chain_kwargs={"prompt": prompt}
)

# Step 9: Define response function
def recipe_chat_response(user_input: str, chat_history: list) -> str:
    try:
        return chain.run(user_input)
    except Exception as e:
        return f"⚠️ Error: {str(e)}"
