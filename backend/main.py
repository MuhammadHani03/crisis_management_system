from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, SessionLocal
from mock_data import seed_initial_state
import api

app = FastAPI(title="Crisis Management System API")

# Setup CORS for the mobile app to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(api.router)

@app.on_event("startup")
def on_startup():
    print("Initializing Database...")
    init_db()
    
    print("Seeding initial mock data...")
    db = SessionLocal()
    try:
        seed_initial_state(db)
    finally:
        db.close()
    
    print("Backend is ready!")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Crisis Management System API. Visit /docs for Swagger UI."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
