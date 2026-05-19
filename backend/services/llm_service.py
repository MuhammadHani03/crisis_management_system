import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file. LLM service cannot run.")

genai.configure(api_key=API_KEY)

# Model (you can switch to gemini-1.5-flash if needed)
model = genai.GenerativeModel("gemini-2.5-flash")


def call_llm(prompt: str, json_mode: bool = False) -> str:
    """
    Calls Gemini and returns raw text output.
    If json_mode=True, forces JSON-only response.
    """

    if json_mode:
        prompt += "\n\nReturn ONLY valid JSON. No markdown, no backticks, no extra text."

    try:
        response = model.generate_content(prompt)

        # DEBUG: always print raw response
        print("\n========== GEMINI RAW RESPONSE ==========")
        print(response)
        print("=========================================\n")

        # Safety check: candidates must exist
        if not hasattr(response, "candidates") or not response.candidates:
            raise Exception("Gemini returned no candidates. Possible API/safety issue.")

        # Extract text safely
        text = getattr(response, "text", None)

        if text is None:
            # fallback extraction (sometimes Gemini structure varies)
            try:
                text = response.candidates[0].content.parts[0].text
            except Exception:
                raise Exception("Could not extract text from Gemini response.")

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

