import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import styles from './AdminPriceListingsPage.module.css';

const priceListings = [
    {
        product: 'products',
        store: 'Name',
        currentPrice: '2300₸',
        previousPrice: '2670₸',
        change: '-13%',
        lowestMarket: '2100₸',
        updated: '2026-01-15 09:30',
    },
    {
        product: 'products',
        store: 'Name',
        currentPrice: '2300₸',
        previousPrice: '2670₸',
        change: '-13%',
        lowestMarket: '2100₸',
        updated: '2026-01-15 08:15',
    },
    {
        product: 'products',
        store: 'Name',
        currentPrice: '2300₸',
        previousPrice: '2670₸',
        change: '-13%',
        lowestMarket: '2100₸',
        updated: '2026-01-15 10:00',
    },
    {
        product: 'products',
        store: 'Name',
        currentPrice: '2300₸',
        previousPrice: '2670₸',
        change: '-13%',
        lowestMarket: '2100₸',
        updated: '2026-01-15 07:45',
    },
    {
        product: 'products',
        store: 'Name',
        currentPrice: '2670₸',
        previousPrice: '2300₸',
        change: '+13%',
        lowestMarket: '2100₸',
        updated: '2026-01-14 16:20',
    },
    {
        product: 'products',
        store: 'Name',
        currentPrice: '2300₸',
        previousPrice: '2300₸',
        change: '0%',
        lowestMarket: '2100₸',
        updated: '2026-01-15 11:00',
    },
    {
        product: 'products',
        store: 'Name',
        currentPrice: '2300₸',
        previousPrice: '2670₸',
        change: '-13%',
        lowestMarket: '2100₸',
        updated: '2026-01-15 07:45',
    },
    {
        product: 'products',
        store: 'Name',
        currentPrice: '2300₸',
        previousPrice: '2670₸',
        change: '-13%',
        lowestMarket: '2100₸',
        updated: '2026-01-15 10:00',
    },
];

export default function AdminPriceListingsPage() {
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

                        <div className={styles.filters}>
                            <button type="button">All categories⌄</button>
                            <button type="button">All status⌄</button>
                        </div>
                    </div>

                    <div className={styles.tableCard}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Stores</th>
                                <th>Current Price</th>
                                <th>Previous Price</th>
                                <th>Change</th>
                                <th>Lowest Market</th>
                                <th>Updated</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {priceListings.map((item, index) => (
                                <tr key={`${item.product}-${index}`}>
                                    <td>{item.product}</td>
                                    <td>{item.store}</td>
                                    <td>{item.currentPrice}</td>
                                    <td>{item.previousPrice}</td>
                                    <td>
                                            <span
                                                className={`${styles.change} ${
                                                    item.change.startsWith('+')
                                                        ? styles.up
                                                        : item.change.startsWith('-')
                                                            ? styles.down
                                                            : styles.neutral
                                                }`}
                                            >
                                                {item.change}
                                            </span>
                                    </td>
                                    <td>{item.lowestMarket}</td>
                                    <td>{item.updated}</td>
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