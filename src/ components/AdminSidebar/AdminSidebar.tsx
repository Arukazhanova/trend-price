import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import styles from './AdminSidebar.module.css';

import dashboardIcon from '../../assets/SquaresFourGrey.svg';
import storesIcon from '../../assets/StorefrontGrey.svg';
import productsIcon from '../../assets/Package.svg';
import priceIcon from '../../assets/CurrencyDollar.svg';
import categoriesIcon from '../../assets/Categories.svg';
import usersIcon from '../../assets/UsersGrey.svg';
import settingsIcon from '../../assets/Gear.svg';
import logoutIcon from '../../assets/SignOut-Red.svg';
import menuIcon from '../../assets/List.svg';

const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: dashboardIcon },
    { label: 'Stores', path: '/admin/stores', icon: storesIcon },
    { label: 'Products', path: '/admin/products', icon: productsIcon },
    { label: 'Price Listings', path: '/admin/price-listings', icon: priceIcon },
    { label: 'Categories', path: '/admin/categories', icon: categoriesIcon },
    { label: 'Users', path: '/admin/users', icon: usersIcon },
    { label: 'Setting', path: '/admin/settings', icon: settingsIcon },
];

export default function AdminSidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth <= 768;
    });

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside
            className={`${styles.sidebar} ${
                isCollapsed ? styles.collapsed : styles.expanded
            }`}
        >
            <div className={styles.top}>
                <h2 className={styles.logo}>
                    <span>Trend</span>Price
                </h2>

                <button
                    type="button"
                    className={styles.menuButton}
                    onClick={() => setIsCollapsed((prev) => !prev)}
                    aria-label={isCollapsed ? 'Open admin menu' : 'Close admin menu'}
                    aria-expanded={!isCollapsed}
                >
                    <img src={menuIcon} alt="" />
                </button>
            </div>

            <nav className={styles.menu}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        title={isCollapsed ? item.label : undefined}
                        className={({ isActive }) =>
                            `${styles.menuItem} ${isActive ? styles.active : ''}`
                        }
                    >
                        <img src={item.icon} alt="" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}

                <button
                    type="button"
                    className={styles.logout}
                    onClick={handleLogout}
                    title={isCollapsed ? 'Log out' : undefined}
                >
                    <img src={logoutIcon} alt="" />
                    <span>Log out</span>
                </button>
            </nav>
        </aside>
    );
}