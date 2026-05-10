import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { productService } from '../../services/productService';
import { priceService } from '../../services/priceService';
import type { Product } from '../../types/api';
import styles from './AdminProductsPage.module.css';

const getBrandTitle = (product: Product) => {
    if (!product.brand) return '-';
    return typeof product.brand === 'string' ? product.brand : product.brand.title;
};

const getCategoryTitle = (product: Product) => {
    return product.categories?.map((category) => category.title).join(', ') || '-';
};

const formatPrice = (value: number) => `${Math.round(value).toLocaleString('ru-RU')}₸`;

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [priceRanges, setPriceRanges] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError('');

            try {
                const page = await productService.getProductsByPage(1, 20);
                const loadedProducts = page.content ?? [];

                setProducts(loadedProducts);

                const ranges = await Promise.all(
                    loadedProducts.slice(0, 20).map(async (product) => {
                        try {
                            const prices = await priceService.getPricesByProductId(product.id);

                            const values = prices
                                .map((price) => Number(price.finalPrice ?? price.pricePerUnit ?? 0))
                                .filter((price) => Number.isFinite(price) && price > 0);

                            if (!values.length) {
                                return [product.id, '-'] as const;
                            }

                            return [
                                product.id,
                                `${formatPrice(Math.min(...values))}–${formatPrice(Math.max(...values))}`,
                            ] as const;
                        } catch {
                            return [product.id, '-'] as const;
                        }
                    })
                );

                setPriceRanges(Object.fromEntries(ranges));
            } catch {
                setError('Не удалось загрузить продукты');
            } finally {
                setLoading(false);
            }
        };

        void loadProducts();
    }, []);

    const checkedCount = useMemo(
        () => products.filter((product) => product.checked).length,
        [products]
    );

    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.pageContent}>
                    <div className={styles.titleRow}>
                        <div>
                            <h1>Products Management</h1>
                            <p>Manage product catalog and track prices across stores</p>
                            <p>Total: {products.length} • Checked: {checkedCount}</p>
                        </div>
                    </div>

                    {error && <p style={{ color: '#ff3b3b', marginBottom: 12 }}>{error}</p>}

                    <div className={styles.tableCard}>
                        {loading ? (
                            <p>Loading products...</p>
                        ) : (
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Brand</th>
                                    <th>Category</th>
                                    <th>Barcode</th>
                                    <th>Price Range</th>
                                    <th>Availability</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.title}</td>
                                        <td>{getBrandTitle(product)}</td>
                                        <td>{getCategoryTitle(product)}</td>
                                        <td>{product.barcode || '-'}</td>
                                        <td>{priceRanges[product.id] ?? '...'}</td>
                                        <td>
                                                <span
                                                    className={`${styles.status} ${
                                                        product.checked ? styles.inStock : styles.lowStock
                                                    }`}
                                                >
                                                    {product.checked ? 'Checked' : 'Need check'}
                                                </span>
                                        </td>
                                        <td className={styles.actions}>...</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}

                        <div className={styles.pagination}>
                            <span>Showing {products.length} products</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}