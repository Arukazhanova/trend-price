import { createApi } from './createApi';

const API_URL = `${import.meta.env.VITE_STORE_SERVICE_URL}/store-service/api`;

export const storeApi = createApi(API_URL);