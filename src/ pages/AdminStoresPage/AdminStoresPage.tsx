import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import styles from './AdminStoresPage.module.css';

const stats = [
    { title: 'Total stories', value: '8' },
    { title: 'Active', value: '6' },
    { title: 'Inactive', value: '1' },
    { title: 'Pending', value: '1' },
];

const stores = [
    { store: 'Magnum', category: 'Supermarket', website: 'www.store.com', products: '5468', priceLevel: 'Low', status: 'Active', updated: '2026-01-17' },
    { store: 'Small', category: 'Supermarket', website: 'www.store.com', products: '4568', priceLevel: 'Medium', status: 'Active', updated: '2026-01-17' },
    { store: 'Arbuz', category: 'Online market', website: 'www.store.com', products: '8795', priceLevel: 'High', status: 'Active', updated: '2026-01-17' },
    { store: 'Galmart', category: 'Supermarket', website: 'www.store.com', products: '4568', priceLevel: 'Low', status: 'Active', updated: '2026-01-17' },
    { store: 'Metro', category: 'Supermarket', website: 'www.store.com', products: '124488', priceLevel: 'Medium', status: 'Active', updated: '2026-01-17' },
    { store: 'Name', category: 'Store', website: 'www.store.com', products: '2145', priceLevel: 'Low', status: 'Active', updated: '2026-01-16' },
    { store: 'Name', category: 'Store', website: 'www.store.com', products: '1458', priceLevel: 'Low', status: 'Inactive', updated: '2026-01-15' },
    { store: 'Name', category: 'Store', website: 'www.store.com', products: '4698', priceLevel: 'High', status: 'Pending', updated: '2026-01-11' },
];

export default function AdminStoresPage() {
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

                        <button type="button" className={styles.addButton}>
                            + Add Store
                        </button>
                    </div>

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
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Store</th>
                                <th>Category</th>
                                <th>Website</th>
                                <th>Products</th>
                                <th>Price Level</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {stores.map((store, index) => (
                                <tr key={`${store.store}-${index}`}>
                                    <td>{store.store}</td>
                                    <td>{store.category}</td>
                                    <td>{store.website}</td>
                                    <td>{store.products}</td>
                                    <td>
                                            <span className={`${styles.badge} ${styles[store.priceLevel.toLowerCase()]}`}>
                                                {store.priceLevel}
                                            </span>
                                    </td>
                                    <td>
                                            <span className={`${styles.status} ${styles[store.status.toLowerCase()]}`}>
                                                {store.status}
                                            </span>
                                    </td>
                                    <td>{store.updated}</td>
                                    <td className={styles.actions}>...</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className={styles.pagination}>
                            <span>Showing 8 of 8 stores</span>

                            <div>
                                <button type="button">Previous</button>
                                <button type="button">Next</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}