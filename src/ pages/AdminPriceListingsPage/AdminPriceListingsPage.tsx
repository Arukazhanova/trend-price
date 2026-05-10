import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { priceService } from '../../services/priceService';
import { productService } from '../../services/productService';
import { storeService } from '../../services/storeService';
import type { Price, Product, Store } from '../../types/api';
import styles from './AdminPriceListingsPage.module.css';

const formatPrice = (value?: number) => {
    return Number.isFinite(Number(value))
        ? `${Math.round(Number(value)).toLocaleString('ru-RU')}₸`
        : '-';
};

export default function AdminPriceListingsPage() {
    const [prices, setPrices] = useState<Price[]>([]);
    const [products, setProducts] = useState<Record<string, Product>>({});
    const [stores, setStores] = useState<Record<string, Store>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError('');

            try {
                const [loadedPrices, loadedProducts, loadedStores] = await Promise.all([
                    priceService.getAllPrices(),
                    productService.getAllProducts(),
                    storeService.getAllStores(),
                ]);

                setPrices(loadedPrices);

                setProducts(
                    Object.fromEntries(
                        loadedProducts.map((product) => [product.id, product])
                    )
                );

                setStores(
                    Object.fromEntries(
                        loadedStores.map((store) => [store.id, store])
                    )
                );
            } catch {
                setError('Не удалось загрузить цены');
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, []);

    const lowestByProduct = useMemo(() => {
        const map: Record<string, number> = {};

        prices.forEach((price) => {
            const value = Number(price.finalPrice ?? price.pricePerUnit ?? 0);

            if (!Number.isFinite(value) || value <= 0) return;

            map[price.productId] = Math.min(map[price.productId] ?? value, value);
        });

        return map;
    }, [prices]);

    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.pageContent}>
                    <div className={styles.titleRow}>
                        <div>
                            <h1>Price Listings</h1>
                            <p>Track and manage price comparisons across all stores</p>
                        </div>
                    </div>

                    {error && <p style={{ color: '#ff3b3b', marginBottom: 12 }}>{error}</p>}

                    <div className={styles.tableCard}>
                        {loading ? (
                            <p>Loading prices...</p>
                        ) : (
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Store</th>
                                    <th>Current Price</th>
                                    <th>Discount</th>
                                    <th>Lowest Market</th>
                                    <th>City</th>
                                    <th>Updated</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {prices.map((item) => {
                                    const current = Number(item.finalPrice ?? item.pricePerUnit ?? 0);
                                    const lowest = lowestByProduct[item.productId];
                                    const isLowest = lowest && current === lowest;

                                    return (
                                        <tr key={item.id}>
                                            <td>{products[item.productId]?.title ?? item.productId}</td>
                                            <td>{stores[item.storeId]?.title ?? item.storeId}</td>
                                            <td>{formatPrice(current)}</td>
                                            <td>
                                                    <span
                                                        className={`${styles.change} ${
                                                            Number(item.discount) > 0
                                                                ? styles.down
                                                                : styles.neutral
                                                        }`}
                                                    >
                                                        {item.discount ? `${item.discount}%` : '0%'}
                                                    </span>
                                            </td>
                                            <td>{isLowest ? 'Best' : formatPrice(lowest)}</td>
                                            <td>{item.city || '-'}</td>
                                            <td>
                                                {item.updatedAt
                                                    ? new Date(item.updatedAt).toLocaleString('ru-RU')
                                                    : '-'}
                                            </td>
                                            <td className={styles.actions}>...</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        )}

                        <div className={styles.pagination}>
                            <span>Showing {prices.length} prices</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}