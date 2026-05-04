import { createApi } from './createApi';

const API_URL = `${import.meta.env.VITE_USER_SERVICE_URL}/user-service/api`;

export const userApi = createApi(API_URL);