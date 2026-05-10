import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { storeService } from '../../services/storeService';
import type { Store } from '../../types/api';
import styles from './AdminStoresPage.module.css';

export default function AdminStoresPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadStores = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await storeService.getAllStores();
            setStores(data);
        } catch {
            setError('Не удалось загрузить магазины');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadStores();
    }, []);

    const stats = useMemo(
        () => [
            { title: 'Total stores', value: String(stores.length) },
            { title: 'Active', value: String(stores.length) },
            { title: 'Inactive', value: '0' },
            { title: 'Pending', value: '0' },
        ],
        [stores]
    );

    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.pageContent}>
                    <div className={styles.titleRow}>
                        <div>
                            <h1>Stores Management</h1>
                            <p>Manage partner stores and their product listings</p>
                        </div>

                        <button type="button" className={styles.addButton} onClick={loadStores}>
                            Refresh
                        </button>
                    </div>

                    {error && <p style={{ color: '#ff3b3b', marginTop: 12 }}>{error}</p>}

                    <div className={styles.statsGrid}>
                        {stats.map((item) => (
                            <div key={item.title} className={styles.statCard}>
                                <div className={styles.statIcon}>▣</div>
                                <div>
                                    <p>{item.title}</p>
                                    <h3>{item.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.tableCard}>
                        {loading ? (
                            <p>Loading stores...</p>
                        ) : (
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Store</th>
                                    <th>Description</th>
                                    <th>Contact</th>
                                    <th>Status</th>
                                    <th>Last Updated</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {stores.map((store) => (
                                    <tr key={store.id}>
                                        <td>{store.title}</td>
                                        <td>{store.description || '-'}</td>
                                        <td>{store.contactInfo || '-'}</td>
                                        <td>
                                                <span className={`${styles.status} ${styles.active}`}>
                                                    Active
                                                </span>
                                        </td>
                                        <td>
                                            {store.updatedAt
                                                ? new Date(store.updatedAt).toLocaleString('ru-RU')
                                                : '-'}
                                        </td>
                                        <td className={styles.actions}>...</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}

                        <div className={styles.pagination}>
                            <span>Showing {stores.length} of {stores.length} stores</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}