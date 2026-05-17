from services.llm_service import call_llm
import json

class SeverityAgent:
    """Agent 4: Severity Agent"""
    
    def execute(self, classification_data: dict, fused_data: dict) -> dict:
        prompt = f"""
        You are the Severity Agent. Estimate the danger level, affected population, and spread risk.
        
        Crisis Classification:
        {json.dumps(classification_data, indent=2)}
        
        Situation Summary:
        {json.dumps(fused_data, indent=2)}
        
        Return your response as a JSON object with the following structure:
        {{
            "severity_level": "LOW, MEDIUM, HIGH, or CRITICAL",
            "estimated_affected_population": <integer>,
            "spread_risk": "Low, Moderate, or High",
            "reasoning": "Explanation for these estimates"
        }}
        """
        
        response = call_llm(prompt, json_mode=True)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"severity_level": "UNKNOWN", "estimated_affected_population": 0, "spread_risk": "Unknown", "reasoning": "Failed to assess severity."}
