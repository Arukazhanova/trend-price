import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import styles from './AdminProductsPage.module.css';

const products = [
    {
        product: 'products',
        brand: 'Name',
        category: 'Dairy',
        barcode: '0123456789012',
        stores: 6,
        priceRange: '2500₸–4500₸',
        availability: 'In stock',
    },
    {
        product: 'products',
        brand: 'Name',
        category: 'Dairy',
        barcode: '0123456789013',
        stores: 5,
        priceRange: '2500₸–4500₸',
        availability: 'In stock',
    },
    {
        product: 'products',
        brand: 'Name',
        category: 'Produce',
        barcode: '0123456789014',
        stores: 7,
        priceRange: '2500₸–4500₸',
        availability: 'Low stock',
    },
    {
        product: 'products',
        brand: 'Name',
        category: 'Bakery',
        barcode: '0123456789015',
        stores: 4,
        priceRange: '2500₸–4500₸',
        availability: 'In stock',
    },
    {
        product: 'products',
        brand: 'Name',
        category: 'Beverages',
        barcode: '0123456789016',
        stores: 8,
        priceRange: '2500₸–4500₸',
        availability: 'In stock',
    },
    {
        product: 'products',
        brand: 'Name',
        category: 'Dairy',
        barcode: '0123456789017',
        stores: 6,
        priceRange: '2500₸–4500₸',
        availability: 'In stock',
    },
    {
        product: 'products',
        brand: 'Name',
        category: 'Meat',
        barcode: '0123456789018',
        stores: 5,
        priceRange: '2500₸–4500₸',
        availability: 'In stock',
    },
    {
        product: 'products',
        brand: 'Name',
        category: 'Pantry',
        barcode: '0123456789019',
        stores: 5,
        priceRange: '2500₸–4500₸',
        availability: 'Out of stock',
    },
];

export default function AdminProductsPage() {
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
                                <th>Brand</th>
                                <th>Category</th>
                                <th>Barcode</th>
                                <th>Stores</th>
                                <th>Price Range</th>
                                <th>Availability</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {products.map((product, index) => (
                                <tr key={`${product.barcode}-${index}`}>
                                    <td>{product.product}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.category}</td>
                                    <td>{product.barcode}</td>
                                    <td>
                                            <span className={styles.storeBadge}>
                                                🏬 {product.stores}
                                            </span>
                                    </td>
                                    <td>{product.priceRange}</td>
                                    <td>
                                            <span
                                                className={`${styles.status} ${
                                                    product.availability === 'In stock'
                                                        ? styles.inStock
                                                        : product.availability === 'Low stock'
                                                            ? styles.lowStock
                                                            : styles.outStock
                                                }`}
                                            >
                                                {product.availability}
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