import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# Configure Groq API
# Note: The API key might be set in GROQ_API_KEY or stored under GEMINI_API_KEY in the .env file.
API_KEY = os.getenv("GROQ_API_KEY") or os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("Groq API key not found in .env file (looked for GROQ_API_KEY or GEMINI_API_KEY).")

client = Groq(api_key=API_KEY)
MODEL_NAME = "llama-3.1-8b-instant"


def call_llm(prompt: str, json_mode: bool = False) -> str:
    """
    Calls Groq using llama-3.1-8b-instant and returns raw text output.
    If json_mode=True, forces JSON-only response using response_format.
    """

    if json_mode:
        prompt += "\n\nReturn ONLY valid JSON. No markdown, no backticks, no extra text."

    try:
        # Build chat completion arguments
        kwargs = {
            "model": MODEL_NAME,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1,
        }
        
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        response = client.chat.completions.create(**kwargs)

        # DEBUG: always print raw response
        print("\n========== GROQ RAW RESPONSE ==========")
        print(response)
        print("=======================================\n")

        # Extract text safely
        text = response.choices[0].message.content
        if text is None:
            raise Exception("Groq returned empty text content.")

        text = text.strip()

        # Clean JSON formatting if needed
        if json_mode:
            if text.startswith("```json"):
                text = text.replace("```json", "")
            if text.startswith("```"):
                text = text.replace("```", "")
            if text.endswith("```"):
                text = text.replace("```", "")
            text = text.strip()

        print("\n========== CLEANED RESPONSE ==========")
        print(text)
        print("======================================\n")

        return text

    except Exception as e:
        print("\n!!!!!!!! LLM CALL FAILED !!!!!!!!")
        print("Error:", str(e))
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")
        raise e

