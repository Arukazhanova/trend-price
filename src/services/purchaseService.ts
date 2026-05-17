import { purchaseApi } from '../ shared/purchaseApi';
import type { Like, PageReceipt, Receipt } from '../types/api';

export const purchaseService = {
    async getReceipts(page = 1, size = 20): Promise<PageReceipt> {
        const response = await purchaseApi.get<PageReceipt>('/receipts', {
            params: { page, size },
        });

        return response.data;
    },

    async getReceiptById(id: string): Promise<Receipt> {
        const response = await purchaseApi.get<Receipt>(`/receipts/${id}`);
        return response.data;
    },

    async getReceiptsByUserId(userId: number): Promise<Receipt[]> {
        const response = await purchaseApi.get<Receipt[]>(`/receipts/user/${userId}`);
        return response.data;
    },

    async createReceipt(receipt: Partial<Receipt>): Promise<Receipt> {
        const response = await purchaseApi.post<Receipt>('/receipts', receipt);
        return response.data;
    },

    async updateReceipt(id: string, receipt: Partial<Receipt>): Promise<Receipt> {
        const response = await purchaseApi.put<Receipt>(`/receipts/${id}`, receipt);
        return response.data;
    },

    async deleteReceipt(id: string): Promise<Receipt> {
        const response = await purchaseApi.delete<Receipt>(`/receipts/${id}`);
        return response.data;
    },

    async getAllLikes(): Promise<Like[]> {
        const response = await purchaseApi.get<Like[]>('/likes');
        return response.data;
    },

    async getLikesByUserId(userId: number): Promise<Like[]> {
        const response = await purchaseApi.get<Like[]>(`/likes/user/${userId}`);
        return response.data;
    },

    async createLike(like: Partial<Like>): Promise<Like> {
        const response = await purchaseApi.post<Like>('/likes', like);
        return response.data;
    },

    async deleteLike(id: string): Promise<Like> {
        const response = await purchaseApi.delete<Like>(`/likes/${id}`);
        return response.data;
    },
};