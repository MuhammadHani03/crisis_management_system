from services.llm_service import call_llm
import json

class ClassificationAgent:
    """Agent 3: Crisis Classification Agent"""
    
    def execute(self, fused_data: dict, credibility_data: dict) -> dict:
        prompt = f"""
        You are the Crisis Classification Agent. Your job is to classify the type of crisis based on the fused data and credibility assessment.
        Common crisis types: Flood, Accident, Heatwave, Power Outage, Infrastructure Burst, Fire, None.
        
        Fused Data:
        {json.dumps(fused_data, indent=2)}
        
        Credibility Assessment:
        {json.dumps(credibility_data, indent=2)}
        
        If credibility data says it's a false alarm, classify it as "None" or the specific minor issue it actually is (e.g. "Pipe Burst").
        
        Return your response as a JSON object with the following structure:
        {{
            "crisis_type": "The classified crisis type",
            "reasoning": "Explanation of why this classification was chosen"
        }}
        """
        
        response = call_llm(prompt, json_mode=True)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"crisis_type": "Unknown", "reasoning": "Failed to classify crisis."}
