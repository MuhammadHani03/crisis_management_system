# Urban Crisis Management System (Antigravity Agentic Layer)

This project is a multi-agent AI system designed to detect, classify, and allocate resources for urban crises (like floods, infrastructure failures, etc.). The backend is powered by Python, FastAPI, and Google's Gemini LLM.

## Project Structure
*   `backend/` - The Python FastAPI server and AI agents.
*   `frontend/` - (Coming Soon) The React Native Expo mobile app.

## Prerequisites
*   Python 3.10+
*   A Gemini API Key from [Google AI Studio](https://aistudio.google.com/) (Make sure billing is enabled if you are using newer models).

---

## How to Install and Run the Backend

### 1. Open your terminal and navigate to the backend folder:
```bash
cd backend
```

### 2. Create a Virtual Environment (Recommended):
**On Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```
**On Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install the required libraries:
```bash
pip install -r requirements.txt
```

### 4. Setup your API Key:
Create a file named `.env` inside the `backend/` folder and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 5. Run the Server:
Start the FastAPI server using Python:
```bash
python main.py
```
*(The server will start at http://localhost:8000)*

---

## How to Test the AI Agents

1. Open your browser and go to the interactive API docs: **http://localhost:8000/docs**
2. Scroll down to the `POST /simulate-conflict` endpoint.
3. Click **Try it out** and then **Execute**.
4. The system will trigger the Antigravity Agentic Layer, pass data through 7 different Gemini agents, and return the final JSON decisions.
5. You can view the specific thoughts/reasoning of every agent by hitting the `GET /traces` endpoint.
