import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MainHeader from '../../ components/MainHeader/MainHeader';
import Footer from '../../ components/Footer/Footer';
import boxIcon from '../../assets/Package.svg';
import arrowLeftIcon from '../../assets/ArrowLeftWhite.svg';
import minusIcon from '../../assets/Minus.svg';
import plusIcon from '../../assets/Plus.svg';
import trashIcon from '../../assets/Trash.svg';
import styles from './PurchasePage.module.css';

interface CartItem {
    id: string;
    title: string;
    price: number;
    currency: string;
    quantity: number;
    subtitle?: string;
    oldPrice?: number;
    image?: string;
}

const CART_STORAGE_KEY = 'trend-price-cart';

const formatPrice = (value: number, currency = '₸') => {
    return `${Math.round(value)}${currency}`;
};

const readCartFromStorage = (): CartItem[] => {
    try {
        const rawCart = localStorage.getItem(CART_STORAGE_KEY);

        if (!rawCart) {
            return [];
        }

        const parsedCart = JSON.parse(rawCart);

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        return parsedCart;
    } catch (error) {
        console.log('CART READ ERROR:', error);
        return [];
    }
};

export default function PurchasePage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        setCartItems(readCartFromStorage());
    }, []);

    const saveCart = (nextCart: CartItem[]) => {
        setCartItems(nextCart);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));
    };

    const removeFromCart = (id: string) => {
        const nextCart = cartItems.filter((item) => item.id !== id);
        saveCart(nextCart);
    };

    const increaseQuantity = (id: string) => {
        const nextCart = cartItems.map((item) =>
            item.id === id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                }
                : item
        );

        saveCart(nextCart);
    };

    const decreaseQuantity = (id: string) => {
        const nextCart = cartItems
            .map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity - 1,
                    }
                    : item
            )
            .filter((item) => item.quantity > 0);

        saveCart(nextCart);
    };

    const isCartEmpty = cartItems.length === 0;

    const totalCurrent = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);
    }, [cartItems]);

    const currency = cartItems[0]?.currency || '₸';

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    {isCartEmpty ? (
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
                            <Link to="/catalog" className={styles.backLink}>
                                <img src={arrowLeftIcon} alt="" />
                                <span>Continue Shopping</span>
                            </Link>

                            <h1 className={styles.title}>Purchase</h1>

                            <div className={styles.cartList}>
                                {cartItems.map((item) => (
                                    <article key={item.id} className={styles.cartCard}>
                                        <div className={styles.imageBox}>
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} />
                                            ) : (
                                                <span>{item.title}</span>
                                            )}
                                        </div>

                                        <div className={styles.cardInfo}>
                                            <h2>{item.title}</h2>
                                            <p>{item.subtitle || 'No description'}</p>
                                        </div>

                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => removeFromCart(item.id)}
                                            type="button"
                                            aria-label="Remove item"
                                        >
                                            <img src={trashIcon} alt="" />
                                        </button>

                                        <div className={styles.quantity}>
                                            <button
                                                type="button"
                                                onClick={() => decreaseQuantity(item.id)}
                                                aria-label="Decrease quantity"
                                            >
                                                <img src={minusIcon} alt="" />
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() => increaseQuantity(item.id)}
                                                aria-label="Increase quantity"
                                            >
                                                <img src={plusIcon} alt="" />
                                            </button>
                                        </div>

                                        <div className={styles.priceBlock}>
                                            <b>{formatPrice(item.price, item.currency)}</b>
                                            <span>
                                                {formatPrice(
                                                    item.price * item.quantity,
                                                    item.currency
                                                )}
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <section className={styles.summary}>
                                <div className={styles.summaryHeader}>
                                    <span>Magnum</span>
                                    <span>{new Date().toLocaleDateString('ru-RU')}</span>
                                    <span>Discount</span>
                                    <span>Total</span>
                                    <b>{formatPrice(totalCurrent, currency)}</b>
                                </div>

                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.summaryRow}>
                                        <span>{item.title}</span>
                                        <span>{item.quantity} pcs</span>
                                        <span>{formatPrice(item.price, item.currency)}</span>
                                        <span>—</span>
                                        <span>
                                            {formatPrice(
                                                item.price * item.quantity,
                                                item.currency
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </section>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}