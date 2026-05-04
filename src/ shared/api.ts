import axios from 'axios';

const API_URL = '/user-service/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Axios baseURL:', API_URL);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const url = config.url ?? '';

    const isPublicAuthRoute =
        url.startsWith('/auth/login') ||
        url.startsWith('/auth/register') ||
        url.startsWith('/auth/verify-email') ||
        url.startsWith('/auth/resend-verification') ||
        url.startsWith('/auth/forgot-password') ||
        url.startsWith('/auth/reset-password');

    if (token && !isPublicAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url ?? '';
        const isProtectedRoute = !url.startsWith('/auth/');

        if (error.response?.status === 401 && isProtectedRoute) {
            localStorage.removeItem('token');
        }

        return Promise.reject(error);
    }
);