import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { productService } from '../../services/productService';
import { priceService } from '../../services/priceService';
import type { Price, Product } from '../../types/api';
import styles from './AdminProductsPage.module.css';

import totalProductsIcon from '../../assets/StorefrontGreen.svg';
import checkedIcon from '../../assets/CheckCircle.svg';
import needCheckIcon from '../../assets/Prohibit.svg';
import withPricesIcon from '../../assets/StorefrontGreen.svg';
import categoriesIcon from '../../assets/diagram (1) 1.svg';

const PAGE_SIZE = 8;

type ProductPageResponse = {
    content?: Product[];
    totalElements?: number;
    totalPages?: number;
    number?: number;
    pageNumber?: number;
    size?: number;
};

const getPriceValue = (price: Price) => {
    return Number(price.finalPrice ?? price.pricePerUnit ?? 0);
};

const formatPrice = (value?: number) => {
    if (!Number.isFinite(Number(value))) return '-';
    return `${Math.round(Number(value)).toLocaleString('ru-RU')}₸`;
};

const getBrandTitle = (product: Product) => {
    if (!product.brand) return '-';

    if (typeof product.brand === 'string') {
        return product.brand;
    }

    return product.brand.title || '-';
};

const getCategoryTitle = (product: Product) => {
    return product.categories?.map((category) => category.title).join(', ') || '-';
};

const getProductStatus = (product: Product) => {
    return product.checked ? 'Checked' : 'Need check';
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [prices, setPrices] = useState<Price[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [openNoteId, setOpenNoteId] = useState<string | null>(null);

    const [savedNotes, setSavedNotes] = useState<Record<string, string>>(() => {
        const saved = localStorage.getItem('admin_product_notes');

        if (!saved) return {};

        try {
            return JSON.parse(saved) as Record<string, string>;
        } catch {
            return {};
        }
    });

    const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

    const loadProducts = async (nextPage = page) => {
        setLoading(true);
        setError('');

        try {
            const [pageResponse, loadedPrices, loadedAllProducts] = await Promise.all([
                productService.getProductsByPage(nextPage, PAGE_SIZE) as Promise<ProductPageResponse>,
                priceService.getAllPrices(),
                productService.getAllProducts().catch(() => []),
            ]);

            const pageProducts = pageResponse.content ?? [];

            setProducts(pageProducts);
            setPrices(loadedPrices);
            setAllProducts(loadedAllProducts);

            setTotalProducts(pageResponse.totalElements ?? loadedAllProducts.length ?? pageProducts.length);
            setTotalPages(
                Math.max(
                    1,
                    pageResponse.totalPages ??
                    Math.ceil((pageResponse.totalElements ?? loadedAllProducts.length ?? pageProducts.length) / PAGE_SIZE)
                )
            );
            setPage(nextPage);
        } catch {
            setError('Не удалось загрузить продукты');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadProducts(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const priceRangeByProduct = useMemo(() => {
        const map: Record<string, number[]> = {};

        prices.forEach((price) => {
            const value = getPriceValue(price);

            if (!Number.isFinite(value) || value <= 0) return;

            if (!map[price.productId]) {
                map[price.productId] = [];
            }

            map[price.productId].push(value);
        });

        return map;
    }, [prices]);

    const checkedCount = useMemo(() => {
        return allProducts.filter((product) => product.checked).length;
    }, [allProducts]);

    const needCheckCount = useMemo(() => {
        return allProducts.filter((product) => !product.checked).length;
    }, [allProducts]);

    const productsWithPricesCount = useMemo(() => {
        return allProducts.filter((product) => {
            const values = priceRangeByProduct[product.id] ?? [];
            return values.length > 0;
        }).length;
    }, [allProducts, priceRangeByProduct]);

    const categoriesCount = useMemo(() => {
        return new Set(
            allProducts.flatMap((product) =>
                product.categories?.map((category) => category.id) ?? []
            )
        ).size;
    }, [allProducts]);

    const stats = [
        {
            title: 'Total Products',
            value: totalProducts,
            icon: totalProductsIcon,
        },
        {
            title: 'Checked',
            value: checkedCount,
            icon: checkedIcon,
        },
        {
            title: 'Need check',
            value: needCheckCount,
            icon: needCheckIcon,
        },
        {
            title: 'With prices',
            value: productsWithPricesCount,
            icon: withPricesIcon,
        },
        {
            title: 'Categories',
            value: categoriesCount,
            icon: categoriesIcon,
        },
    ];

    const from = totalProducts === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const to = Math.min(page * PAGE_SIZE, totalProducts);

    const goPrev = () => {
        if (page <= 1) return;
        void loadProducts(page - 1);
    };

    const goNext = () => {
        if (page >= totalPages) return;
        void loadProducts(page + 1);
    };

    const handleOpenNote = (productId: string) => {
        setOpenNoteId((currentId) => {
            if (currentId === productId) {
                return null;
            }

            setDraftNotes((prev) => ({
                ...prev,
                [productId]: savedNotes[productId] ?? '',
            }));

            return productId;
        });
    };

    const handleDraftNoteChange = (productId: string, value: string) => {
        setDraftNotes((prev) => ({
            ...prev,
            [productId]: value,
        }));
    };

    const handleSaveNote = (productId: string) => {
        const note = draftNotes[productId] ?? '';

        setSavedNotes((prev) => {
            const next = {
                ...prev,
                [productId]: note,
            };

            localStorage.setItem('admin_product_notes', JSON.stringify(next));

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
                            <h1>Products Management</h1>
                            <p>Manage product catalog and track prices across stores</p>
                            <span>
                                Total: {totalProducts.toLocaleString('ru-RU')} • Showing {from}-{to} • Checked:{' '}
                                {checkedCount.toLocaleString('ru-RU')}
                            </span>
                        </div>

                        <button
                            type="button"
                            className={styles.refreshButton}
                            onClick={() => loadProducts(page)}
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
                            <p className={styles.loadingText}>Loading products...</p>
                        ) : (
                            <>
                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Brand</th>
                                            <th>Category</th>
                                            <th>Barcode</th>
                                            <th>Price Range</th>
                                            <th>Availability</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {products.map((product) => {
                                            const values = priceRangeByProduct[product.id] ?? [];
                                            const min = values.length ? Math.min(...values) : undefined;
                                            const max = values.length ? Math.max(...values) : undefined;
                                            const status = getProductStatus(product);

                                            return (
                                                <tr key={product.id}>
                                                    <td data-label="Product">
                                                        <strong>{product.title}</strong>
                                                    </td>

                                                    <td data-label="Brand">
                                                        {getBrandTitle(product)}
                                                    </td>

                                                    <td data-label="Category">
                                                        {getCategoryTitle(product)}
                                                    </td>

                                                    <td data-label="Barcode">
                                                        {product.barcode || '-'}
                                                    </td>

                                                    <td data-label="Price Range">
                                                        {values.length ? (
                                                            <>
                                                                    <span className={styles.minPrice}>
                                                                        {formatPrice(min)}
                                                                    </span>
                                                                {' - '}
                                                                <span className={styles.maxPrice}>
                                                                        {formatPrice(max)}
                                                                    </span>
                                                            </>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </td>

                                                    <td data-label="Availability">
                                                            <span
                                                                className={`${styles.status} ${
                                                                    product.checked
                                                                        ? styles.checked
                                                                        : styles.needCheck
                                                                }`}
                                                            >
                                                                {status}
                                                            </span>
                                                    </td>

                                                    <td
                                                        data-label="Actions"
                                                        className={styles.actionsCell}
                                                    >
                                                        <button
                                                            type="button"
                                                            className={styles.actionButton}
                                                            onClick={() => handleOpenNote(product.id)}
                                                        >
                                                            ...
                                                        </button>

                                                        {savedNotes[product.id] &&
                                                            openNoteId !== product.id && (
                                                                <span className={styles.notePreview}>
                                                                        Note saved
                                                                    </span>
                                                            )}

                                                        {openNoteId === product.id && (
                                                            <div className={styles.notePopover}>
                                                                    <textarea
                                                                        className={styles.noteInput}
                                                                        value={draftNotes[product.id] ?? ''}
                                                                        onChange={(event) =>
                                                                            handleDraftNoteChange(
                                                                                product.id,
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
                                                                        onClick={() => handleSaveNote(product.id)}
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

                                {products.length === 0 && (
                                    <p className={styles.emptyText}>No products found</p>
                                )}

                                <div className={styles.pagination}>
                                    <span>
                                        Showing {from}-{to} of {totalProducts} products
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