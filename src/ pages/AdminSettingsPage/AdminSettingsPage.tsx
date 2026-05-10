import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import styles from './AdminSettingsPage.module.css';

export default function AdminSettingsPage() {
    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.pageContent}>
                    <div className={styles.titleBlock}>
                        <h1>Settings</h1>
                        <p>Platform configuration overview</p>
                    </div>

                    <div className={styles.card}>
                        <h2>General Settings</h2>
                        <p className={styles.cardSubtitle}>
                            These settings are shown from frontend because backend settings API is not provided.
                        </p>

                        <div className={styles.formGrid}>
                            <label>
                                <span>Site name</span>
                                <input value="TrendPrice" readOnly />
                            </label>

                            <label>
                                <span>Environment</span>
                                <input value="Development" readOnly />
                            </label>
                        </div>

                        <label className={styles.fullField}>
                            <span>Site Description</span>
                            <textarea
                                value="TrendPrice helps users compare product prices across stores and find better deals."
                                readOnly
                            />
                        </label>

                        <label className={styles.halfField}>
                            <span>Support Email</span>
                            <input value="trendprice.kz@gmail.com" readOnly />
                        </label>
                    </div>

                    <div className={styles.card}>
                        <h2>Available Backend Modules</h2>
                        <p className={styles.cardSubtitle}>
                            These modules are connected to real API endpoints.
                        </p>

                        <div className={styles.settingRow}>
                            <div>
                                <h4>Authentication</h4>
                                <p>Login, register, logout, refresh token, email verification</p>
                            </div>

                            <label className={styles.switch}>
                                <input type="checkbox" checked readOnly />
                                <span />
                            </label>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <h4>Admin Users</h4>
                                <p>Users list, block, unblock, role changing</p>
                            </div>

                            <label className={styles.switch}>
                                <input type="checkbox" checked readOnly />
                                <span />
                            </label>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <h4>Products and Categories</h4>
                                <p>Products, brands, categories, product search</p>
                            </div>

                            <label className={styles.switch}>
                                <input type="checkbox" checked readOnly />
                                <span />
                            </label>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <h4>Prices</h4>
                                <p>Price listings, best price, price history by product</p>
                            </div>

                            <label className={styles.switch}>
                                <input type="checkbox" checked readOnly />
                                <span />
                            </label>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <h4>Promotions</h4>
                                <p>Disabled because promotions API endpoint is not provided</p>
                            </div>

                            <label className={styles.switch}>
                                <input type="checkbox" readOnly />
                                <span />
                            </label>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2>Password Policy</h2>
                        <p className={styles.cardSubtitle}>
                            Based on auth API validation rules.
                        </p>

                        <div className={styles.formGrid}>
                            <label>
                                <span>Register password minimum length</span>
                                <input value="8 characters" readOnly />
                            </label>

                            <label>
                                <span>Change password minimum length</span>
                                <input value="6 characters" readOnly />
                            </label>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <h4>Require uppercase, lowercase and digit</h4>
                                <p>Required for registration and password reset</p>
                            </div>

                            <label className={styles.switch}>
                                <input type="checkbox" checked readOnly />
                                <span />
                            </label>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}