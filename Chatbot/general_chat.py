import os
from dotenv import load_dotenv
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_models import ChatOpenAI

# Load API key from .env file
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Setup the LLaMA model from Groq (OpenAI-compatible)
llm = ChatOpenAI(
    model="llama3-70b-8192",
    openai_api_key=GROQ_API_KEY,
    openai_api_base="https://api.groq.com/openai/v1",
    temperature=0.5
)

# Create conversation memory buffer
memory = ConversationBufferMemory(return_messages=True)

# Create a conversation chain with memory
chain = ConversationChain(llm=llm, memory=memory)

# Function to handle general LLaMA responses
def general_chat_response(user_input: str) -> str:
    try:
        reply = chain.run(user_input)
        return reply
    except Exception as e:
        return f"⚠️ Error: {str(e)}"
