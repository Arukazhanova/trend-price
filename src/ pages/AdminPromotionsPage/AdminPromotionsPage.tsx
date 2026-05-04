import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import styles from './AdminPromotionsPage.module.css';

const promotions = [
    {
        promotion: 'Summer Sale',
        product: 'Name',
        store: 'Name',
        oldPrice: '2300₸',
        newPrice: '2670₸',
        discount: '-14%',
        period: '2026-01-10 - 2026-01-20',
        status: 'Active',
        featured: true,
    },
    {
        promotion: 'Weekend Deal',
        product: 'Name',
        store: 'Name',
        oldPrice: '2300₸',
        newPrice: '2670₸',
        discount: '-14%',
        period: '2026-01-11 - 2026-01-15',
        status: 'Active',
        featured: true,
    },
    {
        promotion: 'Coffee Week',
        product: 'Name',
        store: 'Name',
        oldPrice: '2300₸',
        newPrice: '2670₸',
        discount: '-14%',
        period: '2026-01-14 - 2026-01-18',
        status: 'Active',
        featured: true,
    },
    {
        promotion: 'Flash Sale',
        product: 'Name',
        store: 'Name',
        oldPrice: '2300₸',
        newPrice: '2670₸',
        discount: '-14%',
        period: '2026-01-18 - 2026-01-21',
        status: 'Active',
        featured: true,
    },
    {
        promotion: 'Holiday Special',
        product: 'Name',
        store: 'Name',
        oldPrice: '2300₸',
        newPrice: '2670₸',
        discount: '-14%',
        period: '2026-01-10 - 2026-01-20',
        status: 'Active',
        featured: true,
    },
    {
        promotion: 'Special Offers',
        product: 'Name',
        store: 'Name',
        oldPrice: '2300₸',
        newPrice: '2670₸',
        discount: '-14%',
        period: '2026-01-11 - 2026-01-15',
        status: 'Active',
        featured: true,
    },
    {
        promotion: 'The Best Offers',
        product: 'Name',
        store: 'Name',
        oldPrice: '2300₸',
        newPrice: '2670₸',
        discount: '-14%',
        period: '2026-01-14 - 2026-01-18',
        status: 'Expired',
        featured: false,
    },
    {
        promotion: 'Fresh Discounts',
        product: 'Name',
        store: 'Name',
        oldPrice: '2300₸',
        newPrice: '2670₸',
        discount: '-14%',
        period: '2026-01-18 - 2026-01-21',
        status: 'Scheduled',
        featured: false,
    },
];

export default function AdminPromotionsPage() {
    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.pageContent}>
                    <div className={styles.titleRow}>
                        <div>
                            <h1>Promotions & Deals</h1>
                            <p>Manage discounts and promotional campaigns</p>
                        </div>

                        <button type="button" className={styles.addButton}>
                            + Add Promotion
                        </button>
                    </div>

                    <div className={styles.tableCard}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Promotion</th>
                                <th>Product</th>
                                <th>Store</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Period</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {promotions.map((item, index) => (
                                <tr key={`${item.promotion}-${index}`}>
                                    <td>{item.promotion}</td>
                                    <td>{item.product}</td>
                                    <td>{item.store}</td>
                                    <td>
                                        <span className={styles.oldPrice}>{item.oldPrice}</span>{' '}
                                        {item.newPrice}
                                    </td>
                                    <td>
                                        <span className={styles.discount}>{item.discount}</span>
                                    </td>
                                    <td>{item.period}</td>
                                    <td>
                                            <span
                                                className={`${styles.status} ${
                                                    item.status === 'Active'
                                                        ? styles.activeStatus
                                                        : item.status === 'Expired'
                                                            ? styles.expiredStatus
                                                            : styles.scheduledStatus
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                    </td>
                                    <td>
                                            <span
                                                className={`${styles.toggle} ${
                                                    item.featured ? styles.toggleOn : ''
                                                }`}
                                            >
                                                <span />
                                            </span>
                                    </td>
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