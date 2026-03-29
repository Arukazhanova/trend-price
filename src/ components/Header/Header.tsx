import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo} aria-label="TrendPrice">
                    <span className={styles.logoAccent}>Trend</span>
                    <span className={styles.logoDark}>Price</span>
                </Link>
            </div>
        </header>
    );
}