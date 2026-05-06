import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from '../../ components/MainHeader/MainHeader';
import AccountSidebar from '../../ components/AccountSidebar/AccountSidebar';

import styles from '../ DashboardPage/DashboardPage.module.css';

import arrowLeftIcon from '../../assets/ArrowLeft.svg';
import receiptIcon from '../../assets/Package.svg';
import filterIcon from '../../assets/Funnel.svg';

type ReceiptItem = {
    id: string;
    title: string;
    price: number;
    currency: string;
    quantity: number;
    subtitle?: string;
    oldPrice?: number;
    image?: string;
};

type SavedReceipt = {
    id: string;
    createdAt: string;
    items: ReceiptItem[];
    totalQuantity: number;
    total: number;
    currency: string;
};

const RECEIPTS_STORAGE_KEY = 'trend-price-receipts';

const formatPrice = (value: number, currency = '₸') => {
    if (!value) {
        return 'No price';
    }

    return `${Math.round(value)}${currency}`;
};

const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('ru-RU');
};

const readReceiptsFromStorage = (): SavedReceipt[] => {
    try {
        const rawReceipts = localStorage.getItem(RECEIPTS_STORAGE_KEY);

        if (!rawReceipts) {
            return [];
        }

        const parsedReceipts = JSON.parse(rawReceipts);

        if (!Array.isArray(parsedReceipts)) {
            return [];
        }

        return parsedReceipts;
    } catch (error) {
        console.log('RECEIPTS READ ERROR:', error);
        return [];
    }
};

export default function ReceiptsPage() {
    const [receipts, setReceipts] = useState<SavedReceipt[]>(
        readReceiptsFromStorage
    );
    const [openedReceiptId, setOpenedReceiptId] = useState<string | null>(null);

    const totalSavedProducts = useMemo(() => {
        return receipts.reduce((sum, receipt) => {
            return sum + receipt.totalQuantity;
        }, 0);
    }, [receipts]);

    const handleDeleteReceipt = (receiptId: string) => {
        const nextReceipts = receipts.filter(
            (receipt) => receipt.id !== receiptId
        );

        setReceipts(nextReceipts);
        localStorage.setItem(
            RECEIPTS_STORAGE_KEY,
            JSON.stringify(nextReceipts)
        );
    };

    const handleClearReceipts = () => {
        setReceipts([]);
        localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify([]));
        setOpenedReceiptId(null);
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

                            {receipts.length === 0 ? (
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
                                    {receipts.map((receipt) => {
                                        const isOpen =
                                            openedReceiptId === receipt.id;

                                        return (
                                            <article
                                                key={receipt.id}
                                                className={styles.receiptItem}
                                            >
                                                <button
                                                    type="button"
                                                    className={styles.receiptRow}
                                                    onClick={() =>
                                                        setOpenedReceiptId(
                                                            isOpen
                                                                ? null
                                                                : receipt.id
                                                        )
                                                    }
                                                >
                                                    <span>
                                                        Date:{' '}
                                                        {formatDate(
                                                            receipt.createdAt
                                                        )}
                                                    </span>

                                                    <span>
                                                        Quantity:{' '}
                                                        {receipt.totalQuantity}
                                                    </span>

                                                    <span>
                                                        Sum:{' '}
                                                        {formatPrice(
                                                            receipt.total,
                                                            receipt.currency
                                                        )}
                                                    </span>
                                                </button>

                                                {isOpen && (
                                                    <div
                                                        className={
                                                            styles.receiptDetails
                                                        }
                                                    >
                                                        {receipt.items.map(
                                                            (item) => (
                                                                <div
                                                                    key={item.id}
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
                                                                            item.price *
                                                                            item.quantity,
                                                                            item.currency
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
                                                                    receipt.total,
                                                                    receipt.currency
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
        </>
    );
}