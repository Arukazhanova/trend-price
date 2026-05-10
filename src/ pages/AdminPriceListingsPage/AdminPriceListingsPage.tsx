import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { priceService } from '../../services/priceService';
import { productService } from '../../services/productService';
import { storeService } from '../../services/storeService';
import type { Price, Product, Store } from '../../types/api';
import styles from './AdminPriceListingsPage.module.css';

import totalPricesIcon from '../../assets/StorefrontGreen.svg';
import productsIcon from '../../assets/PackageGreen.svg';
import storesIcon from '../../assets/StorefrontGreen.svg';
import citiesIcon from '../../assets/ChartLine.svg';
import discountsIcon from '../../assets/Power.svg';

const PAGE_SIZE = 8;

const formatPrice = (value?: number) => {
    if (!Number.isFinite(Number(value))) return '-';
    return `${Math.round(Number(value)).toLocaleString('ru-RU')}₸`;
};

const formatDate = (dateValue?: string) => {
    if (!dateValue) return '-';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleString('ru-RU');
};

const getPriceValue = (price: Price) => {
    return Number(price.finalPrice ?? price.pricePerUnit ?? 0);
};

export default function AdminPriceListingsPage() {
    const [prices, setPrices] = useState<Price[]>([]);
    const [products, setProducts] = useState<Record<string, Product>>({});
    const [stores, setStores] = useState<Record<string, Store>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);

    const [openNoteId, setOpenNoteId] = useState<string | null>(null);

    const [savedNotes, setSavedNotes] = useState<Record<string, string>>(() => {
        const saved = localStorage.getItem('admin_price_notes');

        if (!saved) return {};

        try {
            return JSON.parse(saved) as Record<string, string>;
        } catch {
            return {};
        }
    });

    const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

    const loadData = async () => {
        setLoading(true);
        setError('');

        try {
            const [loadedPrices, loadedProducts, loadedStores] = await Promise.all([
                priceService.getAllPrices(),
                productService.getAllProducts(),
                storeService.getAllStores(),
            ]);

            setPrices(loadedPrices);

            setProducts(
                Object.fromEntries(
                    loadedProducts.map((product) => [product.id, product])
                )
            );

            setStores(
                Object.fromEntries(
                    loadedStores.map((store) => [store.id, store])
                )
            );

            setPage(1);
        } catch {
            setError('Не удалось загрузить цены');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const totalPages = Math.max(1, Math.ceil(prices.length / PAGE_SIZE));

    const paginatedPrices = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        return prices.slice(start, end);
    }, [prices, page]);

    const from = prices.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const to = Math.min(page * PAGE_SIZE, prices.length);

    const citiesCount = useMemo(() => {
        return new Set(
            prices
                .map((price) => price.city)
                .filter((city): city is string => Boolean(city))
        ).size;
    }, [prices]);

    const storesCount = useMemo(() => {
        return new Set(prices.map((price) => price.storeId)).size;
    }, [prices]);

    const productsCount = useMemo(() => {
        return new Set(prices.map((price) => price.productId)).size;
    }, [prices]);

    const discountedCount = useMemo(() => {
        return prices.filter((price) => Number(price.discount) > 0).length;
    }, [prices]);

    const stats = [
        {
            title: 'Total Prices',
            value: prices.length,
            icon: totalPricesIcon,
        },
        {
            title: 'Products',
            value: productsCount,
            icon: productsIcon,
        },
        {
            title: 'Stores',
            value: storesCount,
            icon: storesIcon,
        },
        {
            title: 'Cities',
            value: citiesCount,
            icon: citiesIcon,
        },
        {
            title: 'Discounts',
            value: discountedCount,
            icon: discountsIcon,
        },
    ];

    const goPrev = () => {
        setPage((prev) => Math.max(1, prev - 1));
    };

    const goNext = () => {
        setPage((prev) => Math.min(totalPages, prev + 1));
    };

    const handleOpenNote = (priceId: string) => {
        setOpenNoteId((currentId) => {
            if (currentId === priceId) {
                return null;
            }

            setDraftNotes((prev) => ({
                ...prev,
                [priceId]: savedNotes[priceId] ?? '',
            }));

            return priceId;
        });
    };

    const handleDraftNoteChange = (priceId: string, value: string) => {
        setDraftNotes((prev) => ({
            ...prev,
            [priceId]: value,
        }));
    };

    const handleSaveNote = (priceId: string) => {
        const note = draftNotes[priceId] ?? '';

        setSavedNotes((prev) => {
            const next = {
                ...prev,
                [priceId]: note,
            };

            localStorage.setItem('admin_price_notes', JSON.stringify(next));

            return next;
        });

        setOpenNoteId(null);
    };

    const handleCancelNote = () => {
        setOpenNoteId(null);
    };

    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.pageContent}>
                    <div className={styles.titleRow}>
                        <div>
                            <h1>Price Listings</h1>
                            <p>Track and manage price comparisons across all stores</p>
                            <span>
                                Total: {prices.length.toLocaleString('ru-RU')} • Showing {from}-{to}
                            </span>
                        </div>

                        <button
                            type="button"
                            className={styles.refreshButton}
                            onClick={loadData}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.statsGrid}>
                        {stats.map((item) => (
                            <div key={item.title} className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <img src={item.icon} alt="" />
                                </div>

                                <div>
                                    <p>{item.title}</p>
                                    <h3>{item.value.toLocaleString('ru-RU')}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.tableCard}>
                        {loading ? (
                            <p className={styles.loadingText}>Loading prices...</p>
                        ) : (
                            <>
                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Store</th>
                                            <th>Current Price</th>
                                            <th>Discount</th>
                                            <th>City</th>
                                            <th>Updated</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {paginatedPrices.map((item) => {
                                            const currentPrice = getPriceValue(item);
                                            const productTitle =
                                                products[item.productId]?.title ?? item.productId;
                                            const storeTitle =
                                                stores[item.storeId]?.title ?? item.storeId;
                                            const discount = Number(item.discount ?? 0);

                                            return (
                                                <tr key={item.id}>
                                                    <td data-label="Product">
                                                        <strong>{productTitle}</strong>
                                                    </td>

                                                    <td data-label="Store">
                                                        {storeTitle}
                                                    </td>

                                                    <td data-label="Current Price">
                                                        {formatPrice(currentPrice)}
                                                    </td>

                                                    <td data-label="Discount">
                                                            <span
                                                                className={`${styles.discountBadge} ${
                                                                    discount > 0
                                                                        ? styles.discountActive
                                                                        : styles.discountEmpty
                                                                }`}
                                                            >
                                                                {discount > 0 ? `${discount}%` : '0%'}
                                                            </span>
                                                    </td>

                                                    <td data-label="City">
                                                        {item.city || '-'}
                                                    </td>

                                                    <td data-label="Updated">
                                                        {formatDate(
                                                            item.updatedAt ?? item.time ?? item.createdAt
                                                        )}
                                                    </td>

                                                    <td
                                                        data-label="Actions"
                                                        className={styles.actionsCell}
                                                    >
                                                        <button
                                                            type="button"
                                                            className={styles.actionButton}
                                                            onClick={() => handleOpenNote(item.id)}
                                                        >
                                                            ...
                                                        </button>

                                                        {savedNotes[item.id] &&
                                                            openNoteId !== item.id && (
                                                                <span className={styles.notePreview}>
                                                                        Note saved
                                                                    </span>
                                                            )}

                                                        {openNoteId === item.id && (
                                                            <div className={styles.notePopover}>
                                                                    <textarea
                                                                        className={styles.noteInput}
                                                                        value={draftNotes[item.id] ?? ''}
                                                                        onChange={(event) =>
                                                                            handleDraftNoteChange(
                                                                                item.id,
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Write note..."
                                                                        rows={3}
                                                                    />

                                                                <div className={styles.noteActions}>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.cancelNoteButton}
                                                                        onClick={handleCancelNote}
                                                                    >
                                                                        Cancel
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className={styles.saveNoteButton}
                                                                        onClick={() => handleSaveNote(item.id)}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>

                                {prices.length === 0 && (
                                    <p className={styles.emptyText}>No prices found</p>
                                )}

                                <div className={styles.pagination}>
                                    <span>
                                        Showing {from}-{to} of {prices.length} price listings
                                    </span>

                                    <div className={styles.paginationActions}>
                                        <button
                                            type="button"
                                            onClick={goPrev}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </button>

                                        <b>
                                            {page} / {totalPages}
                                        </b>

                                        <button
                                            type="button"
                                            onClick={goNext}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}