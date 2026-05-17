from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db, Signal, Incident, Trace
from antigravity.orchestrator import AntigravityOrchestrator
from pydantic import BaseModel
import json

router = APIRouter()
orchestrator = AntigravityOrchestrator()

class SignalInput(BaseModel):
    source: str
    location: str
    content: str

@router.post("/signals")
def receive_signal(signal_input: SignalInput, db: Session = Depends(get_db)):
    """Receives a new signal and triggers the Antigravity Agentic Layer."""
    new_signal = Signal(
        source=signal_input.source,
        location=signal_input.location,
        content=signal_input.content
    )
    db.add(new_signal)
    db.commit()
    db.refresh(new_signal)
    
    # Get all signals for this location
    all_signals = db.query(Signal).filter(Signal.location == new_signal.location).all()
    signal_dicts = [{"source": s.source, "content": s.content, "timestamp": str(s.timestamp)} for s in all_signals]
    
    # Trigger the AI Orchestrator
    result = orchestrator.process_incident(signal_dicts)
    
    # Update or create Incident in DB
    incident = db.query(Incident).filter(Incident.location == new_signal.location).first()
    if not incident:
        incident = Incident(location=new_signal.location)
        db.add(incident)
    
    incident.crisis_type = result["classification"].get("crisis_type", "Unknown")
    incident.severity = result["severity"].get("severity_level", "Unknown")
    incident.resources_assigned = json.dumps(result["resources"].get("allocated_resources", []))
    incident.status = "Resolved" if result["credibility"].get("is_false_alarm") else "Active"
    
    db.commit()
    
    return {"status": "success", "message": "Signal processed by AI Agents", "ai_results": result}

from mock_data import inject_conflict_signal

@router.post("/simulate-conflict")
def simulate_conflict(db: Session = Depends(get_db)):
    """
    Triggers the conflict scenario: A field report overrides the initial flood detection.
    This simulates the user flow where a ground agent reports a pipe burst.
    """
    # Inject the field report
    new_signal = inject_conflict_signal(db)
    
    # Get all signals for G-10
    location = "G-10"
    all_signals = db.query(Signal).filter(Signal.location == location).all()
    signal_dicts = [{"source": s.source, "content": s.content, "timestamp": str(s.timestamp)} for s in all_signals]
    
    # Trigger the AI Orchestrator
    result = orchestrator.process_incident(signal_dicts)
    
    # Update existing incident
    incident = db.query(Incident).filter(Incident.location == location).first()
    if incident:
        incident.crisis_type = result["classification"].get("crisis_type", "Unknown")
        incident.severity = result["severity"].get("severity_level", "Unknown")
        incident.resources_assigned = json.dumps(result["resources"].get("allocated_resources", []))
        incident.status = "Resolved" if result["credibility"].get("is_false_alarm") else "Active"
        db.commit()
        
    return {"status": "success", "message": "Conflict scenario triggered! Incident G-10 updated.", "ai_results": result}

@router.get("/incidents")
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(Incident).all()
    results = []
    for inc in incidents:
        results.append({
            "id": inc.id,
            "location": inc.location,
            "crisis_type": inc.crisis_type,
            "severity": inc.severity,
            "status": inc.status,
            "resources_assigned": json.loads(inc.resources_assigned) if inc.resources_assigned else []
        })
    return results

@router.get("/traces")
def get_traces(db: Session = Depends(get_db)):
    traces = db.query(Trace).order_by(Trace.timestamp.desc()).all()
    return traces
