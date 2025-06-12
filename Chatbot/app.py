from flask import Flask, request, render_template, jsonify
from flask_session import Session
from dotenv import load_dotenv
import os

# === Load environment variables ===
load_dotenv()
app = Flask(__name__)
app.secret_key = 'secret-key'
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# === LangChain Memory ===
from langchain.memory import ConversationBufferMemory
chat_memory = ConversationBufferMemory(return_messages=True)

# === Response Logic ===
from general_chat import general_chat_response
from home_assistant import home_assistant_response
from recipe_assistant import recipe_chat_response
from shopping_categorizer import categorize_items

# === Intent Classifier ===
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_community.chat_models import ChatOpenAI

llm_intent = ChatOpenAI(
    model="llama3-70b-8192",
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    openai_api_base="https://api.groq.com/openai/v1",
    temperature=0
)

def detect_mode(user_input: str) -> str:
    try:
        system_prompt = """You are an intent classifier. 
Classify the user input into ONLY one of these:
- home_assistant
- recipe_assistant
- shopping_categorizer
- general

Respond only with one label.
"""
        response = llm_intent.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_input)
        ])
        intent = response.content.strip().lower()
        return intent if intent in ["home_assistant", "recipe_assistant", "shopping_categorizer", "general"] else "general"
    except Exception as e:
        print("Intent error:", e)
        return "general"

def clarify_ambiguous_input(user_input, last_message):
    if "it" in user_input.lower() and "light" in last_message.lower():
        return user_input.lower().replace("it", "the light")
    return user_input

def low_confidence(user_input: str) -> bool:
    vague_phrases = ["it", "do it", "again", "another one", "that", "this", "turn it", "what about it", "repeat", "same"]
    return any(phrase in user_input.lower() for phrase in vague_phrases)

@app.route("/", methods=["GET"])
def home():
    history = []
    for msg in chat_memory.chat_memory.messages:
        role = "You" if msg.type == "human" else "Bot"
        history.append((role, msg.content))
    return render_template("chat.html", history=history)

@app.route("/chat", methods=["POST"])
def chat_json():
    data = request.get_json()
    user_input = data.get("message", "").strip()

    last_msg = ""
    for m in reversed(chat_memory.chat_memory.messages):
        if m.type == "human":
            last_msg = m.content
            break

    user_input = clarify_ambiguous_input(user_input, last_msg)
    mode = detect_mode(user_input)

    try:
        if mode == "home_assistant":
            reply = home_assistant_response(user_input)
        elif mode == "recipe_assistant":
            reply = recipe_chat_response(user_input)
        elif mode == "shopping_categorizer":
            reply = categorize_items(user_input)
        else:
            reply = "Can you clarify what you meant?" if low_confidence(user_input) else general_chat_response(user_input, chat_memory)
    except Exception as e:
        reply = f"⚠️ Internal error: {str(e)}"

    chat_memory.chat_memory.add_user_message(user_input)
    chat_memory.chat_memory.add_ai_message(reply)

    return jsonify({"reply": reply})

@app.route("/clear", methods=["POST"])
def clear_chat():
    chat_memory.clear()
    return "", 204

if __name__ == '__main__':
    app.run(debug=True)
