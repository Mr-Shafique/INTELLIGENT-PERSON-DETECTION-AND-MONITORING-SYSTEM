import { mockPersons, mockDetectionLogs } from './mockData';

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Persons API
  getPersons: async () => {
    await delay(500);
    return { data: mockPersons };
  },

  addPerson: async (person) => {
    await delay(500);
    const newPerson = {
      id: mockPersons.length + 1,
      ...person,
      lastSeen: new Date().toISOString(),
    };
    mockPersons.push(newPerson);
    return { data: newPerson };
  },

  updatePerson: async (id, updates) => {
    await delay(500);
    const index = mockPersons.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockPersons[index] = { ...mockPersons[index], ...updates };
      return { data: mockPersons[index] };
    }
    throw new Error('Person not found');
  },

  deletePerson: async (id) => {
    await delay(500);
    const index = mockPersons.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockPersons.splice(index, 1);
      return { success: true };
    }
    throw new Error('Person not found');
  },

  // Detection Logs API
  getDetectionLogs: async () => {
    await delay(500);
    return { data: mockDetectionLogs };
  },

  addDetectionLog: async (log) => {
    await delay(500);
    const newLog = {
      id: mockDetectionLogs.length + 1,
      ...log,
      timestamp: new Date().toISOString(),
    };
    mockDetectionLogs.unshift(newLog);
    return { data: newLog };
  },

  // Settings API
  updateSettings: async (settings) => {
    await delay(500);
    localStorage.setItem('settings', JSON.stringify(settings));
    return { data: settings };
  },

  getSettings: async () => {
    await delay(500);
    const settings = localStorage.getItem('settings');
    return { data: settings ? JSON.parse(settings) : {} };
  },
}; 