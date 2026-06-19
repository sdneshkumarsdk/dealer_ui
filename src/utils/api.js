import axios from 'axios';

// Vite sets import.meta.env.MODE based on build/dev commands ('development', 'staging', 'production')
const mode = import.meta.env.MODE;

const baseURL = mode === 'production'
    ? (import.meta.env.VITE_PROD_API_URL)
    : mode === 'staging'
        ? (import.meta.env.VITE_STAGING_API_URL)
        : (import.meta.env.VITE_DEV_API_URL);

const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Auto-inject JWT token into headers of every outgoing request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
