// Central API service for connecting to the FastAPI backend
// Change BASE_URL to your deployed backend URL when hosting

const BASE_URL = 'http://'; // Auto-detected local IP

export const api = {
  // Get all active incidents
  getIncidents: async () => {
    const response = await fetch(`${BASE_URL}/incidents`);
    if (!response.ok) throw new Error('Failed to fetch incidents');
    return response.json();
  },

  // Get all AI trace logs
  getTraces: async () => {
    const response = await fetch(`${BASE_URL}/traces`);
    if (!response.ok) throw new Error('Failed to fetch traces');
    return response.json();
  },

  // Submit a new field report signal
  submitSignal: async (source, location, content) => {
    const response = await fetch(`${BASE_URL}/signals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, location, content }),
    });
    if (!response.ok) throw new Error('Failed to submit signal');
    return response.json();
  },

  // Trigger the conflict resolution demo scenario
  simulateConflict: async () => {
    const response = await fetch(`${BASE_URL}/simulate-conflict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '',
    });
    if (!response.ok) throw new Error('Failed to simulate conflict');
    return response.json();
  },
};
