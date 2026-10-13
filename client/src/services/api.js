import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('signbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle auth expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (window.location.pathname.startsWith('/dashboard')) {
        localStorage.removeItem('signbridge_token');
        localStorage.removeItem('signbridge_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  updatePreferences: async (preferences) => {
    const res = await apiClient.put('/auth/preferences', preferences);
    return res.data;
  },
};

export const signsApi = {
  getSigns: async (category = '', search = '') => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    const res = await apiClient.get(`/signs?${params.toString()}`);
    return res.data;
  },
  getCategories: async () => {
    const res = await apiClient.get('/signs/categories');
    return res.data;
  },
  getSignById: async (id) => {
    const res = await apiClient.get(`/signs/${id}`);
    return res.data;
  },
};

export const aiApi = {
  getStatus: async () => {
    const res = await apiClient.get('/ai/status');
    return res.data;
  },
  simplify: async (text) => {
    const res = await apiClient.post('/ai/simplify', { text });
    return res.data;
  },
  translate: async (text, targetLang = 'te') => {
    const res = await apiClient.post('/ai/translate', { text, targetLang });
    return res.data;
  },
  compose: async (intent, context = 'general') => {
    const res = await apiClient.post('/ai/compose', { intent, context });
    return res.data;
  },
};

export const healthApi = {
  check: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },
};

export default apiClient;
