import styles from './ MainCatalogSection.module.css';
import heartIcon from '../../assets/heart.svg';
import arrowDownIcon from '../../assets/CaretDown.svg';
const productSections = [
    {
        id: 1,
        title: 'Over and over again...',
        products: [
            {
                id: 1,
                title: 'Mileo Milk 3.2%',
                subtitle: '1kg Magnum',
                price: '880₸',
                oldPrice: '1040₸',
                discount: '-15%',
                image: '/src/assets/products/milk.png',
                isFavorite: true,
            },
            {
                id: 2,
                title: 'Top grade QarQus egg',
                subtitle: '10 pcs Arbuz',
                price: '980₸',
                image: '/src/assets/products/eggs.png',
                isFavorite: true,
            },
            {
                id: 3,
                title: 'Butter',
                subtitle: '500 g Arbuz',
                price: '3630₸',
                oldPrice: '4040₸',
                discount: '-5%',
                image: '/src/assets/products/butter.png',
                isFavorite: true,
            },
            {
                id: 4,
                title: 'Masterpiece sunflower oil',
                subtitle: '1 kg Magnum',
                price: '987₸',
                oldPrice: '1097₸',
                discount: '-8%',
                image: '/src/assets/products/oil.png',
                isFavorite: true,
            },
        ],
    },
    {
        id: 2,
        title: 'Vegetables and Fruits',
        products: [
            {
                id: 5,
                title: 'Apples',
                subtitle: '1 kg Magnum',
                price: '490₸',
                oldPrice: '1040₸',
                discount: '-15%',
                image: '/src/assets/products/apple.png',
                isFavorite: true,
            },
            {
                id: 6,
                title: 'Bananas',
                subtitle: '1 kg Magnum',
                price: '380₸',
                discount: '+7.9%',
                image: '/src/assets/products/banana.png',
                isFavorite: true,
            },
            {
                id: 7,
                title: 'Broccoli fresh',
                subtitle: '500 g Magnum',
                price: '350₸',
                oldPrice: '380₸',
                discount: '-9%',
                image: '/src/assets/products/broccoli.png',
                isFavorite: true,
            },
            {
                id: 8,
                title: 'Cherry tomatoes',
                subtitle: '250 g Magnum',
                price: '290₸',
                oldPrice: '310₸',
                discount: '-10%',
                image: '/src/assets/products/tomatoes.png',
                isFavorite: true,
            },
        ],
    },
];

const cheapestBlock = {
    title: 'Where is it cheaper?',
    selectedCategory: 'Milk',
    productTitle: 'Milk 3.2% 1L',
    rows: [
        { id: 1, market: 'Magnum', price: '380₸', stock: 'In stock', difference: '-65₸', status: 'positive', active: true },
        { id: 2, market: 'Small', price: '445₸', stock: 'In stock', difference: '0₸', status: 'neutral', active: false },
        { id: 3, market: 'Arbuz', price: '420₸', stock: 'In stock', difference: '-25₸', status: 'positive', active: false },
        { id: 4, market: 'Galmart', price: '460₸', stock: 'Out of stock', difference: '+15₸', status: 'negative', active: false },
    ],
};

export default function MainCatalogSection() {
    return (
        <section className={styles.wrapper}>
            {productSections.map((section) => (
                <div key={section.id} className={styles.sectionBlock}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{section.title}</h2>
                    </div>

                    <div className={styles.productsGrid}>
                        {section.products.map((product) => (
                            <article key={product.id} className={styles.card}>
                                <button type="button" className={styles.favoriteButton}>
                                    <img src={heartIcon} alt="Add to favourites" className={styles.favoriteIcon} />
                                </button>

                                <div className={styles.cardImageWrap}>
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className={styles.cardImage}
                                    />
                                </div>

                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{product.title}</h3>
                                    <p className={styles.cardSubtitle}>{product.subtitle}</p>

                                    <div className={styles.priceRow}>
                                        <span className={styles.price}>{product.price}</span>

                                        {product.oldPrice && (
                                            <span className={styles.oldPrice}>{product.oldPrice}</span>
                                        )}

                                        {product.discount && (
                                            <span
                                                className={
                                                    product.discount.startsWith('+')
                                                        ? styles.badgeUp
                                                        : styles.badgeDown
                                                }
                                            >
                                                {product.discount}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.cardActions}>
                                        <button type="button" className={styles.cartButton}>
                                            Add to cart
                                        </button>

                                        <button type="button" className={styles.analyticsButton}>
                                            Price analytics
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            ))}
            <div className={styles.cheapestSection}>
                <div className={styles.cheapestHeader}>
                    <h2 className={styles.cheapestTitle}>{cheapestBlock.title}</h2>

                    <div className={styles.selectWrap}>
                        <select className={styles.select} defaultValue="Milk">
                            <option value="Milk">Milk</option>
                        </select>

                        <img
                            src={arrowDownIcon}
                            alt=""
                            aria-hidden="true"
                            className={styles.selectIcon}
                        />
                    </div>
                </div>

                <div className={styles.cheapestCard}>
                    <h3 className={styles.cheapestProductTitle}>{cheapestBlock.productTitle}</h3>

                    <div className={styles.marketList}>
                        {cheapestBlock.rows.map((row) => (
                            <div
                                key={row.id}
                                className={`${styles.marketRow} ${row.active ? styles.marketRowActive : ''}`}
                            >
                                <span className={styles.marketName}>{row.market}</span>
                                <span className={styles.marketPrice}>{row.price}</span>

                                <span className={row.stock === 'In stock' ? styles.stockOk : styles.stockBad}>
                        <span className={styles.stockIcon}>
                            {row.stock === 'In stock' ? '✓' : '✕'}
                        </span>
                                    {row.stock}
                    </span>

                                <span
                                    className={
                                        row.status === 'positive'
                                            ? styles.diffPositive
                                            : row.status === 'negative'
                                                ? styles.diffNegative
                                                : styles.diffNeutral
                                    }
                                >
                        {row.difference}
                    </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}