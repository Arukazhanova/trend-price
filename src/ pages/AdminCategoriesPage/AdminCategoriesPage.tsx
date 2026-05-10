import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { productService } from '../../services/productService';
import type { Category, Product } from '../../types/api';
import styles from './AdminCategoriesPage.module.css';

const colors = ['pink', 'blue', 'orange', 'yellow', 'green', 'mint', 'purple'];

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError('');

            try {
                const [loadedCategories, loadedProducts] = await Promise.all([
                    productService.getAllCategories(),
                    productService.getAllProducts(),
                ]);

                setCategories(loadedCategories);
                setProducts(loadedProducts);
            } catch {
                setError('Не удалось загрузить категории');
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, []);

    const productCountByCategoryId = useMemo(() => {
        const map: Record<string, number> = {};

        products.forEach((product) => {
            product.categories?.forEach((category) => {
                map[category.id] = (map[category.id] ?? 0) + 1;
            });
        });

        return map;
    }, [products]);

    const stats = [
        { title: 'Total categories', value: String(categories.length) },
        { title: 'Total Products', value: String(products.length) },
        {
            title: 'Avg Products/Category',
            value: categories.length ? String(Math.round(products.length / categories.length)) : '0',
        },
    ];

    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.pageContent}>
                    <div className={styles.titleRow}>
                        <div>
                            <h1>Categories</h1>
                            <p>Organize products into categories for easy navigation</p>
                        </div>
                    </div>

                    {error && <p style={{ color: '#ff3b3b', marginBottom: 12 }}>{error}</p>}

                    <div className={styles.statsGrid}>
                        {stats.map((item) => (
                            <div key={item.title} className={styles.statCard}>
                                <div className={styles.statIcon} />
                                <div>
                                    <p>{item.title}</p>
                                    <h3>{item.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {loading ? (
                        <p>Loading categories...</p>
                    ) : (
                        <div className={styles.categoriesGrid}>
                            {categories.map((category, index) => (
                                <div
                                    key={category.id}
                                    className={`${styles.categoryCard} ${styles[colors[index % colors.length]]}`}
                                >
                                    <h3>{category.title}</h3>
                                    <p>{productCountByCategoryId[category.id] ?? 0} products</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}