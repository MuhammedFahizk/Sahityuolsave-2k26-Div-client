
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
};

// ── Create Axios Instance ──
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──
// Automatically adds token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['x-admin-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──
// Handles errors globally — no need to check in every component
api.interceptors.response.use(
  (response) => response.data,  // return data directly — no need for res.data everywhere
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    // If 401 — token expired or invalid — auto logout
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);

// ── Named exports for clean usage ──
export const get  = (url)        => api.get(url);
export const post = (url, data)  => api.post(url, data);
export const put  = (url, data)  => api.put(url, data);
export const del  = (url)        => api.delete(url);

// ── File upload — multipart/form-data ──
export const upload = (url, formData) =>
  api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default api;