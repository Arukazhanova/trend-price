import { priceApi } from '../ shared/priceApi';
import type { Price } from '../types/api';

export interface PriceStats {
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
    averagePrice: number;
    pricesCount: number;
}

const getPriceValue = (price: Price): number => {
    return Number(price.finalPrice ?? price.pricePerUnit ?? 0);
};

const normalizeNumberResponse = (value: unknown): number => {
    if (typeof value === 'number') {
        return value;
    }

    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    if (value && typeof value === 'object') {
        const data = value as {
            totalElements?: number;
            numberOfElements?: number;
            content?: unknown[];
        };

        if (typeof data.totalElements === 'number') {
            return data.totalElements;
        }

        if (typeof data.numberOfElements === 'number') {
            return data.numberOfElements;
        }

        if (Array.isArray(data.content)) {
            return data.content.length;
        }
    }

    return 0;
};

export const priceService = {
    async getAllPrices(): Promise<Price[]> {
        const response = await priceApi.get<Price[]>('/prices');
        return response.data;
    },

    async getPriceById(id: string): Promise<Price> {
        const response = await priceApi.get<Price>(`/prices/${id}`);
        return response.data;
    },

    async getPricesByProductId(productId: string): Promise<Price[]> {
        const response = await priceApi.get<Price[]>(
            `/prices/product/${productId}`
        );

        return response.data;
    },

    async getUpdatedProducts(): Promise<number> {
        const response = await priceApi.get<unknown>('/prices/updated/products');
        return normalizeNumberResponse(response.data);
    },

    async getUpdatedStores(): Promise<number> {
        const response = await priceApi.get<unknown>('/prices/updated/stores');
        return normalizeNumberResponse(response.data);
    },

    async getPricesByProductIdForDays(
        productId: string,
        daysAmount = 30
    ): Promise<Price[]> {
        const response = await priceApi.get<Price[]>(
            `/prices/product/${productId}/days/${daysAmount}`
        );

        return response.data;
    },

    async getPricesByStoreId(storeId: string): Promise<Price[]> {
        const response = await priceApi.get<Price[]>(`/prices/store/${storeId}`);
        return response.data;
    },

    async getPricesByStoreAndProduct(
        storeId: string,
        productId: string
    ): Promise<Price[]> {
        const response = await priceApi.get<Price[]>(
            `/prices/store/${storeId}/product/${productId}`
        );

        return response.data;
    },

    async getBestPriceByProductIdAndCity(
        productId: string,
        city: string
    ): Promise<Price> {
        const response = await priceApi.get<Price>(
            `/prices/best/${productId}/${encodeURIComponent(city)}`
        );

        return response.data;
    },

    async createPrice(price: Partial<Price>): Promise<Price> {
        const response = await priceApi.post<Price>('/prices', price);
        return response.data;
    },

    async createPrices(prices: Partial<Price>[]): Promise<Price[]> {
        const response = await priceApi.post<Price[]>('/prices/massCreate', prices);
        return response.data;
    },

    async updatePrice(id: string, price: Partial<Price>): Promise<Price> {
        const response = await priceApi.put<Price>(`/prices/${id}`, price);
        return response.data;
    },

    async deletePrice(id: string): Promise<void> {
        await priceApi.delete(`/prices/${id}`);
    },

    calculateStats(prices: Price[]): PriceStats {
        const values = prices
            .map(getPriceValue)
            .filter((value) => Number.isFinite(value) && value > 0);

        if (values.length === 0) {
            return {
                currentPrice: 0,
                minPrice: 0,
                maxPrice: 0,
                averagePrice: 0,
                pricesCount: 0,
            };
        }

        const sortedByDate = [...prices].sort((a, b) => {
            const dateA = new Date(a.time ?? a.createdAt ?? 0).getTime();
            const dateB = new Date(b.time ?? b.createdAt ?? 0).getTime();

            return dateA - dateB;
        });

        const latestPrice = sortedByDate[sortedByDate.length - 1];

        return {
            currentPrice: getPriceValue(latestPrice),
            minPrice: Math.min(...values),
            maxPrice: Math.max(...values),
            averagePrice:
                values.reduce((sum, value) => sum + value, 0) / values.length,
            pricesCount: values.length,
        };
    },
};