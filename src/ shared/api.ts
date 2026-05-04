import axios from 'axios';

const API_URL = `${import.meta.env.VITE_USER_SERVICE_URL}/user-service/api`;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('VITE_USER_SERVICE_URL:', import.meta.env.VITE_USER_SERVICE_URL);
console.log('Axios baseURL:', API_URL);

const publicAuthRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-email',
    '/auth/resend-verification',
    '/auth/forgot-password',
    '/auth/reset-password',
];

const isPublicAuthUrl = (url: string) => {
    return publicAuthRoutes.some((route) => url.includes(route));
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const url = config.url ?? '';
        const method = config.method?.toUpperCase() ?? 'UNKNOWN';

        const isPublicAuthRoute = isPublicAuthUrl(url);

        if (token && !isPublicAuthRoute) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }

        const fullUrl = `${config.baseURL ?? ''}${url}`;

        console.group(`API REQUEST: ${method} ${fullUrl}`);
        console.log('baseURL:', config.baseURL);
        console.log('url:', config.url);
        console.log('method:', method);
        console.log('is public auth route:', isPublicAuthRoute);
        console.log('token exists:', Boolean(token));
        console.log('request headers:', config.headers);
        console.log('request body:', config.data);
        console.groupEnd();

        return config;
    },
    (error) => {
        console.group('API REQUEST SETUP ERROR');
        console.error(error);
        console.groupEnd();

        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        const method = response.config.method?.toUpperCase() ?? 'UNKNOWN';
        const url = response.config.url ?? '';
        const fullUrl = `${response.config.baseURL ?? ''}${url}`;

        console.group(`API RESPONSE SUCCESS: ${method} ${fullUrl}`);
        console.log('status:', response.status);
        console.log('response headers:', response.headers);
        console.log('response data:', response.data);
        console.groupEnd();

        return response;
    },
    (error) => {
        if (axios.isAxiosError(error)) {
            const method = error.config?.method?.toUpperCase() ?? 'UNKNOWN';
            const url = error.config?.url ?? '';
            const fullUrl = `${error.config?.baseURL ?? ''}${url}`;

            console.group(`API RESPONSE ERROR: ${method} ${fullUrl}`);
            console.error('message:', error.message);
            console.log('status:', error.response?.status);
            console.log('status text:', error.response?.statusText);
            console.log('request headers:', error.config?.headers);
            console.log('request body:', error.config?.data);
            console.log('response headers:', error.response?.headers);
            console.log('response data:', error.response?.data);
            console.groupEnd();

            const isProtectedRoute = !isPublicAuthUrl(url);

            if (error.response?.status === 401 && isProtectedRoute) {
                localStorage.removeItem('token');
            }
        } else {
            console.group('UNKNOWN API ERROR');
            console.error(error);
            console.groupEnd();
        }

        return Promise.reject(error);
    }
);