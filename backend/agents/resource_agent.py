from services.llm_service import call_llm
import json

class ResourceAgent:
    """Agent 5: Resource Allocation Agent"""
    
    def execute(self, classification_data: dict, severity_data: dict) -> dict:
        prompt = f"""
        You are the Resource Allocation Agent. Decide which emergency resources to dispatch based on the crisis and its severity.
        
        Crisis Classification:
        {json.dumps(classification_data, indent=2)}
        
        Severity Assessment:
        {json.dumps(severity_data, indent=2)}
        
        Return your response as a JSON object with the following structure:
        {{
            "allocated_resources": [
                {{"type": "Ambulance", "quantity": 2, "destination": "G-10"}}
            ],
            "reasoning": "Explanation of why these resources were chosen"
        }}
        """
        
        response = call_llm(prompt, json_mode=True)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"allocated_resources": [], "reasoning": "Failed to allocate resources."}
