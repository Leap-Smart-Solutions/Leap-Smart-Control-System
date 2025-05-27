from flask import Flask, request, render_template_string
import pandas as pd
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.retrievers.multi_query import MultiQueryRetriever
import ollama

app = Flask(__name__)

# === Memory context list ===
chat_history = []  # List of tuples: ("user", msg) and ("bot", reply)

# === Load and prepare CSV data ===
doc_path = "D:/ollama/data/food_recipes.csv"
df = pd.read_csv(doc_path, encoding='utf-8', nrows=500)

data = [
    Document(
        page_content=f"Title: {row['recipe_title']}\nIngredients: {row['ingredients']}\nInstructions: {row['instructions']}"
    )
    for _, row in df.iterrows()
]

# === Split and embed documents ===
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(data)

ollama.pull("nomic-embed-text")
vector_db = Chroma.from_documents(
    documents=chunks,
    embedding=OllamaEmbeddings(model="nomic-embed-text"),
    collection_name="recipe-rag",
)

# === Build RAG chain ===
llm = ChatOllama(model="llama3.2", num_predict=400)

QUERY_PROMPT = PromptTemplate(
    input_variables=["question"],
    template="""You are an AI assistant helping users find recipes.
Generate 5 alternative phrasings for this recipe question to improve search.
Original question: {question}"""
)

retriever = MultiQueryRetriever.from_llm(
    vector_db.as_retriever(), llm, prompt=QUERY_PROMPT
)

# Template with full chat context
RAG_TEMPLATE = """
You are a recipe assistant. Use the following recipe documents and the previous conversation to answer the user's latest question.

Conversation history:
{history}

Context documents:
{context}

Latest question:
{question}

Answer format (if applicable):
Recipe Name: <title>
Ingredients: <comma-separated list>
Instructions: <step-by-step instructions>
"""

from langchain.prompts import ChatPromptTemplate
prompt = ChatPromptTemplate.from_template(RAG_TEMPLATE)

def build_context_string(chat_history):
    context = ""
    for role, msg in chat_history:
        context += f"{role.capitalize()}: {msg}\n"
    return context

chain = (
    {
        "context": retriever,
        "question": RunnablePassthrough(),
        "history": lambda x: build_context_string(chat_history)
    }
    | prompt
    | llm
    | StrOutputParser()
)

# === Routes ===
@app.route('/', methods=['GET', 'POST'])
def index():
    global chat_history
    if request.method == 'POST':
        message = request.form.get("message", "").strip()
        if message:
            chat_history.append(("user", message))
            try:
                response = chain.invoke(message)
                chat_history.append(("bot", response))
            except Exception as e:
                chat_history.append(("bot", f"⚠️ Error: {str(e)}"))
    return render_template_string(TEMPLATE, chat_history=chat_history)

@app.route('/clear', methods=['POST'])
def clear_chat():
    global chat_history
    chat_history.clear()
    return render_template_string(TEMPLATE, chat_history=chat_history)

# === HTML Template ===
TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>🍲 Recipe Assistant</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .chat-container {
            background-color: white;
            width: 60%;
            max-width: 800px;
            padding: 30px 25px 20px;
            border-radius: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }
        .title {
            text-align: center;
            font-size: 28px;
            margin-bottom: 20px;
            color: #333;
        }
        .message {
            padding: 12px 18px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            line-height: 1.4;
            font-size: 16px;
        }
        .user {
            background-color: #cceeff;
            align-self: flex-end;
            text-align: right;
        }
        .bot {
            background-color: #eeeeee;
            align-self: flex-start;
            text-align: left;
        }
        form {
            margin-top: 20px;
        }
        input[type="text"] {
            flex: 1;
            padding: 12px;
            font-size: 16px;
            border-radius: 10px;
            border: 1px solid #ccc;
            width: calc(100% - 120px);
        }
        button {
            padding: 12px 22px;
            font-size: 16px;
            border-radius: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
        .clear-btn {
            background-color: #e53935;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="title">🍲 Recipe Assistant</div>
        {% for sender, msg in chat_history %}
            <div class="message {{ sender }}">{{ msg }}</div>
        {% endfor %}
        <form method="post" style="display:flex; gap:10px;">
            <input type="text" name="message" placeholder="Type your recipe question..." required />
            <button type="submit">Send</button>
        </form>
        <form method="post" action="/clear">
            <button type="submit" class="clear-btn">🗑️ Clear Chat</button>
        </form>
    </div>
</body>
</html>
"""

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
