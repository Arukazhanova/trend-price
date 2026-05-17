export type ID = string;

export interface Brand {
    id: ID;
    title: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Category {
    id: ID;
    title: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Product {
    id: ID;
    title: string;
    type?: string;
    brand?: Brand | string | null;
    categories?: Category[];
    barcode?: string;
    checked?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PageProduct {
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    size: number;
    content: Product[];
    number: number;
    numberOfElements: number;
    empty: boolean;
}

export interface Price {
    id: ID;
    productId: ID;
    storeId: ID;
    unitAmount?: number;
    unit?: string;
    pricePerUnit?: number;
    currency?: string;
    city?: string;
    discount?: number;
    finalPrice?: number;
    time?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Store {
    id: ID;
    title: string;
    description?: string;
    contactInfo?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StoreStatus {
    id: ID;
    title: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StoreBranch {
    id: ID;
    store?: Store;
    status?: StoreStatus;
    openHours?: string;
    latitude?: number;
    longitude?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductPriceViewWithCategory {
    product: Product;
    categories: Category[];
    prices: Price[];
    bestPrice?: Price | null;
}
export interface CatalogProduct {
    id: ID;
    title: string;
    type?: string | null;
    brand?: Brand | string | null;
    barcode?: string | null;
    categories?: Category[];
    bestPrice?: Price | null;
}

export interface CatalogProductsPage {
    content: CatalogProduct[];
    number: number;
    pageNumber: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
}
export interface Purchase {
    id?: ID;
    productId: ID;
    priceId?: ID;
    priceValue: number;
    purchaseDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Receipt {
    id?: ID;
    purchases: Purchase[];
    userId: number;
    priceValue: number;
    receiptDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Like {
    id: ID;
    productId: ID;
    userId: number;
}

export interface PageReceipt {
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    size: number;
    content: Receipt[];
    number: number;
    numberOfElements: number;
    empty: boolean;
}