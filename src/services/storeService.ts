import { storeApi } from '../ shared/storeApi';
import type { Store, StoreBranch, StoreStatus } from '../types/api';

export const storeService = {
    async getAllStores(): Promise<Store[]> {
        const response = await storeApi.get<Store[]>('/stores');
        return response.data;
    },

    async getStoreById(id: string): Promise<Store> {
        const response = await storeApi.get<Store>(`/stores/${id}`);
        return response.data;
    },

    async searchStores(title: string): Promise<Store[]> {
        const response = await storeApi.get<Store[]>('/stores/search', {
            params: { title },
        });

        return response.data;
    },

    async createStore(store: Partial<Store>): Promise<Store> {
        const response = await storeApi.post<Store>('/stores', store);
        return response.data;
    },

    async updateStore(id: string, store: Partial<Store>): Promise<Store> {
        const response = await storeApi.put<Store>(`/stores/${id}`, store);
        return response.data;
    },

    async deleteStore(id: string): Promise<void> {
        await storeApi.delete(`/stores/${id}`);
    },

    async getAllStoreBranches(): Promise<StoreBranch[]> {
        const response = await storeApi.get<StoreBranch[]>('/store-branches');
        return response.data;
    },

    async getStoreBranchById(id: string): Promise<StoreBranch> {
        const response = await storeApi.get<StoreBranch>(`/store-branches/${id}`);
        return response.data;
    },

    async searchStoreBranches(params: {
        title?: string;
        status?: string;
        openHours?: string;
    }): Promise<StoreBranch[]> {
        const response = await storeApi.get<StoreBranch[]>('/store-branches/search', {
            params,
        });

        return response.data;
    },

    async createStoreBranch(branch: Partial<StoreBranch>): Promise<StoreBranch> {
        const response = await storeApi.post<StoreBranch>('/store-branches', branch);
        return response.data;
    },

    async updateStoreBranch(
        id: string,
        branch: Partial<StoreBranch>
    ): Promise<StoreBranch> {
        const response = await storeApi.patch<StoreBranch>(
            `/store-branches/${id}`,
            branch
        );

        return response.data;
    },

    async deleteStoreBranch(id: string): Promise<void> {
        await storeApi.delete(`/store-branches/${id}`);
    },

    async getAllStoreStatuses(): Promise<StoreStatus[]> {
        const response = await storeApi.get<StoreStatus[]>('/statuses');
        return response.data;
    },

    async getStoreStatusById(id: string): Promise<StoreStatus> {
        const response = await storeApi.get<StoreStatus>(`/statuses/${id}`);
        return response.data;
    },

    async searchStoreStatuses(title: string): Promise<StoreStatus[]> {
        const response = await storeApi.get<StoreStatus[]>('/statuses/search', {
            params: { title },
        });

        return response.data;
    },

    async createStoreStatus(status: Partial<StoreStatus>): Promise<StoreStatus> {
        const response = await storeApi.post<StoreStatus>('/statuses', status);
        return response.data;
    },

    async updateStoreStatus(
        id: string,
        status: Partial<StoreStatus>
    ): Promise<StoreStatus> {
        const response = await storeApi.put<StoreStatus>(`/statuses/${id}`, status);
        return response.data;
    },

    async deleteStoreStatus(id: string): Promise<void> {
        await storeApi.delete(`/statuses/${id}`);
    },
};