import { Link } from 'react-router-dom';
import MainHeader from '../../ components/MainHeader/MainHeader';
import styles from './CatalogPage.module.css';
import heartIcon from '../../assets/Heart.svg';

const products = [
    {
        id: 1,
        name: 'Apples',
        description: '1 kg Magnum',
        price: '490₸',
        oldPrice: '1040₸',
        discount: '−15%',
        imageUrl: '',
    },
    {
        id: 2,
        name: 'Grape',
        description: '0.5 kg Small',
        price: '1330₸',
        oldPrice: '2660₸',
        discount: '−50%',
        imageUrl: '',
    },
    {
        id: 3,
        name: 'Premium bananas',
        description: '1 kg Magnum',
        price: '1545₸',
        oldPrice: '',
        discount: '',
        imageUrl: '',
    },
    {
        id: 4,
        name: 'Blueberry',
        description: '125 g Arbuz',
        price: '2380₸',
        oldPrice: '',
        discount: '',
        imageUrl: '',
    },
    {
        id: 5,
        name: 'Bananas',
        description: '1 kg Magnum',
        price: '380₸',
        oldPrice: '',
        discount: '+7.9%',
        imageUrl: '',
        isUp: true,
    },
    {
        id: 6,
        name: 'Broccoli fresh',
        description: '500 g Magnum',
        price: '350₸',
        oldPrice: '380₸',
        discount: '−8%',
        imageUrl: '',
    },
    {
        id: 7,
        name: 'Cherry tomatoes',
        description: '250 g Magnum',
        price: '290₸',
        oldPrice: '310₸',
        discount: '−10%',
        imageUrl: '',
    },
    {
        id: 8,
        name: 'Oranges',
        description: '0.8 kg Magnum',
        price: '1240₸',
        oldPrice: '1550₸',
        discount: '−20%',
        imageUrl: '',
    },
];

export default function CatalogPage() {
    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.categories}>

                    </div>

                    <Link to="/" className={styles.backLink}>
                        ← Home
                    </Link>

                    <div className={styles.toolbar}>
                        <div className={styles.search}>
                            <span>⌕</span>
                            <input placeholder="Search in category..." />
                        </div>

                        <button type="button" className={styles.filterButton}>
                            ⇄ Filter
                        </button>
                    </div>

                    <h1 className={styles.categoryTitle}>Vegetables, fruits, greens</h1>

                    <div className={styles.productsGrid}>
                        {products.map((product) => (
                            <article key={product.id} className={styles.productCard}>
                                <button type="button" className={styles.favoriteButton}>
                                    <img src={heartIcon} alt="" />
                                </button>

                                <div className={styles.imageBlock}>
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} />
                                    ) : (
                                        <div className={styles.imagePlaceholder} />
                                    )}
                                </div>

                                <div className={styles.productInfo}>
                                    <h2>{product.name}</h2>
                                    <p>{product.description}</p>

                                    <div className={styles.priceRow}>
                                        <strong>{product.price}</strong>

                                        {product.oldPrice && (
                                            <span>{product.oldPrice}</span>
                                        )}

                                        {product.discount && (
                                            <b
                                                className={
                                                    product.isUp
                                                        ? styles.discountUp
                                                        : styles.discountDown
                                                }
                                            >
                                                {product.isUp ? '▲' : '▼'} {product.discount}
                                            </b>
                                        )}
                                    </div>

                                    <div className={styles.actions}>
                                        <button type="button" className={styles.cartButton}>
                                            Add to cart
                                        </button>

                                        <Link
                                            to={`/products/${product.id}/analytics`}
                                            className={styles.analyticsButton}
                                        >
                                            Price analytics
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}