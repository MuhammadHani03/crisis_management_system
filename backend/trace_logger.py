from database import Trace, SessionLocal

def log_trace(step: str, input_data: dict, reasoning: str, decision: str, confidence: float):
    """
    Simulates the 'Antigravity Layer' logging the reasoning behind AI decisions.
    """
    db = SessionLocal()
    try:
        trace = Trace(
            step=step,
            input_data=input_data,
            reasoning=reasoning,
            decision=decision,
            confidence=confidence
        )
        db.add(trace)
        db.commit()
    finally:
        db.close()
