from services.llm_service import call_llm
import json

class CredibilityAgent:
    """Agent 2: Credibility Agent"""
    
    def execute(self, signals: list[dict], fused_data: dict) -> dict:
        prompt = f"""
        You are the Credibility Agent. Your job is to check whether the incoming information is reliable.
        Assess the credibility of the situation based on the number and type of signals.
        1 social post = low confidence. Many diverse signals together = high confidence.
        Conflicting signals (e.g. social media says flood, field report says pipe burst) should be resolved carefully. Give high weight to official or field reports.
        
        Raw Signals:
        {json.dumps(signals, indent=2)}
        
        Fused Data:
        {json.dumps(fused_data, indent=2)}
        
        Return your response as a JSON object with the following structure:
        {{
            "credibility_score": <float between 0.0 and 1.0>,
            "reasoning": "Explanation of how credible the situation is and how conflicts were resolved",
            "is_false_alarm": <boolean>
        }}
        """
        
        response = call_llm(prompt, json_mode=True)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"credibility_score": 0.5, "reasoning": "Failed to assess credibility.", "is_false_alarm": False}
