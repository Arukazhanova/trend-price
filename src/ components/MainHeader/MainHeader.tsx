import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './MainHeader.module.css';

import favouritesIcon from '../../assets/heart.svg';
import compareIcon from '../../assets/compare-icon 1.svg';
import purchaseIcon from '../../assets/ShoppingCartSimple.svg';
import userCircleIcon from '../../assets/UserCircle.svg';

import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../cart/useCart';

const getUserInitials = (user: ReturnType<typeof useAuth>['user']) => {
    if (!user) {
        return '';
    }

    const firstName = user.firstName?.trim();
    const lastName = user.lastName?.trim();
    const username = user.username?.trim();
    const email = user.email?.trim();

    if (firstName || lastName) {
        return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
    }

    if (username) {
        const parts = username.split(/[\s._-]+/).filter(Boolean);

        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }

        return username.slice(0, 2).toUpperCase();
    }

    if (email) {
        return email.slice(0, 2).toUpperCase();
    }

    return 'U';
};

const isAdminUser = (roles: string[] = []) => {
    return roles.some((role) => {
        const normalizedRole = role.toUpperCase();

        return normalizedRole === 'ADMIN' || normalizedRole === 'ROLE_ADMIN';
    });
};

export default function MainHeader() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { totalQuantity } = useCart();

    const userInitials = useMemo(() => getUserInitials(user), [user]);
    const hasAdminAccess = useMemo(
        () => isAdminUser(user?.roles ?? []),
        [user]
    );

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const query = searchValue.trim();

        closeMobileMenu();

        if (!query) {
            navigate('/catalog');
            return;
        }

        navigate(`/catalog?search=${encodeURIComponent(query)}`);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link
                    to="/"
                    className={styles.logo}
                    aria-label="TrendPrice"
                    onClick={closeMobileMenu}
                >
                    <span className={styles.logoAccent}>Trend</span>
                    <span className={styles.logoDark}>Price</span>
                </Link>

                <button
                    type="button"
                    className={`${styles.burgerButton} ${
                        isMobileMenuOpen ? styles.burgerButtonActive : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    aria-label="Open menu"
                    aria-expanded={isMobileMenuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div
                    className={`${styles.menuContent} ${
                        isMobileMenuOpen ? styles.menuContentOpen : ''
                    }`}
                >
                    <Link
                        to="/catalog"
                        className={styles.catalogButton}
                        onClick={closeMobileMenu}
                    >
                        Catalog
                    </Link>

                    <form
                        className={styles.searchBlock}
                        onSubmit={handleSearch}
                    >
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
                                onChange={(event) =>
                                    setSearchValue(event.target.value)
                                }
                            />
                        </div>

                        <button type="submit" className={styles.searchButton}>
                            Search
                        </button>
                    </form>

                    {isAuthenticated && hasAdminAccess && (
                        <Link
                            to="/admin"
                            className={styles.adminAvatarButton}
                            aria-label="Go to admin panel"
                            title="Admin panel"
                            onClick={closeMobileMenu}
                        >
                            <span className={styles.adminAvatar}>
                                {userInitials}
                            </span>

                            <span className={styles.adminAvatarText}>
                                Admin panel
                            </span>
                        </Link>
                    )}

                    <nav className={styles.actions} aria-label="Header actions">
                        <Link
                            to="/favourites"
                            className={styles.actionItem}
                            onClick={closeMobileMenu}
                        >
                            <img
                                src={favouritesIcon}
                                alt=""
                                className={styles.actionIcon}
                                aria-hidden="true"
                            />
                            <span>Favourites</span>
                        </Link>

                        <Link
                            to="/products/1/analytics"
                            className={styles.actionItem}
                            onClick={closeMobileMenu}
                        >
                            <img
                                src={compareIcon}
                                alt=""
                                className={styles.actionIcon}
                                aria-hidden="true"
                            />
                            <span>Compare</span>
                        </Link>

                        <Link
                            to="/purchase"
                            className={styles.actionItem}
                            onClick={closeMobileMenu}
                        >
                            <span className={styles.cartIconWrap}>
                                <img
                                    src={purchaseIcon}
                                    alt=""
                                    className={styles.actionIcon}
                                    aria-hidden="true"
                                />

                                {totalQuantity > 0 && (
                                    <span className={styles.cartBadge}>
                                        {totalQuantity > 99
                                            ? '99+'
                                            : totalQuantity}
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
                            onClick={closeMobileMenu}
                        >
                            <img
                                src={userCircleIcon}
                                alt="Profile"
                                className={styles.profileIcon}
                            />
                            <span className={styles.profileText}>Profile</span>
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className={styles.loginButton}
                            onClick={closeMobileMenu}
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}