import { Link, useNavigate } from 'react-router-dom';

import MainHeader from '../../ components/MainHeader/MainHeader';
import Footer from '../../ components/Footer/Footer';

import { useFavourites } from '../../favourites/useFavourites';
import { useCart } from '../../cart/useCart';

import styles from './FavouritesPage.module.css';

import heartIcon from '../../assets/heart.svg';
import purchaseIcon from '../../assets/ShoppingCartSimpleWhite.svg';
import trashIcon from '../../assets/Trash.svg';

const getNumericPrice = (price: string) => {
    const value = Number(price.replace(/[^\d]/g, ''));

    return Number.isFinite(value) ? value : 0;
};

const getCurrency = (price: string) => {
    const currency = price.replace(/[\d\s.,]/g, '');

    return currency || '₸';
};

export default function FavouritesPage() {
    const navigate = useNavigate();

    const {
        favourites,
        removeFromFavourites,
        toggleFavourite,
        totalPrice,
    } = useFavourites();

    const { addToCart } = useCart();

    const getCartProduct = (product: (typeof favourites)[number]) => {
        return {
            id: product.id,
            title: product.title,
            subtitle: product.subtitle,
            price: getNumericPrice(product.price),
            currency: getCurrency(product.price),
            oldPrice: product.oldPrice
                ? getNumericPrice(product.oldPrice)
                : undefined,
            image: product.image,
        };
    };

    const handleAddToPurchase = (product: (typeof favourites)[number]) => {
        addToCart(getCartProduct(product));
    };

    const handleAddAllToPurchase = () => {
        favourites.forEach((product) => {
            addToCart(getCartProduct(product));
        });

        navigate('/purchase');
    };

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
                                <img
                                    src={heartIcon}
                                    alt=""
                                    className={styles.emptyIcon}
                                />
                            </div>

                            <h2 className={styles.emptyTitle}>
                                No favourites yet
                            </h2>

                            <p className={styles.emptyText}>
                                Start adding products to your favourites by
                                clicking the heart icon on any product card
                            </p>

                            <Link to="/" className={styles.viewProductsButton}>
                                ← View Products
                            </Link>
                        </section>
                    ) : (
                        <>
                            <section className={styles.productsGrid}>
                                {favourites.map((product) => (
                                    <article
                                        key={product.id}
                                        className={styles.card}
                                    >
                                        <button
                                            type="button"
                                            className={`${styles.favoriteButton} ${styles.favoriteButtonActive}`}
                                            onClick={() =>
                                                toggleFavourite(product)
                                            }
                                            aria-label="Toggle favourite"
                                        >
                                            <img
                                                src={heartIcon}
                                                alt=""
                                                className={
                                                    styles.favoriteIcon
                                                }
                                                aria-hidden="true"
                                            />
                                        </button>

                                        <div className={styles.cardImageWrap}>
                                            {product.image ? (
                                                <>
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className={
                                                            styles.cardImage
                                                        }
                                                        onError={(event) => {
                                                            event.currentTarget.style.display =
                                                                'none';

                                                            const fallback =
                                                                event
                                                                    .currentTarget
                                                                    .nextElementSibling as HTMLDivElement | null;

                                                            if (fallback) {
                                                                fallback.style.display =
                                                                    'flex';
                                                            }
                                                        }}
                                                    />

                                                    <div
                                                        className={
                                                            styles.productPlaceholder
                                                        }
                                                    >
                                                        {product.title}
                                                    </div>
                                                </>
                                            ) : (
                                                <div
                                                    className={`${styles.productPlaceholder} ${styles.productPlaceholderVisible}`}
                                                >
                                                    {product.title}
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.cardBody}>
                                            <h3 className={styles.cardTitle}>
                                                {product.title}
                                            </h3>

                                            <p
                                                className={
                                                    styles.cardSubtitle
                                                }
                                            >
                                                {product.subtitle}
                                            </p>

                                            <div className={styles.priceRow}>
                                                <span
                                                    className={styles.price}
                                                >
                                                    {product.price}
                                                </span>

                                                {product.oldPrice && (
                                                    <span
                                                        className={
                                                            styles.oldPrice
                                                        }
                                                    >
                                                        {product.oldPrice}
                                                    </span>
                                                )}

                                                {product.discount && (
                                                    <span
                                                        className={
                                                            product.discount.startsWith(
                                                                '+'
                                                            )
                                                                ? styles.badgeUp
                                                                : styles.badgeDown
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                product.discount.startsWith(
                                                                    '+'
                                                                )
                                                                    ? styles.badgeArrowUp
                                                                    : styles.badgeArrowDown
                                                            }
                                                        />

                                                        {product.discount}
                                                    </span>
                                                )}
                                            </div>

                                            <div className={styles.cardFooter}>
                                                <button
                                                    type="button"
                                                    className={
                                                        styles.cartButton
                                                    }
                                                    onClick={() =>
                                                        handleAddToPurchase(
                                                            product
                                                        )
                                                    }
                                                >
                                                    Add to purchase
                                                </button>

                                                <button
                                                    type="button"
                                                    className={
                                                        styles.deleteButton
                                                    }
                                                    aria-label="Remove from favourites"
                                                    onClick={() =>
                                                        removeFromFavourites(
                                                            product.id
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={trashIcon}
                                                        alt=""
                                                        className={
                                                            styles.deleteIcon
                                                        }
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
                                    <p className={styles.summaryPrice}>
                                        {totalPrice}₸
                                    </p>
                                </div>

                                <div className={styles.summaryActions}>
                                    <button
                                        type="button"
                                        className={styles.primaryButton}
                                        onClick={handleAddAllToPurchase}
                                    >
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