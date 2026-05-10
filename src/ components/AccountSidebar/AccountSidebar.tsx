import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import { getUserIdFromToken } from '../../auth/getUserIdFromToken';

import UserAvatarView from '../UserAvatarView/UserAvatarView';
import styles from '../../ pages/ DashboardPage/DashboardPage.module.css';

import profileMenuIcon from '../../assets/UserCircleGrey.svg';
import receiptIcon from '../../assets/Package.svg';
import settingsIcon from '../../assets/Gear.svg';
import signOutIcon from '../../assets/SignOut.svg';
import arrowRightIcon from '../../assets/CaretRight.svg';

type AccountPage = 'profile' | 'receipts' | 'settings';

type AccountSidebarProps = {
    activePage: AccountPage;
    orderCount?: number;
    savedCount?: number;
    receiptsCount?: number;
    productsCount?: number;
    mobileContents?: Partial<Record<AccountPage, ReactNode>>;
};

export default function AccountSidebar({
                                           activePage,
                                           orderCount = 12,
                                           savedCount = 2,
                                           receiptsCount,
                                           productsCount,
                                           mobileContents,
                                       }: AccountSidebarProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(false);
    const [openedMobilePages, setOpenedMobilePages] = useState<AccountPage[]>([]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 900px)');

        const handleChange = () => {
            setIsMobile(mediaQuery.matches);
        };

        handleChange();

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

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

    const handleMenuClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        page: AccountPage
    ) => {
        const hasMobileContent = Boolean(mobileContents?.[page]);

        if (!isMobile || !hasMobileContent) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        setOpenedMobilePages((current) => {
            if (current.includes(page)) {
                return current.filter((item) => item !== page);
            }

            return [...current, page];
        });
    };

    const getMenuItemClassName = (page: AccountPage) => {
        const isOpened = openedMobilePages.includes(page);

        return `${styles.menuItem} ${activePage === page ? styles.activeItem : ''} ${
            isOpened ? styles.openedMobileItem : ''
        }`;
    };

    const renderMobileContent = (page: AccountPage) => {
        const content = mobileContents?.[page];

        if (!isMobile || !openedMobilePages.includes(page) || !content) {
            return null;
        }

        return (
            <div className={styles.mobileAccordionContent}>
                {content}
            </div>
        );
    };

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
                    onClick={(event) => handleMenuClick(event, 'profile')}
                    className={getMenuItemClassName('profile')}
                >
                    <img src={profileMenuIcon} alt="" />
                    <span>Profile</span>
                    <img
                        src={arrowRightIcon}
                        alt=""
                        className={styles.arrowIcon}
                    />
                </Link>

                {renderMobileContent('profile')}

                <Link
                    to="/receipts"
                    onClick={(event) => handleMenuClick(event, 'receipts')}
                    className={getMenuItemClassName('receipts')}
                >
                    <img src={receiptIcon} alt="" />
                    <span>My receipts</span>
                    <img
                        src={arrowRightIcon}
                        alt=""
                        className={styles.arrowIcon}
                    />
                </Link>

                {renderMobileContent('receipts')}

                <Link
                    to="/settings"
                    onClick={(event) => handleMenuClick(event, 'settings')}
                    className={getMenuItemClassName('settings')}
                >
                    <img src={settingsIcon} alt="" />
                    <span>Settings</span>
                    <img
                        src={arrowRightIcon}
                        alt=""
                        className={styles.arrowIcon}
                    />
                </Link>

                {renderMobileContent('settings')}

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