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

# Urban Crisis Management — Mobile Frontend

A React Native / Expo mobile application for real-time urban crisis monitoring and incident management, powered by AI multi-agent analysis and Firebase authentication.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Screens](#screens)
- [Components](#components)
- [Services](#services)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Design System](#design-system)

---

## Overview

Urban Crisis Management is a field-facing mobile app that connects first responders and operations staff to a live incident pipeline driven by AI agents. Users can monitor active incidents, submit field signals, watch AI reasoning traces in real time, and track resource deployments — all from a single dark-themed, neon-accented interface.

The app is built with **Expo (SDK 51)** and communicates with a **FastAPI** backend. Authentication is handled by **Firebase**.

---

## Features

- **Firebase Authentication** — Email/password sign-in and account creation
- **Live Incident Feed** — Real-time list of active incidents with severity-based filtering and pull-to-refresh
- **Field Report Submission** — Submit signals from three source types (field report, social media, weather API) with pre-filled templates
- **AI Trace Viewer** — Step-by-step view of AI agent reasoning, decisions, and confidence scores per processing stage
- **Resource Matrix** — View resources actively deployed to incidents (fire dept, ambulances, rescue teams, etc.)
- **Incident Detail** — Full incident breakdown with severity/status chips, assigned resources, and a built-in conflict resolution demo
- **Conflict Resolution Demo** — Trigger a contradictory signal to watch AI agents reclassify an incident in real time

---

## Project Structure

```
mobile/
├── App.js                        # Root component: auth state listener, navigation setup
├── app.json                      # Expo configuration (name, icons, orientation, platforms)
├── index.js                      # App entry point (registerRootComponent)
├── package.json
│
├── assets/
│   ├── icon.png                  # App icon
│   ├── adaptive-icon.png         # Android adaptive icon
│   ├── splash-icon.png           # Splash screen image
│   └── favicon.png               # Web favicon
│
├── components/
│   ├── IncidentCard.js           # Tappable card for incident list rows
│   └── StatusChip.js             # Pill badge for status and severity labels
│
├── screens/
│   ├── LoginScreen.js            # Firebase email/password login & registration
│   ├── HomeScreen.js             # Incident dashboard with stats, filters, and map coords
│   ├── ReportScreen.js           # Signal submission form with source/location/template picker
│   ├── TraceScreen.js            # AI multi-signal trace log viewer
│   ├── ResourceScreen.js         # Resource allocation feed
│   └── IncidentDetailScreen.js   # Full incident record + conflict demo trigger
│
└── services/
    ├── api.js                    # Centralized FastAPI backend client (fetch wrapper)
    └── firebase.js               # Firebase app initialization and auth export
```

---

## Screens

### `LoginScreen`
Handles both sign-in and sign-up via Firebase email/password auth. Toggles between login and register mode, shows inline validation alerts, and uses `KeyboardAvoidingView` for mobile-friendly input.

### `HomeScreen`
The main operations dashboard. Displays:
- Live animated pulse indicator for the active feed
- Stat cards (All / Critical / Active / Resolved) that double as filters
- Scrollable `FlatList` of `IncidentCard` components
- Slide-out side menu with sign-out
- Pull-to-refresh backed by the `/incidents` API endpoint

### `ReportScreen`
A signal submission form with:
- Location picker (G-10, F-7, I-8, Downtown, Blue Area, Rawalpindi)
- Source type selector (Field Report, Social Media, Weather API)
- One-tap message templates (Pipe Burst / Flood Confirmation / False Alarm)
- Free-text content input
- Submission routed to `POST /signals`

### `TraceScreen`
Shows AI processing steps for every analyzed signal, pulled from `GET /traces`. Each trace card renders:
- Step icon (signal fusion, credibility check, crisis classification, severity assessment, resource allocation, simulation, notification)
- Confidence badge color-coded green / amber / red
- Reasoning and decision text blocks
- Formatted timestamp

### `ResourceScreen`
Displays all incidents that have resources assigned, grouped by incident. Each resource card shows the resource type (with emoji icon), quantity, and destination. Data is derived from the `resources_assigned` field on each incident.

### `IncidentDetailScreen`
Pushed from `HomeScreen` via `IncidentCard` press. Shows:
- Location and crisis type header
- `StatusChip` badges for severity and status
- List of all assigned resources
- "Trigger Conflict Resolution" button that calls `POST /simulate-conflict` to demo AI re-classification

---

## Components

### `IncidentCard`
```js
<IncidentCard incident={incident} onPress={() => navigate('IncidentDetail', { incident })} />
```
Props:
| Prop | Type | Description |
|------|------|-------------|
| `incident` | `object` | Incident data object from the API |
| `onPress` | `function` | Callback when the card is tapped |

Severity colors: `CRITICAL` → dark red, `HIGH` → red, `MEDIUM` → orange, `LOW` → green, `UNKNOWN` → grey.

### `StatusChip`
```js
<StatusChip label="Active" />
<StatusChip label="CRITICAL" />
```
Props:
| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Status (`Active`, `Resolved`, `Investigating`) or severity (`HIGH`, `CRITICAL`, `MEDIUM`, `LOW`) |

Renders a pill badge with a tinted background and colored border matching the label value.

---

## Services

### `services/api.js`
Centralised fetch wrapper for the FastAPI backend.

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| `api.getIncidents()` | `GET` | `/incidents` | Fetch all active incidents |
| `api.getTraces()` | `GET` | `/traces` | Fetch all AI trace logs |
| `api.submitSignal(source, location, content)` | `POST` | `/signals` | Submit a new field signal |
| `api.simulateConflict()` | `POST` | `/simulate-conflict` | Trigger the conflict resolution demo |

The `BASE_URL` is set at the top of the file and should be updated to point to your deployed backend:
```js
const BASE_URL = 'http://192.168.1.108:8000'; // Change this to your backend URL
```

### `services/firebase.js`
Initialises the Firebase app and exports `auth` (Firebase Auth instance) used across `LoginScreen` and `HomeScreen` (for sign-out).

> The Firebase config in this file contains project-specific keys. Replace them with your own Firebase project credentials — or move them to environment variables — before deploying.

---

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | `^51.0.39` | Build toolchain and dev server |
| `react-native` | `^0.74.5` | Core mobile framework |
| `react` | `18.2.0` | UI library |
| `@react-navigation/native` | `^7.2.4` | Navigation container |
| `@react-navigation/bottom-tabs` | `^7.16.1` | Bottom tab navigator |
| `@react-navigation/stack` | `^7.9.2` | Stack navigator (detail screens) |
| `firebase` | `^12.13.0` | Authentication |
| `axios` | `^1.16.1` | Available for extended API use |
| `react-native-reanimated` | `~3.10.1` | Animations |
| `react-native-gesture-handler` | `~2.16.1` | Gesture support |
| `react-native-screens` | `^4.0.0` | Native screen optimization |
| `react-native-safe-area-context` | `4.10.5` | Safe area insets |
| `react-native-web` | `^0.19.13` | Web target support |

---

## Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Expo CLI** — `npm install -g expo-cli`
- **Expo Go** app on your iOS or Android device (for local development), OR an iOS Simulator / Android Emulator
- A running instance of the FastAPI backend (see backend README)
- A Firebase project with Email/Password auth enabled

---

## Getting Started

1. **Clone the repository and navigate to the frontend folder:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the backend URL** in `services/api.js`:
   ```js
   const BASE_URL = 'http://<your-backend-ip>:8000';
   ```
   If running the backend locally, use your machine's local IP (not `localhost`) so the device/emulator can reach it.

4. **Configure Firebase** in `services/firebase.js` with your own project credentials.

5. **Start the Expo dev server:**
   ```bash
   npm start
   ```

6. Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS), or press `a` / `i` to open an emulator.

---

## Configuration

### Backend URL
Edit the top of `services/api.js`:
```js
const BASE_URL = 'http://YOUR_IP_OR_DOMAIN:8000';
```

### Firebase
Replace the `firebaseConfig` object in `services/firebase.js`:
```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### App Metadata
`app.json` controls the Expo build configuration — app name, version, icons, splash screen, and platform-specific settings. Update the `name` and `slug` fields if you rename the project.

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start dev server | `npm start` | Opens Expo dev menu (QR code, tunnel, etc.) |
| Android | `npm run android` | Opens on Android emulator or connected device |
| iOS | `npm run ios` | Opens on iOS Simulator |
| Web | `npm run web` | Opens in browser via `react-native-web` |

---

## Design System

The app uses a custom dark theme defined inline across StyleSheets:

| Token | Hex | Usage |
|-------|-----|-------|
| Background Deep | `#0B0F19` | Screen backgrounds, headers |
| Surface | `#0F1322` | Tab bar, cards |
| Card | `#1C1C1E` | Incident cards |
| Border | `#2C2C2E` | Card borders |
| Accent Red | `#FF453A` | Active tint, critical severity, CTAs |
| Success Green | `#34C759` | Resolved status, low severity |
| Warning Orange | `#FF9500` | Medium severity, investigating status |
| Critical Dark Red | `#8B0000` | Critical severity badge |
| Text Primary | `#FFFFFF` / `#EBEBF5` | Headers, primary labels |
| Text Muted | `#8E8E93` / `#64748B` | Secondary labels, metadata |

Navigation uses emoji-based tab icons (⚡ Home · 📢 Report · 🧠 Traces · 🛡️ Resources) at `fontSize: 18`.
