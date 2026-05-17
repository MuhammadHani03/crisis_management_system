from sqlalchemy.orm import Session
from database import Signal
from trace_logger import log_trace

def fuse_signals_by_location(db: Session, location: str):
    """
    Module A: Signal Fusion
    Groups and merges signals for a specific location.
    """
    signals = db.query(Signal).filter(Signal.location == location).all()
    
    if not signals:
        return None

    sources = [s.source for s in signals]
    content_summary = " | ".join([s.content for s in signals])
    
    fusion_result = {
        "location": location,
        "signal_count": len(signals),
        "sources_involved": list(set(sources)),
        "combined_content": content_summary
    }

    # Log the fusion step
    log_trace(
        step="signal_fusion",
        input_data={"location": location, "raw_signals_count": len(signals)},
        reasoning=f"Merged {len(signals)} signals from sources: {', '.join(set(sources))}",
        decision="Fusion Complete",
        confidence=0.95
    )

    return fusion_result
