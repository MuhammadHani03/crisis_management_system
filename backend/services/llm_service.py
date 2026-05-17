import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("WARNING: GEMINI_API_KEY not found in .env file. Agents will fail.")

# Using gemini-2.0-flash based on available models
model = genai.GenerativeModel('gemini-2.0-flash')

def call_llm(prompt: str, json_mode: bool = False) -> str:
    """
    Calls the Gemini API. 
    If json_mode is true, it appends an instruction to return valid JSON.
    """
    if json_mode:
        prompt += "\n\nIMPORTANT: Return ONLY valid JSON. Do not include markdown formatting or backticks (e.g., ```json)."
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if json_mode:
            # Strip markdown if Gemini includes it despite instructions
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
        return text.strip()
    except Exception as e:
        print(f"LLM Call Error: {e}")
        return "{}" if json_mode else "Error: LLM Call Failed"
