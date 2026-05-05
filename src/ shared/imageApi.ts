import { createApi } from './createApi';

const API_URL = `${import.meta.env.VITE_IMAGE_SERVICE_URL}/image-service`;

export const imageApi = createApi(API_URL);