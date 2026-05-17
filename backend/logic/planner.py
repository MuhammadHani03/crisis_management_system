from trace_logger import log_trace
import json

def allocate_resources(crisis_classification: dict):
    """
    Module C: Severity + Resource Planner
    Assigns severity and allocates resources based on crisis type.
    """
    crisis_type = crisis_classification["crisis_type"]
    
    if crisis_type == "Flood":
        severity = "HIGH"
        resources = ["Water Rescue Teams", "Evacuation Boats", "Sandbags"]
        reasoning = f"Assigned HIGH severity and heavy rescue resources due to {crisis_type} classification."
    elif crisis_type == "Infrastructure Burst":
        severity = "MEDIUM"
        resources = ["Maintenance Crew", "Water Shutoff Team", "Traffic Control"]
        reasoning = f"Assigned MEDIUM severity. Retracted rescue teams, dispatched maintenance for {crisis_type}."
    elif crisis_type == "Heatwave / Fire Risk":
        severity = "HIGH"
        resources = ["Fire Dept", "Cooling Centers", "Ambulances"]
        reasoning = f"Assigned HIGH severity for potential fire/health risk."
    else:
        severity = "LOW"
        resources = ["Scout Team"]
        reasoning = "Default low-level dispatch for unknown disturbance."

    # Log the resource allocation step
    log_trace(
        step="resource_allocation",
        input_data=crisis_classification,
        reasoning=reasoning,
        decision=f"Severity: {severity}, Resources: {', '.join(resources)}",
        confidence=0.90
    )

    return {
        "severity": severity,
        "resources": json.dumps(resources)
    }
