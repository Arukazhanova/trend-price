import { createApi } from './createApi';

const API_URL = `${import.meta.env.VITE_PRODUCT_SERVICE_URL}/product-service/api`;

export const productApi = createApi(API_URL);