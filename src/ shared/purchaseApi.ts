import axios from 'axios';

const API_URL = `${import.meta.env.VITE_PURCHASE_SERVICE_URL}/purchase-service/api`;

export const purchaseApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

purchaseApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.group('PURCHASE API REQUEST');
    console.log('url:', `${config.baseURL}${config.url}`);
    console.log('method:', config.method);
    console.log('token exists:', Boolean(token));
    console.log('headers:', config.headers);
    console.log('body:', config.data);
    console.groupEnd();

    return config;
});

purchaseApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.group('PURCHASE API ERROR');
        console.log('status:', error.response?.status);
        console.log('response:', error.response?.data);
        console.log('headers:', error.config?.headers);
        console.groupEnd();

        return Promise.reject(error);
    }
);