import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import { getUserIdFromToken } from '../../auth/getUserIdFromToken';

import UserAvatarView from '../UserAvatarView/UserAvatarView';
import styles from '../../ pages/ DashboardPage/DashboardPage.module.css';

import profileMenuIcon from '../../assets/UserCircleGrey.svg';
import receiptIcon from '../../assets/Package.svg';
import notificationIcon from '../../assets/BellRinging.svg';
import settingsIcon from '../../assets/Gear.svg';
import signOutIcon from '../../assets/SignOut.svg';
import arrowRightIcon from '../../assets/CaretRight.svg';

type AccountSidebarProps = {
    activePage: 'profile' | 'receipts' | 'notifications' | 'settings';
    orderCount?: number;
    savedCount?: number;
    receiptsCount?: number;
    productsCount?: number;
};

export default function AccountSidebar({
                                           activePage,
                                           orderCount = 12,
                                           savedCount = 2,
                                           receiptsCount,
                                           productsCount,
                                       }: AccountSidebarProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const firstName = user?.firstName ?? user?.username ?? '';

    const fullName =
        `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
        user?.username ||
        'User';

    const role = user?.roles?.length ? user.roles.join(', ') : 'Customer';

    const userId =
        user?.id ??
        user?.userId ??
        user?.uuid ??
        getUserIdFromToken();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const firstStatValue = receiptsCount ?? orderCount;
    const firstStatLabel = receiptsCount !== undefined ? 'Receipts' : 'Order';

    const secondStatValue = productsCount ?? savedCount;
    const secondStatLabel = productsCount !== undefined ? 'Products' : 'Saved';

    return (
        <aside className={styles.sidebar}>
            <div className={styles.profileTop}>
                <UserAvatarView userId={userId} firstName={firstName} />

                <div>
                    <h2>{fullName}</h2>
                    <p>{role}</p>
                </div>
            </div>

            <div className={styles.stats}>
                <div>
                    <b>{firstStatValue}</b>
                    <span>{firstStatLabel}</span>
                </div>

                <div>
                    <b>{secondStatValue}</b>
                    <span>{secondStatLabel}</span>
                </div>
            </div>

            <nav className={styles.menu}>
                <Link
                    to="/dashboard"
                    className={`${styles.menuItem} ${
                        activePage === 'profile' ? styles.activeItem : ''
                    }`}
                >
                    <img src={profileMenuIcon} alt="" />
                    <span>Profile</span>
                    <img
                        src={arrowRightIcon}
                        alt=""
                        className={styles.arrowIcon}
                    />
                </Link>

                <Link
                    to="/receipts"
                    className={`${styles.menuItem} ${
                        activePage === 'receipts' ? styles.activeItem : ''
                    }`}
                >
                    <img src={receiptIcon} alt="" />
                    <span>My receipts</span>
                    <img
                        src={arrowRightIcon}
                        alt=""
                        className={styles.arrowIcon}
                    />
                </Link>

                <Link
                    to="/notifications"
                    className={`${styles.menuItem} ${
                        activePage === 'notifications' ? styles.activeItem : ''
                    }`}
                >
                    <img src={notificationIcon} alt="" />
                    <span>Notifications</span>
                    <img
                        src={arrowRightIcon}
                        alt=""
                        className={styles.arrowIcon}
                    />
                </Link>

                <Link
                    to="/settings"
                    className={`${styles.menuItem} ${
                        activePage === 'settings' ? styles.activeItem : ''
                    }`}
                >
                    <img src={settingsIcon} alt="" />
                    <span>Settings</span>
                    <img
                        src={arrowRightIcon}
                        alt=""
                        className={styles.arrowIcon}
                    />
                </Link>

                <button
                    type="button"
                    onClick={handleLogout}
                    className={`${styles.menuItem} ${styles.signOutItem}`}
                >
                    <img src={signOutIcon} alt="" />
                    <span>Sign out</span>
                    <img
                        src={arrowRightIcon}
                        alt=""
                        className={styles.arrowIcon}
                    />
                </button>
            </nav>
        </aside>
    );
}