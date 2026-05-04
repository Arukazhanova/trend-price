import { createApi } from './createApi';

const API_URL = `${import.meta.env.VITE_CATALOG_SERVICE_URL}/catalog-service`;

export const catalogApi = createApi(API_URL);