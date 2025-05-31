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
    temperature=0.3
)

# Define the system prompt for the Home Assistant
home_assistant_system_prompt = """
You are HomeBot, an intelligent home assistant. Your name is Leap HomeBot.
You help users with smart home tasks like:
- controlling lights,
- checking appliance statuses,
- providing cooking recipes,
- giving cleaning tips,
- managing shopping lists,
- and answering household-related questions clearly and helpfully.
"""

# Create conversation memory buffer
memory = ConversationBufferMemory(return_messages=True)

# Create a conversation chain with memory
chain = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=False
)

# Function to handle Home Assistant responses
def home_assistant_response(user_input: str) -> str:
    try:
        # Add system prompt only once at the beginning of the conversation
        if not memory.chat_memory.messages:
            memory.chat_memory.add_user_message(home_assistant_system_prompt)
        return chain.run(user_input)
    except Exception as e:
        return f"⚠️ Error: {str(e)}"
