import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MainHeader from '../../ components/MainHeader/MainHeader';
import Footer from '../../ components/Footer/Footer';

import styles from './PriceAnalyticsPage.module.css';
import searchIcon from '../../assets/Search.svg';

import { catalogService } from '../../services/catalogService';

import type {
    CatalogProduct,
    Price,
    ProductPriceViewWithCategory,
} from '../../types/api';

const CATALOG_PAGE_SIZE = 20;

const periods = [
    { label: '7D', days: 7 },
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: '6M', days: 180 },
    { label: '1Y', days: 365 },
];

const getPriceValue = (price?: Price | null) => {
    if (!price) {
        return 0;
    }

    return Number(price.finalPrice ?? price.pricePerUnit ?? 0);
};

const formatPrice = (value: number, currency = '₸') => {
    if (!value) {
        return 'No price';
    }

    return `${Math.round(value)}${currency}`;
};

const formatDate = (value?: string) => {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
};

const getDiscountPercent = (price?: Price | null) => {
    if (!price) {
        return 0;
    }

    const discount = Number(price.discount ?? 0);

    if (discount > 0 && discount < 1) {
        return Math.round(discount * 100);
    }

    if (discount >= 1) {
        return Math.round(discount);
    }

    if (discount < 0 && discount > -1) {
        return -Math.round(Math.abs(discount) * 100);
    }

    if (discount <= -1) {
        return -Math.round(Math.abs(discount));
    }

    return 0;
};

const getChangePercentFromPrices = (prices: Price[]) => {
    if (prices.length < 2) {
        return 0;
    }

    const sorted = [...prices].sort((a, b) => {
        const dateA = new Date(a.time ?? a.createdAt ?? 0).getTime();
        const dateB = new Date(b.time ?? b.createdAt ?? 0).getTime();

        return dateA - dateB;
    });

    const first = getPriceValue(sorted[0]);
    const last = getPriceValue(sorted[sorted.length - 1]);

    if (!first || !last) {
        return 0;
    }

    return Math.round(((last - first) / first) * 100);
};

export default function PriceAnalyticsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [selectedProductId, setSelectedProductId] = useState(id ?? '');
    const [productData, setProductData] =
        useState<ProductPriceViewWithCategory | null>(null);

    const [search, setSearch] = useState('');
    const [activePeriod, setActivePeriod] = useState(periods[3]);

    const [isProductsLoading, setIsProductsLoading] = useState(false);
    const [isPricesLoading, setIsPricesLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCatalogProducts = async () => {
            setIsProductsLoading(true);
            setError('');

            try {
                const pageData = await catalogService.searchProducts({
                    page: 1,
                    size: CATALOG_PAGE_SIZE,
                });

                const loadedProducts = pageData.content ?? [];
                setProducts(loadedProducts);

                if (!selectedProductId && loadedProducts[0]) {
                    setSelectedProductId(loadedProducts[0].id);
                    navigate(`/products/${loadedProducts[0].id}/analytics`, {
                        replace: true,
                    });
                }
            } catch (error) {
                console.log('ANALYTICS PRODUCTS LOAD ERROR:', error);
                setError('Failed to load products for analytics');
            } finally {
                setIsProductsLoading(false);
            }
        };

        fetchCatalogProducts();
    }, []);

    useEffect(() => {
        if (id) {
            setSelectedProductId(id);
        }
    }, [id]);

    useEffect(() => {
        const fetchPriceAnalytics = async () => {
            if (!selectedProductId) {
                return;
            }

            setIsPricesLoading(true);
            setError('');

            try {
                const response = await catalogService.getProductPrice(
                    selectedProductId,
                    activePeriod.days
                );

                console.log('CATALOG ANALYTICS RESPONSE:', response);
                setProductData(response);
            } catch (error) {
                console.log('CATALOG PRICE ANALYTICS LOAD ERROR:', error);
                setError('Failed to load price analytics');
                setProductData(null);
            } finally {
                setIsPricesLoading(false);
            }
        };

        fetchPriceAnalytics();
    }, [selectedProductId, activePeriod]);

    const selectedProductFromList = useMemo(() => {
        return (
            products.find((product) => product.id === selectedProductId) ??
            products[0]
        );
    }, [products, selectedProductId]);

    const selectedProduct = productData?.product ?? selectedProductFromList;

    const prices = useMemo(() => {
        const rawPrices = productData?.prices ?? [];

        const sorted = [...rawPrices]
            .filter((price) => getPriceValue(price) > 0)
            .sort((a, b) => {
                const dateA = new Date(a.time ?? a.createdAt ?? 0).getTime();
                const dateB = new Date(b.time ?? b.createdAt ?? 0).getTime();

                return dateA - dateB;
            });

        if (sorted.length > 0) {
            return sorted;
        }

        const fallbackPrice =
            productData?.bestPrice ?? selectedProductFromList?.bestPrice;

        return fallbackPrice ? [fallbackPrice] : [];
    }, [productData, selectedProductFromList]);

    const currency =
        productData?.bestPrice?.currency ||
        selectedProductFromList?.bestPrice?.currency ||
        prices[0]?.currency ||
        '₸';

    const priceValues = prices.map(getPriceValue);

    const currentPrice =
        priceValues[priceValues.length - 1] ||
        getPriceValue(productData?.bestPrice) ||
        getPriceValue(selectedProductFromList?.bestPrice);

    const lowestPrice = priceValues.length
        ? Math.min(...priceValues)
        : currentPrice;

    const highestPrice = priceValues.length
        ? Math.max(...priceValues)
        : currentPrice;

    const averagePrice = priceValues.length
        ? Math.round(
            priceValues.reduce((sum, value) => sum + value, 0) /
            priceValues.length
        )
        : currentPrice;

    const changePercent =
        prices.length > 1
            ? getChangePercentFromPrices(prices)
            : -getDiscountPercent(
                productData?.bestPrice ?? selectedProductFromList?.bestPrice
            );

    const filteredProducts = useMemo(() => {
        if (!search.trim()) {
            return products;
        }

        const normalizedSearch = search.trim().toLowerCase();

        return products.filter((product) =>
            product.title.toLowerCase().includes(normalizedSearch)
        );
    }, [products, search]);

    const topDrops = useMemo(() => {
        return [...products]
            .filter((product) => getDiscountPercent(product.bestPrice) > 0)
            .sort(
                (a, b) =>
                    getDiscountPercent(b.bestPrice) -
                    getDiscountPercent(a.bestPrice)
            )
            .slice(0, 3);
    }, [products]);

    const topIncreases = useMemo(() => {
        return [...products]
            .filter((product) => getDiscountPercent(product.bestPrice) < 0)
            .sort(
                (a, b) =>
                    getDiscountPercent(a.bestPrice) -
                    getDiscountPercent(b.bestPrice)
            )
            .slice(0, 3);
    }, [products]);

    const chart = useMemo(() => {
        if (prices.length === 0) {
            return {
                points: '',
                circles: [] as Array<{
                    x: number;
                    y: number;
                    value: number;
                    label: string;
                }>,
                min: 0,
                max: 0,
                averageY: 0,
            };
        }

        const values = prices.map(getPriceValue);

        let min = Math.min(...values);
        let max = Math.max(...values);

        if (min === max) {
            min = Math.max(0, min - 100);
            max = max + 100;
        }

        const range = max - min || 1;

        const left = 55;
        const right = 660;
        const top = 35;
        const bottom = 245;
        const height = bottom - top;

        const circles = prices.map((price, index) => {
            const value = getPriceValue(price);

            const x =
                prices.length === 1
                    ? (left + right) / 2
                    : left + ((right - left) / (prices.length - 1)) * index;

            const y = bottom - ((value - min) / range) * height;

            return {
                x,
                y,
                value,
                label: formatDate(price.time ?? price.createdAt),
            };
        });

        const average =
            values.reduce((sum, value) => sum + value, 0) / values.length;
        const averageY = bottom - ((average - min) / range) * height;

        return {
            points: circles.map((point) => `${point.x},${point.y}`).join(' '),
            circles,
            min,
            max,
            averageY,
        };
    }, [prices]);

    const handleSelectProduct = (productId: string) => {
        setSelectedProductId(productId);
        navigate(`/products/${productId}/analytics`);
    };

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <h1 className={styles.pageTitle}>Price Analytics</h1>

                    {error && <p className={styles.stateText}>{error}</p>}

                    <div className={styles.layout}>
                        <aside className={styles.sidebar}>
                            <h2>Select Product</h2>

                            <div className={styles.searchWrap}>
                                <img src={searchIcon} alt="" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    className={styles.search}
                                />
                            </div>

                            <div className={styles.productList}>
                                {isProductsLoading && (
                                    <p className={styles.sideState}>
                                        Loading products...
                                    </p>
                                )}

                                {!isProductsLoading &&
                                    filteredProducts.map((product) => {
                                        const discountPercent =
                                            getDiscountPercent(product.bestPrice);
                                        const productPrice = getPriceValue(
                                            product.bestPrice
                                        );

                                        return (
                                            <button
                                                key={product.id}
                                                className={`${styles.productItem} ${
                                                    selectedProduct?.id ===
                                                    product.id
                                                        ? styles.productItemActive
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    handleSelectProduct(product.id)
                                                }
                                                type="button"
                                            >
                                                <div>
                                                    <b>{product.title}</b>
                                                    <span>
                                                        {formatPrice(
                                                            productPrice,
                                                            product.bestPrice
                                                                ?.currency
                                                        )}
                                                    </span>
                                                </div>

                                                {discountPercent !== 0 && (
                                                    <span
                                                        className={
                                                            discountPercent < 0
                                                                ? styles.badgeUp
                                                                : styles.badgeDown
                                                        }
                                                    >
                                                        {discountPercent < 0
                                                            ? '▲ +'
                                                            : '▼ -'}
                                                        {Math.abs(
                                                            discountPercent
                                                        )}
                                                        %
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                            </div>
                        </aside>

                        <section className={styles.mainContent}>
                            <div className={styles.chartCard}>
                                <div className={styles.chartHeader}>
                                    <div>
                                        <h2>
                                            {selectedProduct?.title ??
                                                'Choose product'}
                                        </h2>
                                        <p>
                                            Current price:{' '}
                                            <strong>
                                                {formatPrice(
                                                    currentPrice,
                                                    currency
                                                )}
                                            </strong>
                                        </p>

                                        {changePercent !== 0 && (
                                            <p
                                                className={
                                                    changePercent < 0
                                                        ? styles.greenText
                                                        : styles.redText
                                                }
                                            >
                                                {changePercent > 0 ? '+' : ''}
                                                {changePercent}% for selected
                                                period
                                            </p>
                                        )}
                                    </div>

                                    <div className={styles.periods}>
                                        {periods.map((period) => (
                                            <button
                                                key={period.label}
                                                type="button"
                                                onClick={() =>
                                                    setActivePeriod(period)
                                                }
                                                className={
                                                    activePeriod.label ===
                                                    period.label
                                                        ? styles.activePeriod
                                                        : ''
                                                }
                                            >
                                                {period.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.chart}>
                                    {isPricesLoading ? (
                                        <div className={styles.noChart}>
                                            Loading chart...
                                        </div>
                                    ) : prices.length > 0 ? (
                                        <svg viewBox="0 0 700 300">
                                            {[0, 1, 2, 3, 4].map((_, index) => {
                                                const y = 35 + index * 52;
                                                const value =
                                                    chart.max -
                                                    ((chart.max - chart.min) /
                                                        4) *
                                                    index;

                                                return (
                                                    <g key={index}>
                                                        <text
                                                            x="42"
                                                            y={y + 5}
                                                            className={
                                                                styles.yLabel
                                                            }
                                                        >
                                                            {Math.round(value)}
                                                        </text>

                                                        <line
                                                            x1="55"
                                                            y1={y}
                                                            x2="660"
                                                            y2={y}
                                                            className={
                                                                styles.gridLine
                                                            }
                                                        />
                                                    </g>
                                                );
                                            })}

                                            {[55, 175, 295, 415, 535, 660].map(
                                                (x) => (
                                                    <line
                                                        key={x}
                                                        x1={x}
                                                        y1="35"
                                                        x2={x}
                                                        y2="245"
                                                        className={
                                                            styles.gridLine
                                                        }
                                                    />
                                                )
                                            )}

                                            <line
                                                x1="55"
                                                y1="35"
                                                x2="55"
                                                y2="245"
                                                className={styles.axis}
                                            />
                                            <line
                                                x1="55"
                                                y1="245"
                                                x2="660"
                                                y2="245"
                                                className={styles.axis}
                                            />

                                            <line
                                                x1="55"
                                                y1={chart.averageY}
                                                x2="660"
                                                y2={chart.averageY}
                                                className={styles.averageLine}
                                            />

                                            {chart.circles.length === 1 ? (
                                                <line
                                                    x1="55"
                                                    y1={chart.circles[0].y}
                                                    x2="660"
                                                    y2={chart.circles[0].y}
                                                    className={styles.priceLine}
                                                />
                                            ) : (
                                                <polyline
                                                    points={chart.points}
                                                    className={styles.priceLine}
                                                />
                                            )}

                                            {chart.circles.map(
                                                (point, index) => (
                                                    <g key={index}>
                                                        <circle
                                                            cx={point.x}
                                                            cy={point.y}
                                                            r="5"
                                                            className={
                                                                styles.point
                                                            }
                                                        />
                                                        <text
                                                            x={point.x}
                                                            y="276"
                                                            className={
                                                                styles.month
                                                            }
                                                        >
                                                            {point.label}
                                                        </text>
                                                    </g>
                                                )
                                            )}
                                        </svg>
                                    ) : (
                                        <div className={styles.noChart}>
                                            No price history yet
                                        </div>
                                    )}

                                    <div className={styles.legend}>
                                        <span className={styles.greenLegend}>
                                            Actual Price
                                        </span>
                                        <span className={styles.redLegend}>
                                            Monthly Average
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.stats}>
                                <div>
                                    <span>Lowest Price</span>
                                    <b className={styles.greenText}>
                                        {formatPrice(lowestPrice, currency)}
                                    </b>
                                    <p>Last {activePeriod.label}</p>
                                </div>

                                <div>
                                    <span>Highest Price</span>
                                    <b className={styles.redText}>
                                        {formatPrice(highestPrice, currency)}
                                    </b>
                                    <p>Last {activePeriod.label}</p>
                                </div>

                                <div>
                                    <span>Average Price</span>
                                    <b>{formatPrice(averagePrice, currency)}</b>
                                    <p>Last {activePeriod.label}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className={styles.bottomBlocks}>
                        <section className={styles.dropBlock}>
                            <h2>⌁ Top Price Drop This Week</h2>

                            {topDrops.length > 0 ? (
                                topDrops.map((product) => {
                                    const discount =
                                        getDiscountPercent(product.bestPrice);

                                    return (
                                        <div
                                            className={styles.smallRow}
                                            key={product.id}
                                        >
                                            <b>{product.title}</b>
                                            <span>▼ -{discount}%</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className={styles.smallRow}>
                                    <b>No discounts yet</b>
                                    <span>0%</span>
                                </div>
                            )}
                        </section>

                        <section className={styles.increaseBlock}>
                            <h2>⌁ Top Price Increases This Week</h2>

                            {topIncreases.length > 0 ? (
                                topIncreases.map((product) => {
                                    const increase = Math.abs(
                                        getDiscountPercent(product.bestPrice)
                                    );

                                    return (
                                        <div
                                            className={styles.smallRow}
                                            key={product.id}
                                        >
                                            <b>{product.title}</b>
                                            <span>▲ +{increase}%</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className={styles.smallRow}>
                                    <b>No increases yet</b>
                                    <span>0%</span>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}