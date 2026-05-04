import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import styles from './AdminProfilePage.module.css';

export default function AdminProfilePage() {
    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.pageContent}>
                    <div className={styles.titleBlock}>
                        <h1>My Profile</h1>
                        <p>Manage your account settings and preferences</p>
                    </div>

                    <div className={styles.profileHero}>
                        <div className={styles.bigAvatar}>AU</div>

                        <div>
                            <div className={styles.nameRow}>
                                <h2>Aruzhan Ushkempirrova</h2>
                                <span>admin</span>
                            </div>
                            <p>ushkempirrova@trendprice.com</p>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h2>Personal Information</h2>
                            <p className={styles.subtitle}>Update your personal details here</p>

                            <div className={styles.formGrid}>
                                <label>
                                    <span>First name</span>
                                    <input defaultValue="Aruzhan" />
                                </label>

                                <label>
                                    <span>Last Name</span>
                                    <input defaultValue="Ushkempirrova" />
                                </label>
                            </div>

                            <label className={styles.fullField}>
                                <span>Email Address</span>
                                <div className={styles.verifiedInput}>
                                    <input defaultValue="ushkempirrova@trendprice.com" />
                                    <b>✓ Verified</b>
                                </div>
                            </label>

                            <label className={styles.fullField}>
                                <span>Phone Number</span>
                                <input defaultValue="+77771234567" />
                            </label>
                        </div>

                        <aside className={styles.sideCards}>
                            <div className={styles.card}>
                                <h2>Account Stats</h2>

                                <div className={styles.statRow}>
                                    <span>Products Added</span>
                                    <b>1,247</b>
                                </div>

                                <div className={styles.statRow}>
                                    <span>Stores Managed</span>
                                    <b>8</b>
                                </div>
                            </div>

                            <div className={styles.deleteCard}>
                                <h2>Delete Account</h2>
                                <p>Permanently delete your account and all data</p>
                                <button type="button">Delete Account</button>
                            </div>
                        </aside>
                    </div>

                    <div className={styles.card}>
                        <h2>Security</h2>
                        <p className={styles.subtitle}>Manage your password and security settings</p>

                        <label className={styles.fullField}>
                            <span>Current Password</span>
                            <input type="password" placeholder="Enter current password" />
                        </label>

                        <label className={styles.fullField}>
                            <span>New Password</span>
                            <input type="password" placeholder="Enter new password" />
                        </label>

                        <label className={styles.fullField}>
                            <span>Confirm New Password</span>
                            <input type="password" placeholder="Confirm new password" />
                        </label>

                        <button type="button" className={styles.updateButton}>
                            Update Password
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}