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
                            TrendPrice helps you compare grocery prices across stores,
                            track price changes and find the best deals before you shop.
                        </p>
                    </div>

                    <div className={styles.contactCard}>
                        <h3 className={styles.title}>Contact us</h3>

                        <a
                            href="mailto:trendprice.kz@gmail.com"
                            className={styles.link}
                        >
                            trendprice.kz@gmail.com
                        </a>

                        <span className={styles.workTime}>
        We work 24/7
    </span>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <span>©2026 TrendPrice. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}