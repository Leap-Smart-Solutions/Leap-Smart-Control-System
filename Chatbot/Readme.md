# 🏡 LEAP Smart Home AI Chatbot  
### Intelligent Multi-Module Assistant using LLaMA-3, LangChain, RAG, and Firebase

The **Leap Smart Home Chatbot** is an AI-powered conversational system designed to manage smart-home tasks through **voice and text**.  
It integrates **IoT control, recipe retrieval, shopping list categorization, and general conversation**, powered by **LLaMA-3**, LangChain, Firebase, and a custom RAG pipeline.

---

## 🚀 Features

### 🏠 1. Smart Home Control  
- Turn ON/OFF IoT devices via Firebase  
- Real-time state reading and updates  
- Natural-language control (e.g., *“Turn on the light”*)

### 🍳 2. Recipe Assistant (RAG)  
- Uses a **vector database (Chroma)** + **MiniLM embeddings**  
- Retrieves recipe context from CSV dataset  
- Gives structured recipe outputs (Recipe Name, Ingredients, steps)
- Supports multi-turn cooking conversations

### 🛒 3. Shopping List Categorizer  
- Categorizes items into grocery categories through instruction tuning  
- Alphabetically sorts items within each category  
- Clean, formatted output for users

### 💬 4. General Chat  
- LLaMA-3 powered general conversation  
- Uses **ConversationBufferMemory** for multi-turn context  
- Natural & concise responses
 
---

## 🛠️ Tech Stack

### **Backend**
- Python (Flask)

### **IoT Integration**
- Firebase Realtime Database  
- REST API for device state control

### **Frontend**
- HTML, CSS, JavaScript
- AJAX JSON messaging

### **AI Features**
- LLaMA-3 (70B) via Groq API
- LangChain
- HuggingFace Embeddings: **all-MiniLM-L6-v2**
- ChromaDB
- ConversationBufferMemory
- Custom RAG pipeline

---

## 📁 Project Structure
```bash
├── app.py
├── general_chat.py
├── recipe_assistant.py
├── home_assistant.py
├── shopping_categorizer.py
├── templates/
│ └── chat.html
├── data/
│ └── food_recipes.csv
└── README.md
```
---

## ⚙️ Setup Instructions

### **1. Clone the repo**
```bash
git clone https://github.com/HabibaMAtiia/leap-smart-control-system
cd leap-smart-control-system
```
### **2. Install dependencies**
```bash
pip install -r requirements.txt
```
### **3. Add your API keys**
Create a .env file:
```bash
OPENAI_API_KEY=your_groq_key
```
### **4. Run the Flask server**
```bash
python app.py
```
Go to:
➡ http://127.0.0.1:5000/

## 🚧 Future Work

- Personalized smart-home automation
- Long-term memory architecture
- Arabic conversation integration
- Daily task scheduler module

## 👨‍💻 Author 

**Eng. Habiba Mohammad** 📩 habibamohamad062@gmail.com






