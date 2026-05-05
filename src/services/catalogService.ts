import { catalogApi } from '../ shared/catalogApi';
import type {
    CatalogProductsPage,
    ProductPriceViewWithCategory,
} from '../types/api';

export const catalogService = {
    async isAlive(): Promise<Record<string, string>> {
        const response = await catalogApi.get<Record<string, string>>(
            '/catalog/isAlive'
        );

        return response.data;
    },

    async getProductPrice(
        productId: string,
        dayAmount = 1
    ): Promise<ProductPriceViewWithCategory> {
        const response = await catalogApi.get<ProductPriceViewWithCategory>(
            `/catalog/products/${productId}/prices/${dayAmount}`
        );

        return response.data;
    },

    async searchProducts(params?: {
        page?: number;
        size?: number;
        title?: string;
        category?: string[];
        brand?: string[];
        type?: string[];
    }): Promise<CatalogProductsPage> {
        const response = await catalogApi.get<CatalogProductsPage>(
            '/catalog/products/search',
            {
                params: {
                    page_number: params?.page ?? 1,
                    page_size: params?.size ?? 20,
                    title: params?.title || undefined,
                    category: params?.category?.length
                        ? params.category
                        : undefined,
                    brand: params?.brand?.length ? params.brand : undefined,
                    type: params?.type?.length ? params.type : undefined,
                },
                paramsSerializer: {
                    indexes: null,
                },
            }
        );

        return response.data;
    },
};