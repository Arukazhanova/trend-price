import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from '../../ components/MainHeader/MainHeader';
import AccountSidebar from '../../ components/AccountSidebar/AccountSidebar';
import Footer from '../../ components/Footer/Footer';

import { useAuth } from '../../auth/AuthContext';
import { purchaseService } from '../../services/purchaseService';
import { productService } from '../../services/productService';

import type { Receipt } from '../../types/api';

import styles from '../ DashboardPage/DashboardPage.module.css';

import arrowLeftIcon from '../../assets/ArrowLeft.svg';
import receiptIcon from '../../assets/Package.svg';
import filterIcon from '../../assets/Funnel.svg';

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

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('ru-RU');
};

export default function ReceiptsPage() {
    const { user } = useAuth();

    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [openedReceiptId, setOpenedReceiptId] = useState<string | null>(null);
    const [productTitles, setProductTitles] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const userId = useMemo(() => {
        const rawUserId =
            user?.userId ?? user?.id ?? localStorage.getItem('userId');

        const numericUserId = Number(rawUserId);

        return Number.isFinite(numericUserId) && numericUserId > 0
            ? numericUserId
            : null;
    }, [user?.id, user?.userId]);

    useEffect(() => {
        const fetchReceipts = async () => {
            if (!userId) {
                setReceipts([]);
                setError('User is not found. Please login again.');
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                const data = await purchaseService.getReceiptsByUserId(userId);
                setReceipts(data);
            } catch (requestError) {
                console.log('RECEIPTS LOAD ERROR:', requestError);
                setError('Failed to load receipts from backend');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchReceipts();
    }, [userId]);

    useEffect(() => {
        const productIds = Array.from(
            new Set(
                receipts.flatMap((receipt) =>
                    receipt.purchases?.map((purchase) => purchase.productId) ?? []
                )
            )
        ).filter(Boolean);

        const missingProductIds = productIds.filter(
            (productId) => !productTitles[productId]
        );

        if (missingProductIds.length === 0) {
            return;
        }

        let isCancelled = false;

        const fetchProductTitles = async () => {
            try {
                const entries = await Promise.all(
                    missingProductIds.map(async (productId) => {
                        try {
                            const product = await productService.getProductById(
                                productId
                            );

                            return [productId, product.title] as const;
                        } catch {
                            return [productId, productId] as const;
                        }
                    })
                );

                if (!isCancelled) {
                    setProductTitles((prev) => ({
                        ...prev,
                        ...Object.fromEntries(entries),
                    }));
                }
            } catch (requestError) {
                console.log('PRODUCT TITLES LOAD ERROR:', requestError);
            }
        };

        void fetchProductTitles();

        return () => {
            isCancelled = true;
        };
    }, [receipts, productTitles]);

    const totalSavedProducts = useMemo(() => {
        return receipts.reduce((sum, receipt) => {
            return sum + (receipt.purchases?.length ?? 0);
        }, 0);
    }, [receipts]);

    const getReceiptTotal = (receipt: Receipt) => {
        if (receipt.priceValue) {
            return receipt.priceValue;
        }

        return (
            receipt.purchases?.reduce((sum, purchase) => {
                return sum + Number(purchase.priceValue ?? 0);
            }, 0) ?? 0
        );
    };

    const getReceiptDate = (receipt: Receipt) => {
        return receipt.receiptDate ?? receipt.createdAt;
    };

    const getGroupedPurchases = (receipt: Receipt) => {
        const groupedPurchases = new Map<
            string,
            {
                productId: string;
                title: string;
                quantity: number;
                total: number;
            }
        >();

        receipt.purchases?.forEach((purchase) => {
            const productId = purchase.productId;
            const currentItem = groupedPurchases.get(productId);

            if (currentItem) {
                groupedPurchases.set(productId, {
                    ...currentItem,
                    quantity: currentItem.quantity + 1,
                    total: currentItem.total + Number(purchase.priceValue ?? 0),
                });

                return;
            }

            groupedPurchases.set(productId, {
                productId,
                title: productTitles[productId] ?? productId,
                quantity: 1,
                total: Number(purchase.priceValue ?? 0),
            });
        });

        return Array.from(groupedPurchases.values());
    };

    const handleDeleteReceipt = async (receiptId?: string) => {
        if (!receiptId) {
            return;
        }

        try {
            await purchaseService.deleteReceipt(receiptId);

            setReceipts((prevReceipts) =>
                prevReceipts.filter((receipt) => receipt.id !== receiptId)
            );

            if (openedReceiptId === receiptId) {
                setOpenedReceiptId(null);
            }
        } catch (requestError) {
            console.log('RECEIPT DELETE ERROR:', requestError);
            setError('Failed to delete receipt');
        }
    };

    const handleClearReceipts = async () => {
        const receiptIds = receipts
            .map((receipt) => receipt.id)
            .filter((id): id is string => Boolean(id));

        if (receiptIds.length === 0) {
            return;
        }

        try {
            await Promise.all(
                receiptIds.map((receiptId) =>
                    purchaseService.deleteReceipt(receiptId)
                )
            );

            setReceipts([]);
            setOpenedReceiptId(null);
        } catch (requestError) {
            console.log('RECEIPTS CLEAR ERROR:', requestError);
            setError('Failed to clear receipts');
        }
    };

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <Link to="/" className={styles.backLink}>
                        <img src={arrowLeftIcon} alt="" />
                        <span>Home</span>
                    </Link>

                    <section className={styles.hero}>
                        <div className={styles.heroIcon}>
                            <img src={receiptIcon} alt="" />
                        </div>

                        <div>
                            <h1>My receipts</h1>
                            <p>Keep track of your receipts in one place</p>
                        </div>
                    </section>

                    <div className={styles.layout}>
                        <AccountSidebar
                            activePage="receipts"
                            receiptsCount={receipts.length}
                            productsCount={totalSavedProducts}
                        />

                        <section className={styles.receiptsCard}>
                            <div className={styles.receiptsHeader}>
                                <div>
                                    <h2>All receipts</h2>
                                    <p>Keep track of your receipts in one place</p>
                                </div>

                                <div className={styles.receiptsActions}>
                                    {receipts.length > 0 && (
                                        <button
                                            type="button"
                                            className={styles.clearReceiptsButton}
                                            onClick={handleClearReceipts}
                                        >
                                            Clear all
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className={styles.filterButton}
                                    >
                                        <img src={filterIcon} alt="" />
                                        <span>Filter</span>
                                    </button>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className={styles.emptyReceipts}>
                                    <img src={receiptIcon} alt="" />
                                    <h3>Loading receipts...</h3>
                                </div>
                            ) : error ? (
                                <div className={styles.emptyReceipts}>
                                    <img src={receiptIcon} alt="" />
                                    <h3>{error}</h3>
                                </div>
                            ) : receipts.length === 0 ? (
                                <div className={styles.emptyReceipts}>
                                    <img src={receiptIcon} alt="" />
                                    <h3>No receipts yet</h3>
                                    <p>
                                        Save a receipt from Purchase and it will
                                        appear here.
                                    </p>

                                    <Link
                                        to="/catalog"
                                        className={styles.receiptsCatalogButton}
                                    >
                                        Go to catalog
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.receiptList}>
                                    {receipts.map((receipt, index) => {
                                        const receiptId =
                                            receipt.id ?? String(index);

                                        const isOpen =
                                            openedReceiptId === receiptId;

                                        const groupedPurchases =
                                            getGroupedPurchases(receipt);

                                        return (
                                            <article
                                                key={receiptId}
                                                className={styles.receiptItem}
                                            >
                                                <button
                                                    type="button"
                                                    className={styles.receiptRow}
                                                    onClick={() =>
                                                        setOpenedReceiptId(
                                                            isOpen
                                                                ? null
                                                                : receiptId
                                                        )
                                                    }
                                                >
                                                    <span>
                                                        Date:{' '}
                                                        {formatDate(
                                                            getReceiptDate(receipt)
                                                        )}
                                                    </span>

                                                    <span>
                                                        Quantity:{' '}
                                                        {receipt.purchases?.length ??
                                                            0}
                                                    </span>

                                                    <span>
                                                        Sum:{' '}
                                                        {formatPrice(
                                                            getReceiptTotal(receipt)
                                                        )}
                                                    </span>
                                                </button>

                                                {isOpen && (
                                                    <div
                                                        className={
                                                            styles.receiptDetails
                                                        }
                                                    >
                                                        {groupedPurchases.map(
                                                            (item) => (
                                                                <div
                                                                    key={
                                                                        item.productId
                                                                    }
                                                                    className={
                                                                        styles.receiptProductRow
                                                                    }
                                                                >
                                                                    <span>
                                                                        {item.title}
                                                                    </span>

                                                                    <span>
                                                                        x
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </span>

                                                                    <span>
                                                                        {formatPrice(
                                                                            item.total
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}

                                                        <div
                                                            className={
                                                                styles.receiptDetailsFooter
                                                            }
                                                        >
                                                            <b>
                                                                Total:{' '}
                                                                {formatPrice(
                                                                    getReceiptTotal(
                                                                        receipt
                                                                    )
                                                                )}
                                                            </b>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteReceipt(
                                                                        receipt.id
                                                                    )
                                                                }
                                                            >
                                                                Delete receipt
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </article>
                                        );
                                    })}
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