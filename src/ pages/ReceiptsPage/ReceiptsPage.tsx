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
import filterIcon from "../../assets/Funnel.svg";

const receipts = [
    { date: "10.04.26", quantity: 4, sum: 2590 },
    { date: "25.03.26", quantity: 2, sum: 840 },
    { date: "9.02.26", quantity: 6, sum: 3240 },
];

export default function ReceiptsPage() {
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

                                <Link to="/receipts" className={`${styles.menuItem} ${styles.activeItem}`}>
                                    <img src={receiptIcon} alt="" />
                                    <span>My receipts</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </Link>

                                <Link to="/notifications" className={styles.menuItem}>
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

                        <section className={styles.receiptsCard}>
                            <div className={styles.receiptsHeader}>
                                <div>
                                    <h2>All receipts</h2>
                                    <p>Keep track of your receipts in one place</p>
                                </div>

                                <button type="button" className={styles.filterButton}>
                                    <img src={filterIcon} alt="" />
                                    <span>Filter</span>
                                </button>
                            </div>

                            <div className={styles.receiptList}>
                                {receipts.map((item) => (
                                    <div key={item.date} className={styles.receiptRow}>
                                        <span>Date:{item.date}</span>
                                        <span>Quantity: {item.quantity}</span>
                                        <span>Sum:{item.sum}</span>
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