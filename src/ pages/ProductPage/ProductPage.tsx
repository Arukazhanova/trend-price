import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MainHeader from '../../ components/MainHeader/MainHeader';
import Footer from '../../ components/Footer/Footer';
import starIcon from '../../assets/Star.svg';
import arrowLeftIcon from '../../assets/ArrowLeft.svg';
import styles from './ProductPage.module.css';
import { catalogService } from '../../services/catalogService';
import type { Price, ProductPriceViewWithCategory } from '../../types/api';

const getPriceValue = (price?: Price | null) => {
    if (!price) {
        return 0;
    }

    return Number(price.finalPrice ?? price.pricePerUnit ?? 0);
};

const formatPrice = (value: number, currency = '₸') => {
    if (!value) {
        return 'No price yet';
    }

    return `${Math.round(value)}${currency}`;
};

const getOldPriceValue = (price?: Price | null) => {
    if (!price) {
        return 0;
    }

    const finalPrice = Number(price.finalPrice ?? 0);
    const pricePerUnit = Number(price.pricePerUnit ?? 0);

    if (pricePerUnit > finalPrice && finalPrice > 0) {
        return pricePerUnit;
    }

    return 0;
};

const getDiscountText = (price?: Price | null) => {
    if (!price) {
        return '';
    }

    const discount = Number(price.discount ?? 0);

    if (discount > 0 && discount < 1) {
        return `-${Math.round(discount * 100)}%`;
    }

    if (discount >= 1) {
        return `-${Math.round(discount)}%`;
    }

    const oldPrice = getOldPriceValue(price);
    const finalPrice = getPriceValue(price);

    if (oldPrice > finalPrice && finalPrice > 0) {
        const percent = Math.round(((oldPrice - finalPrice) / oldPrice) * 100);
        return `-${percent}%`;
    }

    return '';
};

const formatDate = (value?: string) => {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString('ru-RU');
};

export default function ProductPage() {
    const { id } = useParams();

    const [productData, setProductData] =
        useState<ProductPriceViewWithCategory | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError('Product id is missing');
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                const data = await catalogService.getProductPrice(id, 1);
                setProductData(data);
            } catch (error) {
                console.log('PRODUCT DETAILS LOAD ERROR:', error);
                setError('Failed to load product from backend');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const product = productData?.product;
    const bestPrice = productData?.bestPrice;

    const categoryText = useMemo(() => {
        if (productData?.categories?.length) {
            return productData.categories
                .map((category) => category.title)
                .join(', ');
        }

        if (product?.categories?.length) {
            return product.categories
                .map((category) => category.title)
                .join(', ');
        }

        return 'No category';
    }, [productData, product]);

    const brandTitle =
        typeof product?.brand === 'string' ? product.brand : product?.brand?.title;

    const currentPrice = getPriceValue(bestPrice);
    const oldPrice = getOldPriceValue(bestPrice);
    const discountText = getDiscountText(bestPrice);
    const currency = bestPrice?.currency || '₸';

    if (isLoading) {
        return (
            <>
                <MainHeader />
                <main className={styles.page}>
                    <div className={styles.container}>
                        <p className={styles.stateText}>Loading product...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <MainHeader />
                <main className={styles.page}>
                    <div className={styles.container}>
                        <p className={styles.stateText}>
                            {error || 'Product not found'}
                        </p>

                        <Link to="/catalog" className={styles.backLink}>
                            <img src={arrowLeftIcon} alt="" />
                            <span>Back to catalog</span>
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <Link to="/catalog" className={styles.backLink}>
                        <img src={arrowLeftIcon} alt="" />
                        <span>Catalog</span>
                    </Link>

                    <p className={styles.breadcrumbs}>
                        {categoryText} &gt; {product.title}
                    </p>

                    <section className={styles.productCard}>
                        <div className={styles.leftColumn}>
                            <div className={styles.imageBox}>
                                <span>{product.title}</span>
                            </div>

                            <div className={styles.description}>
                                <h2>Description</h2>
                                <p>
                                    {product.title}
                                    {brandTitle ? ` by ${brandTitle}` : ''}. This
                                    product is available in the TrendPrice catalog.
                                    You can compare prices, check best offer and open
                                    price analytics.
                                </p>
                            </div>
                        </div>

                        <div className={styles.rightColumn}>
                            <div className={styles.priceCard}>
                                <h1>{product.title}</h1>

                                <div className={styles.ratingSmall}>
                                    <img src={starIcon} alt="" />
                                    <span>4.9 ratings</span>
                                </div>

                                {brandTitle && (
                                    <p className={styles.metaText}>Brand: {brandTitle}</p>
                                )}

                                <p className={styles.metaText}>Category: {categoryText}</p>

                                {oldPrice > 0 && (
                                    <div className={styles.oldPrice}>
                                        {formatPrice(oldPrice, currency)}
                                    </div>
                                )}

                                <div className={styles.priceLine}>
                                    <span className={styles.price}>
                                        {formatPrice(currentPrice, currency)}
                                    </span>

                                    {discountText && (
                                        <span className={styles.discount}>
                                            {discountText}
                                        </span>
                                    )}
                                </div>

                                <Link
                                    to={`/products/${product.id}/analytics`}
                                    className={styles.analyticsButton}
                                >
                                    Price analytics
                                </Link>
                            </div>

                            <div className={styles.infoBlock}>
                                <h2>Best offer</h2>

                                {bestPrice ? (
                                    <>
                                        <p>City: {bestPrice.city || '—'}</p>
                                        <p>Store ID: {bestPrice.storeId || '—'}</p>
                                        <p>
                                            Unit:{' '}
                                            {bestPrice.unitAmount
                                                ? `${bestPrice.unitAmount} `
                                                : ''}
                                            {bestPrice.unit || '—'}
                                        </p>
                                        <p>Updated: {formatDate(bestPrice.time)}</p>
                                    </>
                                ) : (
                                    <p>No price information yet.</p>
                                )}
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.infoBlock}>
                                <h2>Product information</h2>
                                <p>Barcode: {product.barcode || '—'}</p>
                                <p>Type: {product.type || '—'}</p>
                                <p>Created: {formatDate(product.createdAt)}</p>
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.infoBlock}>
                                <h2>Recent prices</h2>

                                {productData?.prices?.length ? (
                                    productData.prices.slice(0, 5).map((price) => (
                                        <p key={price.id}>
                                            {formatPrice(getPriceValue(price), price.currency)} ·{' '}
                                            {price.city || '—'} · {formatDate(price.time)}
                                        </p>
                                    ))
                                ) : (
                                    <p>No recent prices yet.</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}