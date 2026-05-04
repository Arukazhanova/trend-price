import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import styles from './AdminCategoriesPage.module.css';

const stats = [
    { title: 'Total categories', value: '10' },
    { title: 'Total Products', value: '9460' },
    { title: 'Avg Products/Category', value: '946' },
];

const categories = [
    { name: 'Vegetables', products: '1250 products', color: 'pink' },
    { name: 'Milk products', products: '890 products', color: 'blue' },
    { name: 'Sausage and delicacies', products: '1100 products', color: 'orange' },
    { name: 'Bread', products: '560 products', color: 'yellow' },
    { name: 'Meat', products: '780 products', color: 'green' },
    { name: 'Seafood', products: '420 products', color: 'mint' },
    { name: 'Water and juice', products: '670 products', color: 'purple' },
];

export default function AdminCategoriesPage() {
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

                        <button type="button" className={styles.addButton}>
                            + Add categories
                        </button>
                    </div>

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

                    <div className={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <div
                                key={category.name}
                                className={`${styles.categoryCard} ${styles[category.color]}`}
                            >
                                <button type="button" className={styles.moreButton}>
                                    ...
                                </button>

                                <h3>{category.name}</h3>
                                <p>{category.products}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}