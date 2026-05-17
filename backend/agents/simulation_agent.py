from services.llm_service import call_llm
import json

class SimulationAgent:
    """Agent 6: Simulation Agent"""
    
    def execute(self, resource_data: dict, severity_data: dict) -> dict:
        prompt = f"""
        You are the Simulation Agent. Predict the results of the actions taken by the Resource Allocation Agent.
        
        Resource Allocation:
        {json.dumps(resource_data, indent=2)}
        
        Current Severity:
        {json.dumps(severity_data, indent=2)}
        
        Return your response as a JSON object with the following structure:
        {{
            "predicted_outcome": "Description of what will likely happen after these resources arrive",
            "estimated_resolution_time_hours": <float>,
            "reasoning": "Explanation for these predictions"
        }}
        """
        
        response = call_llm(prompt, json_mode=True)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"predicted_outcome": "Unknown", "estimated_resolution_time_hours": 0.0, "reasoning": "Failed to simulate outcome."}
