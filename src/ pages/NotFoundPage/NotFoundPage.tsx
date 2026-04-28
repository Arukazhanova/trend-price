import MainHeader from "../../ components/MainHeader/MainHeader.tsx";
import Footer from "../../ components/Footer/Footer";
import styles from "./NotFoundPage.module.css";
import receiptBg from "../../assets/Subtract.svg";
export default function NotFoundPage() {
    const currentDate = new Date().toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <>
            <MainHeader />

            <main className={styles.notFound}>
                <section
                    className={styles.receipt}
                    style={{ backgroundImage: `url(${receiptBg})` }}
                >
                    <div className={styles.decor}>
                        <div className={styles.leftLines}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <h1>404</h1>

                        <div className={styles.rightLines}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <h2>This page is out of stock.</h2>
                    <p>Looks like this page went on sale... permanently.</p>

                    <div className={styles.info}>
                        <div>
                            <b>Date:</b>
                            <span>{currentDate}</span>
                        </div>

                        <div>
                            <b>Cashier:</b>
                            <span className={styles.brand}>
                                <span>Trend</span>Price
                            </span>
                        </div>
                    </div>

                    <a href="/" className={styles.homeButton}>
                        ← Back to home
                    </a>
                </section>
            </main>

            <Footer />
        </>
    );
}