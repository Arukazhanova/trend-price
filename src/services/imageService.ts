import { imageApi } from '../ shared/imageApi';

export interface ImageUploadResponse {
    ownerType: string;
    ownerId: string;
    fileName: string;
    url: string;
}

export const imageService = {
    getProductImageUrl(productId: string | number) {
        return `${imageApi.defaults.baseURL}/api/images/product/${productId}`;
    },

    getUserImageUrl(userId: string | number) {
        return `${imageApi.defaults.baseURL}/api/images/user/${userId}`;
    },

    async uploadProductImage(
        productId: string | number,
        file: File
    ): Promise<ImageUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await imageApi.post<ImageUploadResponse>(
            '/api/images/product',
            formData,
            {
                params: { productId },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    },

    async uploadUserImage(
        userId: string | number,
        file: File
    ): Promise<ImageUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await imageApi.post<ImageUploadResponse>(
            '/api/images/user',
            formData,
            {
                params: { userId },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    },

    async deleteProductImage(productId: string | number): Promise<void> {
        await imageApi.delete(`/api/images/product/${productId}`);
    },

    async deleteUserImage(userId: string | number): Promise<void> {
        await imageApi.delete(`/api/images/user/${userId}`);
    },
};