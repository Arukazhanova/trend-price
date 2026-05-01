import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import MainHeader from "../../ components/MainHeader/MainHeader";
import styles from "../ DashboardPage/DashboardPage.module.css";

import profileIcon from "../../assets/User.svg";
import arrowLeftIcon from "../../assets/ArrowLeft.svg";
import profileMenuIcon from "../../assets/UserCircleGrey.svg";
import receiptIcon from "../../assets/Package.svg";
import notificationIcon from "../../assets/BellRinging.svg";
import settingsIcon from "../../assets/Gear.svg";
import signOutIcon from "../../assets/SignOut.svg";
import arrowRightIcon from "../../assets/CaretRight.svg";
import priceDropIcon from "../../assets/ChartLineDown.svg";
import promotionIcon from "../../assets/Star-Line.svg";
import newProductIcon from "../../assets/PackagePurple.svg";
import newsletterIcon from "../../assets/Envelope.svg";

export default function NotificationsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const firstName = user?.firstName ?? user?.username ?? "";
    const fullName =
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
        user?.username ||
        "User";

    const role = user?.roles?.length ? user.roles.join(", ") : "Customer";

    const handleLogout = () => {
        logout();
        navigate("/login");
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
                            <img src={profileIcon} alt="" />
                        </div>

                        <div>
                            <h1>My Account</h1>
                            <p>Manage your profile and preferences</p>
                        </div>
                    </section>

                    <div className={styles.layout}>
                        <aside className={styles.sidebar}>
                            <div className={styles.profileTop}>
                                <div className={styles.avatar}>
                                    {firstName?.[0]?.toUpperCase() || "U"}
                                </div>

                                <div>
                                    <h2>{fullName}</h2>
                                    <p>{role}</p>
                                </div>
                            </div>

                            <div className={styles.stats}>
                                <div>
                                    <b>12</b>
                                    <span>Order</span>
                                </div>

                                <div>
                                    <b>2</b>
                                    <span>Saved</span>
                                </div>
                            </div>

                            <nav className={styles.menu}>
                                <Link to="/dashboard" className={styles.menuItem}>
                                    <img src={profileMenuIcon} alt="" />
                                    <span>Profile</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </Link>

                                <Link to="/receipts" className={styles.menuItem}>
                                    <img src={receiptIcon} alt="" />
                                    <span>My receipts</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </Link>

                                <Link
                                    to="/notifications"
                                    className={`${styles.menuItem} ${styles.activeItem}`}
                                >
                                    <img src={notificationIcon} alt="" />
                                    <span>Notifications</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </Link>

                                <Link to="/settings" className={styles.menuItem}>
                                    <img src={settingsIcon} alt="" />
                                    <span>Settings</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className={`${styles.menuItem} ${styles.signOutItem}`}
                                >
                                    <img src={signOutIcon} alt="" />
                                    <span>Sign out</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </button>
                            </nav>
                        </aside>

                        <section className={styles.notificationsCard}>
                            <div className={styles.notificationsHeader}>
                                <h2>Notification Preferences</h2>
                                <p>Choose what updates you want to receive</p>
                            </div>

                            <div className={styles.notificationList}>
                                <div className={styles.notificationRow}>
                                    <div className={`${styles.notificationIcon} ${styles.greenIcon}`}>
                                        <img src={priceDropIcon} alt="" />
                                    </div>

                                    <div className={styles.notificationText}>
                                        <b>Price Drop Alerts</b>
                                        <p>Get notified when prices drop on your favourites</p>
                                    </div>

                                    <label className={styles.switch}>
                                        <input type="checkbox" defaultChecked />
                                        <span></span>
                                    </label>
                                </div>

                                <div className={styles.notificationRow}>
                                    <div className={`${styles.notificationIcon} ${styles.yellowIcon}`}>
                                        <img src={promotionIcon} alt="" />
                                    </div>

                                    <div className={styles.notificationText}>
                                        <b>Promotions & Deals</b>
                                        <p>Special offers and exclusive discounts</p>
                                    </div>

                                    <label className={styles.switch}>
                                        <input type="checkbox" defaultChecked />
                                        <span></span>
                                    </label>
                                </div>

                                <div className={styles.notificationRow}>
                                    <div className={`${styles.notificationIcon} ${styles.pinkIcon}`}>
                                        <img src={newProductIcon} alt="" />
                                    </div>

                                    <div className={styles.notificationText}>
                                        <b>New Products</b>
                                        <p>Be the first to know about new arrivals</p>
                                    </div>

                                    <label className={styles.switch}>
                                        <input type="checkbox" defaultChecked />
                                        <span></span>
                                    </label>
                                </div>

                                <div className={styles.notificationRow}>
                                    <div className={`${styles.notificationIcon} ${styles.grayIcon}`}>
                                        <img src={newsletterIcon} alt="" />
                                    </div>

                                    <div className={styles.notificationText}>
                                        <b>Newsletter</b>
                                        <p>Weekly tips on saving money on groceries</p>
                                    </div>

                                    <label className={styles.switch}>
                                        <input type="checkbox" />
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}