// src/api/createApi.ts
import axios from 'axios';

export const createApi = (baseURL: string) => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    instance.interceptors.request.use((config) => {
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

    instance.interceptors.response.use(
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

    return instance;
};