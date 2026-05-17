from agents.fusion_agent import FusionAgent
from agents.credibility_agent import CredibilityAgent
from agents.classification_agent import ClassificationAgent
from agents.severity_agent import SeverityAgent
from agents.resource_agent import ResourceAgent
from agents.simulation_agent import SimulationAgent
from agents.notification_agent import NotificationAgent
from trace_logger import log_trace
from sqlalchemy.orm import Session

class AntigravityOrchestrator:
    """The Agentic Layer that coordinates all AI agents."""
    
    def __init__(self):
        self.fusion_agent = FusionAgent()
        self.credibility_agent = CredibilityAgent()
        self.classification_agent = ClassificationAgent()
        self.severity_agent = SeverityAgent()
        self.resource_agent = ResourceAgent()
        self.simulation_agent = SimulationAgent()
        self.notification_agent = NotificationAgent()

    def process_incident(self, signals: list[dict]):
        print("Starting Antigravity Pipeline...")
        
        # 1. Fusion
        fused_data = self.fusion_agent.execute(signals)
        log_trace("signal_fusion", {"raw_signals_count": len(signals)}, fused_data.get("summary", ""), "Data Fused", 0.9)
        
        # 2. Credibility
        credibility_data = self.credibility_agent.execute(signals, fused_data)
        log_trace("credibility_check", {"fused_data": fused_data}, credibility_data.get("reasoning", ""), f"Score: {credibility_data.get('credibility_score', 0)}", credibility_data.get('credibility_score', 0))
        
        # 3. Classification
        classification_data = self.classification_agent.execute(fused_data, credibility_data)
        log_trace("crisis_classification", {"credibility": credibility_data}, classification_data.get("reasoning", ""), classification_data.get("crisis_type", "Unknown"), 0.85)
        
        # 4. Severity
        severity_data = self.severity_agent.execute(classification_data, fused_data)
        log_trace("severity_assessment", {"classification": classification_data}, severity_data.get("reasoning", ""), severity_data.get("severity_level", "UNKNOWN"), 0.8)
        
        # 5. Resource Allocation
        resource_data = self.resource_agent.execute(classification_data, severity_data)
        log_trace("resource_allocation", {"severity": severity_data}, resource_data.get("reasoning", ""), f"Allocated {len(resource_data.get('allocated_resources', []))} resource types", 0.9)
        
        # 6. Simulation
        simulation_data = self.simulation_agent.execute(resource_data, severity_data)
        log_trace("simulation", {"resources": resource_data}, simulation_data.get("reasoning", ""), simulation_data.get("predicted_outcome", ""), 0.75)
        
        # 7. Notification
        notification_data = self.notification_agent.execute(classification_data, severity_data, simulation_data)
        log_trace("notification", {"simulation": simulation_data}, notification_data.get("reasoning", ""), "Alert Generated", 0.95)
        
        return {
            "fused_data": fused_data,
            "credibility": credibility_data,
            "classification": classification_data,
            "severity": severity_data,
            "resources": resource_data,
            "simulation": simulation_data,
            "notification": notification_data
        }
