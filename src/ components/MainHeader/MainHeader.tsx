import { Link } from 'react-router-dom';
import styles from './MainHeader.module.css';
import favouritesIcon from '../../assets/Heart.svg';
import compareIcon from '../../assets/compare-icon 1.svg';
import purchaseIcon from '../../assets/ShoppingCartSimple.svg';

export default function MainHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo} aria-label="TrendPrice">
                    <span className={styles.logoAccent}>Trend</span>
                    <span className={styles.logoDark}>Price</span>
                </Link>

                <button type="button" className={styles.catalogButton}>
                    Catalog
                </button>

                <div className={styles.searchBlock}>
                    <div className={styles.searchInputWrap}>
                        <svg
                            className={styles.searchIcon}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <circle
                                cx="9"
                                cy="9"
                                r="5.75"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M13.5 13.5L16.75 16.75"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>

                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="I want to find"
                        />
                    </div>

                    <button type="button" className={styles.searchButton}>
                        Search
                    </button>
                </div>

                <nav className={styles.actions} aria-label="Header actions">
                    <button type="button" className={styles.actionItem}>
                        <img
                            src={favouritesIcon}
                            alt=""
                            className={styles.actionIcon}
                            aria-hidden="true"
                        />
                        <span>Favourites</span>
                    </button>

                    <button type="button" className={styles.actionItem}>
                        <img
                            src={compareIcon}
                            alt=""
                            className={styles.actionIcon}
                            aria-hidden="true"
                        />
                        <span>Compare</span>
                    </button>

                    <button type="button" className={styles.actionItem}>
                        <img
                            src={purchaseIcon}
                            alt=""
                            className={styles.actionIcon}
                            aria-hidden="true"
                        />
                        <span>Purchase</span>
                    </button>
                </nav>

                <Link to="/login" className={styles.loginButton}>
                    Log In
                </Link>
            </div>
        </header>
    );
}