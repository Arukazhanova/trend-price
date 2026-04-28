import { Link } from "react-router-dom";
import MainHeader from "../../ components/MainHeader/MainHeader";
import Footer from "../../ components/Footer/Footer";
import boxIcon from "../../assets/Package.svg";
import arrowLeftIcon from "../../assets/ArrowLeftWhite.svg";
import styles from "./PurchasePage.module.css";
import { useCart } from "../../cart/useCart";
import minusIcon from "../../assets/Minus.svg";
import plusIcon from "../../assets/Plus.svg";
import trashIcon from "../../assets/Trash.svg";

function getNumberFromPrice(price: string) {
    return Number(price.replace(/[^\d]/g, ""));
}

export default function PurchasePage() {
    const {
        cartItems,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();

    const isCartEmpty = cartItems.length === 0;

    const totalCurrent = cartItems.reduce((sum, item) => {
        return sum + getNumberFromPrice(item.price) * item.quantity;
    }, 0);

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
                            <img src={arrowLeftIcon} alt="" />
                            <span>Continue Shopping</span>
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
                                        </div>

                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => removeFromCart(item.id)}
                                            type="button"
                                        >
                                            <img src={trashIcon} alt="" />
                                        </button>

                                        <div className={styles.quantity}>
                                            <button type="button" onClick={() => decreaseQuantity(item.id)}>
                                                <img src={minusIcon} alt="" />
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button type="button" onClick={() => increaseQuantity(item.id)}>
                                                <img src={plusIcon} alt="" />
                                            </button>
                                        </div>

                                        <div className={styles.priceBlock}>
                                            <b>{item.price}</b>
                                            {item.oldPrice && <span>{item.oldPrice}</span>}
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <section className={styles.summary}>
                                <div className={styles.summaryHeader}>
                                    <span>Magnum</span>
                                    <span>27.02.26</span>
                                    <span>Discount</span>
                                    <span>Total</span>
                                    <b>{totalCurrent}₸</b>
                                </div>

                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.summaryRow}>
                                        <span>{item.title}</span>
                                        <span>{item.subtitle.split(" ")[0]}</span>
                                        <span>{item.price}</span>
                                        <span></span>
                                        <span>{item.oldPrice || item.price}</span>
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