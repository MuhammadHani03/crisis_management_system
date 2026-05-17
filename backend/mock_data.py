from sqlalchemy.orm import Session
from database import Signal, Incident, Trace
import json

def seed_initial_state(db: Session):
    """
    Seeds the database with the initial "False Alarm" Flood scenario in Sector G-10.
    """
    # Check if already seeded
    if db.query(Signal).first():
        return

    # 1. Add Initial Signals
    signals = [
        Signal(source="social", location="G-10", content="Omg massive flood in G-10! Water everywhere!"),
        Signal(source="social", location="G-10", content="Need help, cars are floating in sector G-10."),
        Signal(source="weather_api", location="G-10", content="Heavy rainfall detected, 40mm/hr.")
    ]
    db.add_all(signals)
    db.commit()

    # 2. Add Initial Incident (The AI's wrong conclusion)
    incident = Incident(
        location="G-10",
        crisis_type="Flood",
        severity="HIGH",
        status="Active",
        resources_assigned=json.dumps(["Water Rescue Teams", "Evacuation Boats", "Sandbags"])
    )
    db.add(incident)
    db.commit()

    # 3. Add Initial Traces explaining the wrong conclusion
    traces = [
        Trace(
            step="signal_fusion",
            input_data={"location": "G-10", "raw_signals_count": 3},
            reasoning="Merged 3 signals from sources: social, weather_api",
            decision="Fusion Complete",
            confidence=0.95
        ),
        Trace(
            step="crisis_classification",
            input_data={"location": "G-10", "combined_content": "Omg massive flood..."},
            reasoning="Multiple signals indicate flooding and heavy rain in the area.",
            decision="Flood",
            confidence=0.82
        ),
        Trace(
            step="resource_allocation",
            input_data={"crisis_type": "Flood"},
            reasoning="Assigned HIGH severity and heavy rescue resources due to Flood classification.",
            decision="Severity: HIGH, Resources: Water Rescue Teams, Evacuation Boats, Sandbags",
            confidence=0.90
        )
    ]
    db.add_all(traces)
    db.commit()

def inject_conflict_signal(db: Session):
    """
    Injects the field report that triggers the conflict resolution.
    """
    conflict_signal = Signal(
        source="field_report",
        location="G-10",
        content="Actually, it's just a major water pipe burst, no flooding in houses."
    )
    db.add(conflict_signal)
    db.commit()
    return conflict_signal
