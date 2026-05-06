import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './MainHeader.module.css';

import favouritesIcon from '../../assets/Heart.svg';
import compareIcon from '../../assets/compare-icon 1.svg';
import purchaseIcon from '../../assets/ShoppingCartSimple.svg';
import userCircleIcon from '../../assets/UserCircle.svg';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../cart/useCart';
export default function MainHeader() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const { totalQuantity } = useCart();
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const query = searchValue.trim();

        if (!query) {
            navigate('/catalog');
            return;
        }

        navigate(`/catalog?search=${encodeURIComponent(query)}`);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo} aria-label="TrendPrice">
                    <span className={styles.logoAccent}>Trend</span>
                    <span className={styles.logoDark}>Price</span>
                </Link>

                <Link to="/catalog" className={styles.catalogButton}>
                    Catalog
                </Link>

                <form className={styles.searchBlock} onSubmit={handleSearch}>
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
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                        />
                    </div>

                    <button type="submit" className={styles.searchButton}>
                        Search
                    </button>
                </form>

                <nav className={styles.actions} aria-label="Header actions">
                    <Link to="/favourites" className={styles.actionItem}>
                        <img
                            src={favouritesIcon}
                            alt=""
                            className={styles.actionIcon}
                            aria-hidden="true"
                        />
                        <span>Favourites</span>
                    </Link>

                    <Link to="/products/1/analytics" className={styles.actionItem}>
                        <img
                            src={compareIcon}
                            alt=""
                            className={styles.actionIcon}
                            aria-hidden="true"
                        />
                        <span>Compare</span>
                    </Link>

                    <Link to="/purchase" className={styles.actionItem}>
    <span className={styles.cartIconWrap}>
        <img
            src={purchaseIcon}
            alt=""
            className={styles.actionIcon}
            aria-hidden="true"
        />

        {totalQuantity > 0 && (
            <span className={styles.cartBadge}>
                {totalQuantity > 99 ? '99+' : totalQuantity}
            </span>
        )}
    </span>

                        <span>Purchase</span>
                    </Link>
                </nav>

                {isAuthenticated ? (
                    <Link
                        to="/dashboard"
                        className={styles.profileButton}
                        aria-label="Profile"
                    >
                        <img
                            src={userCircleIcon}
                            alt="Profile"
                            className={styles.profileIcon}
                        />
                    </Link>
                ) : (
                    <Link to="/login" className={styles.loginButton}>
                        Log In
                    </Link>
                )}
            </div>
        </header>
    );
}