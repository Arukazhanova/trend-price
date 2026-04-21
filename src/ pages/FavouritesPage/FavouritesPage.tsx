import { Link } from 'react-router-dom';
import MainHeader from '../../ components/MainHeader/MainHeader';
import Footer from '../../ components/Footer/Footer';
import { useFavourites } from '../../favourites/useFavourites';
import styles from './FavouritesPage.module.css';
import heartIcon from '../../assets/Heart.svg';
import compareIcon from '../../assets/ChartLine.svg';
import purchaseIcon from '../../assets/ShoppingCartSimpleWhite.svg';
import trashIcon from '../../assets/Trash.svg';
export default function FavouritesPage() {
    const { favourites, removeFromFavourites, toggleFavourite,  totalPrice } = useFavourites();

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <Link to="/" className={styles.backLink}>
                        ← Home
                    </Link>

                    <div className={styles.heading}>
                        <h1 className={styles.title}>My Favourites</h1>
                        <p className={styles.subtitle}>
                            {favourites.length} products saved
                        </p>
                    </div>

                    {favourites.length === 0 ? (
                        <section className={styles.emptyState}>
                            <div className={styles.emptyIconWrap}>
                                <img src={heartIcon} alt="" className={styles.emptyIcon} />
                            </div>

                            <h2 className={styles.emptyTitle}>No favourites yet</h2>

                            <p className={styles.emptyText}>
                                Start adding products to your favourites by clicking
                                the heart icon on any product card
                            </p>

                            <Link to="/" className={styles.viewProductsButton}>
                                ← View Products
                            </Link>
                        </section>
                    ) : (
                        <>
                            <section className={styles.productsGrid}>
                                {favourites.map((product) => (
                                    <article key={product.id} className={styles.card}>
                                        <button
                                            type="button"
                                            className={`${styles.favoriteButton} ${styles.favoriteButtonActive}`}
                                            onClick={() => toggleFavourite(product)}
                                            aria-label="Toggle favourite"
                                        >
                                            <img
                                                src={heartIcon}
                                                alt=""
                                                className={styles.favoriteIcon}
                                                aria-hidden="true"
                                            />
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
                                                    <span className={styles.oldPrice}>
                                                        {product.oldPrice}
                                                    </span>
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

                                            <div className={styles.cardFooter}>
                                                <button type="button" className={styles.cartButton}>
                                                    Add to cart
                                                </button>

                                                <button
                                                    type="button"
                                                    className={styles.deleteButton}
                                                    aria-label="Remove from favourites"
                                                    onClick={() => removeFromFavourites(product.id)}
                                                >
                                                    <img
                                                        src={trashIcon}
                                                        alt=""
                                                        className={styles.deleteIcon}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </section>

                            <section className={styles.summaryBox}>
                                <div>
                                    <p className={styles.summaryLabel}>
                                        {favourites.length} products saved
                                    </p>
                                    <p className={styles.summaryPrice}>{totalPrice}₸</p>
                                </div>

                                <div className={styles.summaryActions}>
                                    <button className={styles.secondaryButton}>
                                        <img src={compareIcon} alt="" />
                                        Compare prices
                                    </button>

                                    <button className={styles.primaryButton}>
                                        <img src={purchaseIcon} alt="" />
                                        Add all to purchase
                                    </button>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}