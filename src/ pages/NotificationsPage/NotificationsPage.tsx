import { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from '../../ components/MainHeader/MainHeader';
import AccountSidebar from '../../ components/AccountSidebar/AccountSidebar';

import styles from '../ DashboardPage/DashboardPage.module.css';

import arrowLeftIcon from '../../assets/ArrowLeft.svg';
import notificationIcon from '../../assets/BellRinging.svg';
import chartIcon from '../../assets/ChartLine.svg';
import starIcon from '../../assets/Star.svg';
import packageIcon from '../../assets/Package.svg';
import emailIcon from '../../assets/Envelope.svg';

type NotificationItem = {
    id: string;
    title: string;
    description: string;
    icon: string;
    enabled: boolean;
    variant: 'green' | 'yellow' | 'pink' | 'gray';
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        {
            id: 'price-drop',
            title: 'Price Drop Alerts',
            description: 'Get notified when prices drop on your favourites',
            icon: chartIcon,
            enabled: true,
            variant: 'green',
        },
        {
            id: 'promotions',
            title: 'Promotions & Deals',
            description: 'Special offers and exclusive discounts',
            icon: starIcon,
            enabled: true,
            variant: 'yellow',
        },
        {
            id: 'new-products',
            title: 'New Products',
            description: 'Be the first to know about new arrivals',
            icon: packageIcon,
            enabled: true,
            variant: 'pink',
        },
        {
            id: 'newsletter',
            title: 'Newsletter',
            description: 'Weekly tips on saving money on groceries',
            icon: emailIcon,
            enabled: false,
            variant: 'gray',
        },
    ]);

    const toggleNotification = (id: string) => {
        setNotifications((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        enabled: !item.enabled,
                    }
                    : item
            )
        );
    };

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <Link to="/" className={styles.backLink}>
                        <img src={arrowLeftIcon} alt="" />
                        <span>Home</span>
                    </Link>

                    <section className={styles.hero}>
                        <div className={styles.heroIcon}>
                            <img src={notificationIcon} alt="" />
                        </div>

                        <div>
                            <h1>Notifications</h1>
                            <p>Manage your notification preferences</p>
                        </div>
                    </section>

                    <div className={styles.layout}>
                        <AccountSidebar activePage="notifications" />

                        <section className={styles.preferencesCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h2>Notification Preferences</h2>
                                    <p>Choose what updates you want to receive</p>
                                </div>
                            </div>

                            <div className={styles.preferenceList}>
                                {notifications.map((item) => (
                                    <div
                                        key={item.id}
                                        className={styles.preferenceItem}
                                    >
                                        <div
                                            className={`${styles.preferenceIcon} ${
                                                styles[item.variant]
                                            }`}
                                        >
                                            <img src={item.icon} alt="" />
                                        </div>

                                        <div className={styles.preferenceText}>
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                        </div>

                                        <button
                                            type="button"
                                            className={`${styles.toggle} ${
                                                item.enabled
                                                    ? styles.toggleActive
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                toggleNotification(item.id)
                                            }
                                            aria-label={`Toggle ${item.title}`}
                                        >
                                            <span />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}