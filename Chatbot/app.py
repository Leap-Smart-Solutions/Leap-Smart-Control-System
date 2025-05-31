from flask import Flask, request, session, redirect, url_for, render_template
from flask_session import Session
from dotenv import load_dotenv
import os

# Import units of each mode
from general_chat import general_chat_response
from home_assistant import home_assistant_response
from recipe_assistant import recipe_chat_response
from shopping_categorizer import categorize_items

load_dotenv()
app = Flask(__name__)
app.secret_key = "your-secret"
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route('/', methods=['GET', 'POST'])
def select_mode():
    if request.method == 'POST':
        session['mode'] = request.form['mode']
        return redirect(url_for('chat'))
    return render_template('select_mode.html')

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    if 'mode' not in session:
        return redirect(url_for('select_mode'))

    chat_history = session.get('chat_history', [])
    reply = ""

    if request.method == 'POST':
        user_input = request.form.get("message", "").strip()
        if user_input.lower() in ["exit", "bye", "thanks"]:
            session.clear()
            return redirect(url_for('select_mode'))

        chat_history.append(("user", user_input))

        mode = session["mode"]
        if mode == "general":
            reply = general_chat_response(user_input)
        elif mode == "home":
            reply = home_assistant_response(user_input)
        elif mode == "recipe":
            reply = recipe_chat_response(user_input, chat_history)
        elif mode == "shopping":
            reply = categorize_items(user_input)
        else:
            reply = "❌ Invalid mode selected."

        chat_history.append(("bot", reply))
        session['chat_history'] = chat_history

    return render_template('chat_ui.html', chat_history=chat_history, mode=session["mode"])

@app.route('/clear', methods=['POST'])
def clear_chat():
    session.pop('chat_history', None)
    return redirect(url_for('chat'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

