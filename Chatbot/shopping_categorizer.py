import os
from dotenv import load_dotenv
from openai import OpenAI

# === Load API key from .env ===
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# === Setup OpenAI-compatible client (Groq) ===
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=OPENAI_API_KEY
)

# === System prompt ===
system_prompt = (
    "You are Leapo, an intelligent grocery assistant. "
    "Your task is to organize shopping items into clear, predefined categories. "
    "You must group them, sort them alphabetically within each group, and present them in a clean list format."
)

# === Categorization function ===
def categorize_items(user_input: str) -> str:
    try:
        prompt = f"""
Organize the following grocery items into the following fixed categories only:
- Vegetables
- Fruits
- Dairy
- Meat
- Seafood
- Bakery
- Herbs & Spices
- Preserves & Canned Goods
- Grains & Pasta
- Snacks
- Beverages
- Cleaning Supplies
- Other

Items to organize:
{user_input}

Please:

1. Categorize the items strictly using the above list.
2. Sort items alphabetically inside each category.
3. Use this format exactly (no extra comments):

Category Name:
- item 1
- item 2
...

Only include categories that contain items.
"""

        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            top_p=0.9,
            max_tokens=512
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"⚠️ Error: {str(e)}"
