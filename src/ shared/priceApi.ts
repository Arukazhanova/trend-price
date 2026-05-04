import { createApi } from './createApi';

const API_URL = `${import.meta.env.VITE_PRICE_SERVICE_URL}/price-service/api`;

export const priceApi = createApi(API_URL);