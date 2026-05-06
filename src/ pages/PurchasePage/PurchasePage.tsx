import { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from '../../ components/MainHeader/MainHeader';
import Footer from '../../ components/Footer/Footer';

import boxIcon from '../../assets/Package.svg';
import arrowLeftIcon from '../../assets/ArrowLeftWhite.svg';
import minusIcon from '../../assets/Minus.svg';
import plusIcon from '../../assets/Plus.svg';
import trashIcon from '../../assets/Trash.svg';

import { useCart } from '../../cart/useCart';

import styles from './PurchasePage.module.css';

const formatPrice = (value: number, currency = '₸') => {
    return `${Math.round(value)}${currency}`;
};

export default function PurchasePage() {
    const {
        cartItems,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
    } = useCart();

    const [isReceiptSaved, setIsReceiptSaved] = useState(false);

    const isCartEmpty = cartItems.length === 0;

    const totalCurrent = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    const totalQuantity = cartItems.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    const currency = cartItems[0]?.currency || '₸';

    const handleSaveReceipt = () => {
        const savedReceiptsRaw = localStorage.getItem('trend-price-receipts');
        const savedReceipts = savedReceiptsRaw
            ? JSON.parse(savedReceiptsRaw)
            : [];

        const newReceipt = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            items: cartItems,
            totalQuantity,
            total: totalCurrent,
            currency,
        };

        localStorage.setItem(
            'trend-price-receipts',
            JSON.stringify([newReceipt, ...savedReceipts])
        );

        clearCart();
        setIsReceiptSaved(true);
    };

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    {isReceiptSaved ? (
                        <section className={styles.savedReceipt}>
                            <div className={styles.iconCircle}>
                                <img src={boxIcon} alt="" />
                            </div>

                            <h1>Receipt saved</h1>
                            <p>
                                Your receipt has been saved. Later it will appear
                                in the Checks tab.
                            </p>

                            <div className={styles.savedActions}>
                                <Link to="/receipts" className={styles.button}>
                                    <span>Go to My receipts</span>
                                </Link>

                                <Link to="/catalog" className={styles.secondaryButton}>
                                    <span>Back to catalog</span>
                                </Link>
                            </div>
                        </section>
                    ) : isCartEmpty ? (
                        <section className={styles.emptyCart}>
                            <div className={styles.iconCircle}>
                                <img src={boxIcon} alt="" />
                            </div>

                            <h1>Your cart is empty</h1>
                            <p>Add some products to your cart to see them here</p>

                            <Link to="/catalog" className={styles.button}>
                                <img src={arrowLeftIcon} alt="" />
                                <span>Continue Shopping</span>
                            </Link>
                        </section>
                    ) : (
                        <>
                            <div className={styles.topRow}>
                                <Link to="/catalog" className={styles.backLink}>
                                    <img src={arrowLeftIcon} alt="" />
                                    <span>Continue Shopping</span>
                                </Link>

                                <button
                                    type="button"
                                    className={styles.clearButton}
                                    onClick={clearCart}
                                >
                                    Clear cart
                                </button>
                            </div>

                            <h1 className={styles.title}>Purchase</h1>

                            <div className={styles.cartList}>
                                {cartItems.map((item) => (
                                    <article
                                        key={item.id}
                                        className={styles.cartCard}
                                    >
                                        <div className={styles.imageBox}>
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    onError={(event) => {
                                                        event.currentTarget.style.display =
                                                            'none';

                                                        const fallback =
                                                            event.currentTarget
                                                                .nextElementSibling as HTMLSpanElement | null;

                                                        if (fallback) {
                                                            fallback.style.display =
                                                                'flex';
                                                        }
                                                    }}
                                                />
                                            ) : null}

                                            <span
                                                style={{
                                                    display: item.image
                                                        ? 'none'
                                                        : 'flex',
                                                }}
                                            >
                                                {item.title}
                                            </span>
                                        </div>

                                        <div className={styles.cardInfo}>
                                            <h2>{item.title}</h2>
                                            <p>
                                                {item.subtitle ||
                                                    'No description'}
                                            </p>
                                        </div>

                                        <button
                                            className={styles.deleteButton}
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                            type="button"
                                            aria-label="Remove item"
                                        >
                                            <img src={trashIcon} alt="" />
                                        </button>

                                        <div className={styles.quantity}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decreaseQuantity(item.id)
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                <img src={minusIcon} alt="" />
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    increaseQuantity(item.id)
                                                }
                                                aria-label="Increase quantity"
                                            >
                                                <img src={plusIcon} alt="" />
                                            </button>
                                        </div>

                                        <div className={styles.priceBlock}>
                                            <b>
                                                {formatPrice(
                                                    item.price,
                                                    item.currency
                                                )}
                                            </b>

                                            <span>
                                                Total:{' '}
                                                {formatPrice(
                                                    item.price * item.quantity,
                                                    item.currency
                                                )}
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <section className={styles.receipt}>
                                <div className={styles.receiptTop}>
                                    <div>
                                        <h2>Receipt</h2>
                                        <p>
                                            {new Date().toLocaleDateString(
                                                'ru-RU'
                                            )}
                                        </p>
                                    </div>

                                    <div className={styles.receiptTotal}>
                                        <span>Total</span>
                                        <b>
                                            {formatPrice(
                                                totalCurrent,
                                                currency
                                            )}
                                        </b>
                                    </div>
                                </div>

                                <div className={styles.receiptHeader}>
                                    <span>Product</span>
                                    <span>Qty</span>
                                    <span>Price</span>
                                    <span>Total</span>
                                </div>

                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={styles.receiptRow}
                                    >
                                        <span>{item.title}</span>
                                        <span>{item.quantity}</span>
                                        <span>
                                            {formatPrice(
                                                item.price,
                                                item.currency
                                            )}
                                        </span>
                                        <span>
                                            {formatPrice(
                                                item.price * item.quantity,
                                                item.currency
                                            )}
                                        </span>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className={styles.saveButton}
                                    onClick={handleSaveReceipt}
                                >
                                    Save receipt
                                </button>
                            </section>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}