from services.llm_service import call_llm
import json

class NotificationAgent:
    """Agent 7: Notification Agent"""
    
    def execute(self, classification_data: dict, severity_data: dict, simulation_data: dict) -> dict:
        prompt = f"""
        You are the Notification Agent. Generate public alerts and messages based on the current situation.
        
        Crisis Classification:
        {json.dumps(classification_data, indent=2)}
        
        Severity Assessment:
        {json.dumps(severity_data, indent=2)}
        
        Predicted Outcome:
        {json.dumps(simulation_data, indent=2)}
        
        Return your response as a JSON object with the following structure:
        {{
            "public_alert_message": "A short, urgent message for the public (e.g., 'Avoid G-10 due to flooding')",
            "internal_dispatch_message": "A detailed message for emergency responders",
            "reasoning": "Explanation for the tone and content of these messages"
        }}
        """
        
        response = call_llm(prompt, json_mode=True)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"public_alert_message": "Error generating alert.", "internal_dispatch_message": "", "reasoning": "Failed to generate notifications."}
