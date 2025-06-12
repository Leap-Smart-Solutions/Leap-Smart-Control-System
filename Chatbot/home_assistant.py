import requests
import json

# === Firebase Lamp Control (fixed path) ===
FIREBASE_URL = "https://leap-smart-band-default-rtdb.firebaseio.com/Lights/stat.json"

# === Home Assistant: Lamp Only Response ===
def home_assistant_response(user_input: str) -> str:
    user_input = user_input.lower()

    # Step 1: Get current lamp status
    try:
        res = requests.get(FIREBASE_URL)
        current_status = res.json()  # Expected "0" or "1" as string
    except Exception as e:
        return f"⚠️ Failed to retrieve current lamp status: {str(e)}"

    # Step 2: Respond to ON command
    if "turn on" in user_input or "light on" in user_input or "switch on" in user_input:
        if current_status == "1":
            return "💡 The light is already ON."
        try:
            requests.put(FIREBASE_URL, json="1")
            return "✅ Light turned ON."
        except Exception as e:
            return f"⚠️ Error turning on the light: {str(e)}"

    # Step 3: Respond to OFF command
    elif "turn off" in user_input or "light off" in user_input or "switch off" in user_input:
        if current_status == "0":
            return "🕯️ The light is already OFF."
        try:
            requests.put(FIREBASE_URL, json="0")
            return "⛔ Light turned OFF."
        except Exception as e:
            return f"⚠️ Error turning off the light: {str(e)}"

    # Step 4: Respond to status check
    elif (
        "status" in user_input
        or "light status" in user_input
        or "is the light" in user_input
        or "is the lamp" in user_input
        or "open" in user_input
        or "closed" in user_input
    ):
        if current_status == "1":
            return "📊 The light is ON."
        elif current_status == "0":
            return "📊 The light is OFF."
        else:
            return f"❓ Unknown light status: {current_status}"

    # Fallback response
    else:
        return "🤖 I can only control the light. Try 'turn on the light' or 'check light status'."
