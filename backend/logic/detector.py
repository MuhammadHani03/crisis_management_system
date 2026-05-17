from trace_logger import log_trace

def classify_crisis(fused_data: dict):
    """
    Module B: Crisis Detector
    Rule-based classification of the crisis based on fused signals.
    """
    content = fused_data["combined_content"].lower()
    sources = fused_data["sources_involved"]
    
    # Conflict Resolution Logic (The Winning Scenario)
    if "field_report" in sources and "water pipe burst" in content:
        decision = "Infrastructure Burst"
        reasoning = "High confidence field report ('water pipe burst') overrides social media flood rumors."
        confidence = 0.95
    elif "flood" in content or "rain" in content:
        decision = "Flood"
        reasoning = "Multiple signals indicate flooding and heavy rain in the area."
        confidence = 0.82
    elif "heat" in content or "fire" in content:
        decision = "Heatwave / Fire Risk"
        reasoning = "Temperature readings and social reports indicate extreme heat."
        confidence = 0.75
    else:
        decision = "Unknown Disturbance"
        reasoning = "Insufficient clear signals to classify crisis."
        confidence = 0.40

    # Log the classification step
    log_trace(
        step="crisis_classification",
        input_data=fused_data,
        reasoning=reasoning,
        decision=decision,
        confidence=confidence
    )

    return {
        "crisis_type": decision,
        "confidence": confidence
    }
