import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.brandCol}>
                        <Link to="/" className={styles.logo} aria-label="TrendPrice">
                            <span className={styles.logoAccent}>Trend</span>
                            <span className={styles.logoDark}>Price</span>
                        </Link>

                        <p className={styles.description}>
                            Shop smart. Save more. Always the best price. Never overpay again.
                        </p>
                    </div>

                    <div className={styles.linksCol}>
                        <h3 className={styles.title}>Catalog</h3>
                        <a href="/" className={styles.link}>Vegetables and fruits</a>
                        <a href="/" className={styles.link}>Milk products</a>
                        <a href="/" className={styles.link}>Sausage and delicacies</a>
                        <a href="/" className={styles.link}>Bread</a>
                        <a href="/" className={styles.link}>Meat</a>
                        <a href="/" className={styles.link}>Seafood</a>
                        <a href="/" className={styles.link}>Water and juice</a>
                    </div>

                    <div className={styles.linksCol}>
                        <h3 className={styles.title}>For users</h3>
                        <a href="/" className={styles.link}>Delivery and payment</a>
                        <a href="/" className={styles.link}>Discounts</a>
                        <a href="/" className={styles.link}>FAQ</a>
                    </div>

                    <div className={styles.linksCol}>
                        <h3 className={styles.title}>Contacts</h3>
                        <a href="tel:87771234567" className={styles.link}>8 777 123 45 67</a>
                        <a href="mailto:info@trendprice.kz" className={styles.link}>info@trendprice.kz</a>
                        <span className={styles.link}>Almaty, Kazakhstan</span>
                        <span className={styles.link}>Mon–Sun 8:00–23:00</span>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <span>©2026 TrendPrice. All rights reserved.</span>

                    <div className={styles.bottomLinks}>
                        <a href="/" className={styles.bottomLink}>Privacy & Policy</a>
                        <a href="/" className={styles.bottomLink}>Terms & Condition</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}