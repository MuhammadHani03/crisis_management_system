from services.llm_service import call_llm
import json

class FusionAgent:
    """Agent 1: Signal Fusion Agent"""
    
    def execute(self, signals: list[dict]) -> dict:
        prompt = f"""
        You are the Signal Fusion Agent for an emergency response system.
        Combine and summarize the following incoming data signals into a unified situational report.
        
        Raw Signals:
        {json.dumps(signals, indent=2)}
        
        Return your response as a JSON object with the following structure:
        {{
            "summary": "Brief summary of the situation",
            "key_entities": ["list", "of", "important", "locations/people/things"]
        }}
        """
        
        response = call_llm(prompt, json_mode=True)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"summary": "Failed to fuse signals.", "key_entities": []}
