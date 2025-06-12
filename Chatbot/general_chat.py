from openai import OpenAI
import os
from dotenv import load_dotenv
from langchain.chains import ConversationChain
from langchain_community.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory

# === Load .env ===
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# === Groq client via LangChain ===
llm = ChatOpenAI(
    model="llama3-70b-8192",
    openai_api_key=OPENAI_API_KEY,
    openai_api_base="https://api.groq.com/openai/v1",
    temperature=0.5
)

# === System prompt to keep it natural and focused ===
system_prompt = """
You are Leapo, a smart and concise AI assistant who answers general questions clearly.
Avoid talking about your training, architecture, or how many GPUs you use.
If someone greets you, respond warmly like "Hi there! How can I help you today?"
"""

# ✅ Updated to accept memory from app.py
def general_chat_response(user_input: str, memory: ConversationBufferMemory) -> str:
    try:
        chain = ConversationChain(
            llm=llm,
            memory=memory,
            verbose=False
        )
        return chain.run(user_input)
    except Exception as e:
        return f"⚠️ Error: {str(e)}"
