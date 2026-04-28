import { Link } from "react-router-dom";
import MainHeader from "../../ components/MainHeader/MainHeader";
import Footer from "../../ components/Footer/Footer";
import boxIcon from "../../assets/Package.svg";
import arrowLeftIcon from "../../assets/ArrowLeftWhite.svg";
import styles from "./PurchasePage.module.css";
import { useCart } from "../../cart/useCart";

export default function PurchasePage() {
    const {
        cartItems,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();

    const isCartEmpty = cartItems.length === 0;

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

                            <Link to="/" className={styles.button}>
                                <img src={arrowLeftIcon} alt="" />
                                <span>Continue Shopping</span>
                            </Link>
                        </section>
                    ) : (
                        <>
                            <Link to="/" className={styles.backLink}>
                                ← Continue Shopping
                            </Link>

                            <h1 className={styles.title}>Purchase</h1>

                            <div className={styles.cartList}>
                                {cartItems.map((item) => (
                                    <article key={item.id} className={styles.cartCard}>
                                        <div className={styles.imageBox}>
                                            <span>{item.title}</span>
                                        </div>

                                        <div className={styles.cardInfo}>
                                            <h2>{item.title}</h2>
                                            <p>{item.subtitle}</p>

                                            <div className={styles.quantity}>
                                                <button onClick={() => decreaseQuantity(item.id)}>
                                                    −
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button onClick={() => increaseQuantity(item.id)}>
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            🗑
                                        </button>

                                        <div className={styles.priceBlock}>
                                            <b>{item.price}</b>

                                            {item.oldPrice && <span>{item.oldPrice}</span>}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}