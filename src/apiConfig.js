// src/apiConfig.js
const API_BASE = 'http://localhost:5000/api';

export default {
  doctors: {
    getAll: `${API_BASE}/doctors`,
    getById: (id) => `${API_BASE}/doctors/${id}`,
    create: `${API_BASE}/doctors`,
    update: (id) => `${API_BASE}/doctors/${id}`,
    delete: (id) => `${API_BASE}/doctors/${id}`,
    todayTickets: (id) => `${API_BASE}/doctors/${id}/tickets/today`
  },
  tickets: {
    getAll: `${API_BASE}/tickets`,
    getByDoctor: (doctorId) => `${API_BASE}/tickets?doctorId=${doctorId}`
  }
};