import { productApi } from '../ shared/productApi';
import { catalogApi } from '../ shared/catalogApi';
import type {
    Brand,
    Category,
    PageProduct,
    Product,
    ProductPriceViewWithCategory,
} from '../types/api';
export const productService = {
    async getAllProducts(): Promise<Product[]> {
        const response = await productApi.get<Product[]>('/products');
        return response.data;
    },

    async getProductsByPage(pageNumber = 0, size = 20): Promise<PageProduct> {
        const response = await productApi.get<PageProduct>(
            `/products/page/${pageNumber}`,
            {
                params: { page_size: size },
            }
        );

        return response.data;
    },

    async getProductById(id: string): Promise<Product> {
        const response = await productApi.get<Product>(`/products/${id}`);
        return response.data;
    },

    async searchProducts(params: {
        page?: number;
        size?: number;
        title?: string;
        category?: string[];
        brand?: string[];
        type?: string[];
    }): Promise<PageProduct> {
        const response = await productApi.get<PageProduct>('/products/search', {
            params: {
                page_number: params.page ?? 1,
                page_size: params.size ?? 20,
                title: params.title || undefined,
                category: params.category?.length ? params.category : undefined,
                brand: params.brand?.length ? params.brand : undefined,
                type: params.type?.length ? params.type : undefined,
            },
            paramsSerializer: { indexes: null },
        });

        return response.data;
    },

    async getAllCategories(): Promise<Category[]> {
        const response = await productApi.get<Category[]>('/categories');
        return response.data;
    },
    async getAllBrands(): Promise<Brand[]> {
        const response = await productApi.get<Brand[]>('/brands');
        return response.data;
    },
    async getProductsByCategory(categoryId: string): Promise<Product[]> {
        const response = await productApi.get<Product[]>(
            `/categories/${categoryId}/products`
        );

        return response.data;
    },

    async getCatalogProductPrice(
        productId: string,
        dayAmount = 30
    ): Promise<ProductPriceViewWithCategory> {
        const response = await catalogApi.get<ProductPriceViewWithCategory>(
            `/catalog/products/${productId}/prices/${dayAmount}`
        );

        return response.data;
    },

    async createProduct(product: Partial<Product>): Promise<Product> {
        const response = await productApi.post<Product>('/products', product);
        return response.data;
    },

    async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
        const response = await productApi.put<Product>(`/products/${id}`, product);
        return response.data;
    },

    async deleteProduct(id: string): Promise<Product> {
        const response = await productApi.delete<Product>(`/products/${id}`);
        return response.data;
    },

    async createCategory(category: Partial<Category>): Promise<Category> {
        const response = await productApi.post<Category>('/categories', category);
        return response.data;
    },

    async updateCategory(
        id: string,
        category: Partial<Category>
    ): Promise<Category> {
        const response = await productApi.put<Category>(
            `/categories/${id}`,
            category
        );

        return response.data;
    },

    async deleteCategory(id: string): Promise<Category> {
        const response = await productApi.delete<Category>(`/categories/${id}`);
        return response.data;
    },
};