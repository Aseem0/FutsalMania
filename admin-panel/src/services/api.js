import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Arena Operations for Manager
export const updateManagerArena = (arenaData) => {
  return api.put('/manager/arena', arenaData);
};

export const createManagerBooking = (bookingData) => {
  return api.post('/manager/bookings', bookingData);
};

export const updateManagerBooking = (id, status) => {
  return api.patch(`/manager/bookings/${id}`, { status });
};

export const deleteManagerBooking = (id) => {
  return api.delete(`/manager/bookings/${id}`);
};

export const fetchTournamentRegistrations = (id) => {
  return api.get(`/tournaments/${id}/registrations`);
};

export const deleteTournamentRegistration = (registrationId) => {
  return api.delete(`/tournaments/registrations/${registrationId}`);
};

export default api;
