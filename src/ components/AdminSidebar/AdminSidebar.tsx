import { NavLink, useNavigate } from 'react-router-dom';
import styles from './AdminSidebar.module.css';
import dashboardIcon from '../../assets/SquaresFour.svg'; // Dashboard icon
import storesIcon from '../../assets/Storefront.svg'; // Stores icon
import productsIcon from '../../assets/Package.svg'; // Products icon
import priceIcon from '../../assets/CurrencyDollar.svg'; // Price Listings icon
import categoriesIcon from '../../assets/Categories.svg'; // Categories icon
import promotionsIcon from '../../assets/Tag.svg'; // Promotions icon
import usersIcon from '../../assets/Users-green.svg'; // Users icon
import settingsIcon from '../../assets/Gear.svg'; // Settings icon
import logoutIcon from '../../assets/SignOut-Red.svg'; // Logout icon
import menuIcon from '../../assets/List.svg'; // Navbar toggle icon

const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: dashboardIcon },
    { label: 'Stores', path: '/admin/stores', icon: storesIcon },
    { label: 'Products', path: '/admin/products', icon: productsIcon },
    { label: 'Price Listings', path: '/admin/price-listings', icon: priceIcon },
    { label: 'Categories', path: '/admin/categories', icon: categoriesIcon },
    { label: 'Promotions', path: '/admin/promotions', icon: promotionsIcon },
    { label: 'Users', path: '/admin/users', icon: usersIcon },
    { label: 'Setting', path: '/admin/settings', icon: settingsIcon },
];

export default function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.top}>
                <h2 className={styles.logo}>
                    <span>Trend</span>Price
                </h2>

                <button type="button" className={styles.menuButton}>
                    <img src={menuIcon} alt="" />
                </button>
            </div>

            <nav className={styles.menu}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) =>
                            `${styles.menuItem} ${isActive ? styles.active : ''}`
                        }
                    >
                        <img src={item.icon} alt="" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}

                <button type="button" className={styles.logout} onClick={handleLogout}>
                    <img src={logoutIcon} alt="" />
                    <span>Logout</span>
                </button>
            </nav>
        </aside>
    );
}