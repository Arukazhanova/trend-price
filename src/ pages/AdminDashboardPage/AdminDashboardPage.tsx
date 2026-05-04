import styles from './AdminDashboardPage.module.css';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';

const stats = [
    { title: 'Total stores', value: '9', change: '+2' },
    { title: 'Total Products', value: '12 645', change: '+324' },
    { title: 'Prices Updated Today', value: '9756', change: '+12%' },
    { title: 'Active Users', value: '8454', change: '+5.2%' },
    { title: 'Promotions Running', value: '4', change: '-1' },
    { title: 'Price Alerts', value: '156', change: '+25' },
];

const stores = [
    { name: 'Magnum', change: '-12%' },
    { name: 'Small', change: '-8%' },
    { name: 'Arbuz', change: '-6%' },
    { name: 'Galmart', change: '-2.1%' },
    { name: 'METRO', change: '0%' },
];

const products = [
    { name: 'Organic Whole Milk', category: 'Dairy', price: '$4.99 - $7.49' },
    { name: 'Free Range Eggs (12)', category: 'Dairy', price: '$5.99 - $8.99' },
    { name: 'Avocados (4 pack)', category: 'Produce', price: '$3.99 - $6.99' },
    { name: 'Sourdough Bread', category: 'Bakery', price: '$4.49 - $6.99' },
    { name: 'Ground Coffee', category: 'Beverages', price: '$8.99 - $12.99' },
];

export default function AdminDashboardPage() {
    return (
        <div className={styles.adminPage}>
            <AdminSidebar />
            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.dashboard}>
                    <div className={styles.titleRow}>
                        <div>
                            <h1>Dashboard</h1>
                            <p>Welcome back, John. Here is what is happening today.</p>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.refresh}>Refresh</button>
                            <button className={styles.export}>Export</button>
                        </div>
                    </div>

                    <div className={styles.statsGrid}>
                        {stats.map((item) => (
                            <div key={item.title} className={styles.statCard}>
                                <div className={styles.statIcon} />
                                <span className={styles.change}>{item.change}</span>
                                <p>{item.title}</p>
                                <h3>{item.value}</h3>
                            </div>
                        ))}
                    </div>

                    <div className={styles.chartsGrid}>
                        <div className={styles.card}>
                            <h3>Price Changes Trend</h3>
                            <div className={styles.fakeChart}>
                                <div className={styles.lineGreen} />
                                <div className={styles.lineRed} />
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h3>Category Performance</h3>
                            <div className={styles.barChart}>
                                <span style={{ height: '40%' }} />
                                <span style={{ height: '90%' }} />
                                <span style={{ height: '50%' }} />
                                <span style={{ height: '35%' }} />
                                <span style={{ height: '65%' }} />
                                <span style={{ height: '75%' }} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.bottomGrid}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3>Lowest Price Stores</h3>
                                <button>View All</button>
                            </div>

                            {stores.map((store, index) => (
                                <div key={store.name} className={styles.storeRow}>
                                    <span>{index + 1}</span>
                                    <p>{store.name}</p>
                                    <b>{store.change}</b>
                                </div>
                            ))}
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3>Latest Added Products</h3>
                                <button>View All</button>
                            </div>

                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price Range</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((product) => (
                                    <tr key={product.name}>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{product.price}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}