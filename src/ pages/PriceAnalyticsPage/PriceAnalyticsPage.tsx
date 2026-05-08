import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MainHeader from '../../ components/MainHeader/MainHeader';
import Footer from '../../ components/Footer/Footer';

import styles from './PriceAnalyticsPage.module.css';
import searchIcon from '../../assets/Search.svg';

import { catalogService } from '../../services/catalogService';
import { storeService } from '../../services/storeService';

import type {
    CatalogProduct,
    Price,
    ProductPriceViewWithCategory,
    Store,
} from '../../types/api';

const CATALOG_PAGE_SIZE = 20;

const periods = [
    { label: '7D', days: 7 },
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: '6M', days: 180 },
    { label: '1Y', days: 365 },
];

const lineClasses = [
    'priceLineGreen',
    'priceLineBlue',
    'priceLineOrange',
    'priceLinePurple',
    'priceLinePink',
];

const pointClasses = [
    'pointGreen',
    'pointBlue',
    'pointOrange',
    'pointPurple',
    'pointPink',
];

const legendClasses = [
    'legendGreen',
    'legendBlue',
    'legendOrange',
    'legendPurple',
    'legendPink',
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

const getStoreTitle = (storeId: string, stores: Store[]) => {
    return stores.find((store) => store.id === storeId)?.title ?? 'Unknown store';
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
const getDateKey = (value?: string) => {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};
export default function PriceAnalyticsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [selectedProductId, setSelectedProductId] = useState(id ?? '');
    const [productData, setProductData] =
        useState<ProductPriceViewWithCategory | null>(null);

    const [storeSearch, setStoreSearch] = useState('');
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);

    const [activePeriod, setActivePeriod] = useState(periods[3]);
    const [isPricesLoading, setIsPricesLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCatalogProducts = async () => {
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

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const normalizedSearch = storeSearch.trim();

                const loadedStores = normalizedSearch
                    ? await storeService.searchStores(normalizedSearch)
                    : await storeService.getAllStores();

                setStores(loadedStores);
            } catch (error) {
                console.log('STORES LOAD ERROR:', error);
                setStores([]);
            }
        };

        const timeoutId = window.setTimeout(fetchStores, 300);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [storeSearch]);

    const selectedProductFromList = useMemo(() => {
        return (
            products.find((product) => product.id === selectedProductId) ??
            products[0]
        );
    }, [products, selectedProductId]);

    const selectedProduct = productData?.product ?? selectedProductFromList;

    const prices = useMemo(() => {
        const rawPrices = productData?.prices ?? [];

        const filteredByStores =
            selectedStoreIds.length > 0
                ? rawPrices.filter(
                    (price) =>
                        price.storeId &&
                        selectedStoreIds.includes(price.storeId)
                )
                : rawPrices;

        return [...filteredByStores]
            .filter((price) => getPriceValue(price) > 0)
            .sort((a, b) => {
                const dateA = new Date(a.time ?? a.createdAt ?? 0).getTime();
                const dateB = new Date(b.time ?? b.createdAt ?? 0).getTime();

                return dateA - dateB;
            });
    }, [productData, selectedStoreIds]);

    const fallbackBestPrice =
        selectedStoreIds.length === 0
            ? productData?.bestPrice ?? selectedProductFromList?.bestPrice
            : null;

    const currency = prices[0]?.currency || fallbackBestPrice?.currency || '₸';

    const priceValues = prices.map(getPriceValue);

    const currentPrice =
        priceValues[priceValues.length - 1] || getPriceValue(fallbackBestPrice);

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
            : selectedStoreIds.length === 0
                ? -getDiscountPercent(fallbackBestPrice)
                : 0;

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
                storeCharts: [] as Array<{
                    storeId: string;
                    storeTitle: string;
                    points: string;
                    lineClass: string;
                    pointClass: string;
                    legendClass: string;
                    circles: Array<{
                        x: number;
                        y: number;
                        value: number;
                        label: string;
                    }>;
                }>,
                dateLabels: [] as Array<{
                    x: number;
                    label: string;
                    key: string;
                }>,
                min: 0,
                max: 0,
                averageY: 0,
            };
        }

        const getRawDate = (price: Price) => {
            return price.time ?? price.createdAt ?? '';
        };

        const getNormalizedDate = (price: Price) => {
            return getDateKey(getRawDate(price));
        };

        const allDateKeys = Array.from(
            new Set(
                prices
                    .map(getNormalizedDate)
                    .filter(Boolean)
            )
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

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

        const getXByDateKey = (dateKey: string) => {
            const index = allDateKeys.indexOf(dateKey);

            if (allDateKeys.length <= 1) {
                return (left + right) / 2;
            }

            return left + ((right - left) / (allDateKeys.length - 1)) * index;
        };

        const getYByValue = (value: number) => {
            return bottom - ((value - min) / range) * height;
        };

        const pricesByStore = prices.reduce<Record<string, Price[]>>((acc, price) => {
            if (!price.storeId) {
                return acc;
            }

            if (!acc[price.storeId]) {
                acc[price.storeId] = [];
            }

            acc[price.storeId].push(price);

            return acc;
        }, {});

        const storeCharts = Object.entries(pricesByStore).map(
            ([storeId, storePrices], storeIndex) => {
                const sortedStorePrices = [...storePrices].sort((a, b) => {
                    const dateA = new Date(getRawDate(a)).getTime();
                    const dateB = new Date(getRawDate(b)).getTime();

                    return dateA - dateB;
                });

                const circles = sortedStorePrices.map((price) => {
                    const value = getPriceValue(price);
                    const dateKey = getNormalizedDate(price);

                    return {
                        x: getXByDateKey(dateKey),
                        y: getYByValue(value),
                        value,
                        label: formatDate(dateKey),
                    };
                });

                const colorIndex = storeIndex % lineClasses.length;

                return {
                    storeId,
                    storeTitle: getStoreTitle(storeId, stores),
                    points: circles.map((point) => `${point.x},${point.y}`).join(' '),
                    lineClass: lineClasses[colorIndex],
                    pointClass: pointClasses[colorIndex],
                    legendClass: legendClasses[colorIndex],
                    circles,
                };
            }
        );

        const average =
            values.reduce((sum, value) => sum + value, 0) / values.length;

        const averageY = getYByValue(average);

        const dateLabels = allDateKeys.map((dateKey) => ({
            key: dateKey,
            x: getXByDateKey(dateKey),
            label: formatDate(dateKey),
        }));

        return {
            storeCharts,
            dateLabels,
            min,
            max,
            averageY,
        };
    }, [prices, stores]);

    const toggleStore = (storeId: string) => {
        setSelectedStoreIds((prev) =>
            prev.includes(storeId)
                ? prev.filter((id) => id !== storeId)
                : [...prev, storeId]
        );
    };

    const clearSelectedStores = () => {
        setSelectedStoreIds([]);
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
                            <h2>Select Stores</h2>

                            <div className={styles.searchWrap}>
                                <img src={searchIcon} alt="" />
                                <input
                                    type="text"
                                    placeholder="Search stores..."
                                    value={storeSearch}
                                    onChange={(event) =>
                                        setStoreSearch(event.target.value)
                                    }
                                    className={styles.search}
                                />
                            </div>

                            <div className={styles.selectedStoresRow}>
                                <div className={styles.selectedBadge}>
                                    {selectedStoreIds.length > 0
                                        ? `${selectedStoreIds.length} selected`
                                        : 'All stores'}
                                </div>

                                {selectedStoreIds.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearSelectedStores}
                                        className={styles.clearButton}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className={styles.productList}>
                                {stores.map((store) => {
                                    const isSelected =
                                        selectedStoreIds.includes(store.id);

                                    return (
                                        <label
                                            key={store.id}
                                            className={`${styles.productItem} ${
                                                isSelected
                                                    ? styles.productItemActive
                                                    : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    toggleStore(store.id)
                                                }
                                                className={
                                                    styles.storeCheckbox
                                                }
                                            />

                                            <div className={styles.storeInfo}>
                                                <span
                                                    className={styles.storeName}
                                                >
                                                    {store.title}
                                                </span>

                                                <span
                                                    className={styles.storeMeta}
                                                >
                                                    {store.description ||
                                                        store.contactInfo ||
                                                        'Store'}
                                                </span>
                                            </div>

                                            {isSelected && (
                                                <span
                                                    className={
                                                        styles.selectedCheck
                                                    }
                                                >
                                                    ✓
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}

                                {stores.length === 0 && (
                                    <p className={styles.sideState}>
                                        No stores found
                                    </p>
                                )}
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

                                        <p className={styles.storeText}>
                                            Stores:{' '}
                                            {selectedStoreIds.length > 0
                                                ? `${selectedStoreIds.length} selected`
                                                : 'All stores'}
                                        </p>

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
                                            {[0, 1, 2, 3, 4].map(
                                                (_, index) => {
                                                    const y = 35 + index * 52;
                                                    const value =
                                                        chart.max -
                                                        ((chart.max -
                                                                chart.min) /
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
                                                                {Math.round(
                                                                    value
                                                                )}
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
                                                }
                                            )}

                                            {chart.dateLabels.map((date) => (
                                                <line
                                                    key={date.key}
                                                    x1={date.x}
                                                    y1="35"
                                                    x2={date.x}
                                                    y2="245"
                                                    className={styles.gridLine}
                                                />
                                            ))}

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
                                                className={
                                                    styles.averageLine
                                                }
                                            />

                                            {chart.storeCharts.map(
                                                (storeChart) => (
                                                    <g
                                                        key={
                                                            storeChart.storeId
                                                        }
                                                    >
                                                        {storeChart.circles
                                                            .length > 1 && (
                                                            <polyline
                                                                points={
                                                                    storeChart.points
                                                                }
                                                                className={
                                                                    styles[
                                                                        storeChart
                                                                            .lineClass
                                                                        ]
                                                                }
                                                            />
                                                        )}

                                                        {storeChart.circles.map(
                                                            (point, index) => (
                                                                <g
                                                                    key={`${storeChart.storeId}-${index}`}
                                                                >
                                                                    <circle
                                                                        cx={
                                                                            point.x
                                                                        }
                                                                        cy={
                                                                            point.y
                                                                        }
                                                                        r="5"
                                                                        className={
                                                                            styles[
                                                                                storeChart
                                                                                    .pointClass
                                                                                ]
                                                                        }
                                                                    />

                                                                    <title>
                                                                        {
                                                                            storeChart.storeTitle
                                                                        }
                                                                        :{' '}
                                                                        {formatPrice(
                                                                            point.value,
                                                                            currency
                                                                        )}{' '}
                                                                        ·{' '}
                                                                        {
                                                                            point.label
                                                                        }
                                                                    </title>
                                                                </g>
                                                            )
                                                        )}
                                                    </g>
                                                )
                                            )}

                                            {chart.dateLabels.map((date) => (
                                                <text
                                                    key={date.key}
                                                    x={date.x}
                                                    y="276"
                                                    className={styles.month}
                                                >
                                                    {date.label}
                                                </text>
                                            ))}
                                        </svg>
                                    ) : (
                                        <div className={styles.noChart}>
                                            No price history for selected stores
                                        </div>
                                    )}

                                    <div className={styles.legend}>
                                        {chart.storeCharts.length > 0 ? (
                                            chart.storeCharts.map(
                                                (storeChart) => (
                                                    <span
                                                        key={
                                                            storeChart.storeId
                                                        }
                                                        className={
                                                            styles[
                                                                storeChart
                                                                    .legendClass
                                                                ]
                                                        }
                                                    >
                                                        {storeChart.storeTitle}
                                                    </span>
                                                )
                                            )
                                        ) : (
                                            <span
                                                className={styles.legendGreen}
                                            >
                                                Actual Price
                                            </span>
                                        )}

                                        <span className={styles.redLegend}>
                                            Average Price
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
                                    <b>
                                        {formatPrice(averagePrice, currency)}
                                    </b>
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