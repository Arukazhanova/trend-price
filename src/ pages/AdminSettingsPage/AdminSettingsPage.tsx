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
                        <p>Configure platform settings and preferences</p>
                    </div>

                    <div className={styles.card}>
                        <h2>General Settings</h2>
                        <p className={styles.cardSubtitle}>Basic platform configuration</p>

                        <div className={styles.formGrid}>
                            <label>
                                <span>Site name</span>
                                <input value="TrendPrice" readOnly />
                            </label>

                            <label>
                                <span>Site URL</span>
                                <input value="https://trendprice.com" readOnly />
                            </label>
                        </div>

                        <label className={styles.fullField}>
                            <span>Site Description</span>
                            <textarea
                                value="TrendPrice is a smart platform that helps users compare product prices across different stores, find the best deals, and make cost-effective shopping decisions."
                                readOnly
                            />
                        </label>

                        <label className={styles.halfField}>
                            <span>Support Email</span>
                            <input value="trendprice.kz@gmail.com" readOnly />
                        </label>

                        <div className={styles.divider} />

                        <div className={styles.features}>
                            <h3>Features</h3>

                            <div className={styles.settingRow}>
                                <div>
                                    <h4>Price Alerts</h4>
                                    <p>Allow users to set price drop alerts</p>
                                </div>

                                <label className={styles.switch}>
                                    <input type="checkbox" defaultChecked />
                                    <span />
                                </label>
                            </div>

                            <div className={styles.settingRow}>
                                <div>
                                    <h4>Price History</h4>
                                    <p>Show historical price charts</p>
                                </div>

                                <label className={styles.switch}>
                                    <input type="checkbox" defaultChecked />
                                    <span />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2>Password Policy</h2>
                        <p className={styles.cardSubtitle}>Configure password requirements for users</p>

                        <div className={styles.formGrid}>
                            <label>
                                <span>Minimum Length</span>
                                <select defaultValue="8">
                                    <option value="6">6 characters</option>
                                    <option value="8">8 characters</option>
                                    <option value="10">10 characters</option>
                                    <option value="12">12 characters</option>
                                </select>
                            </label>

                            <label>
                                <span>Password Expiry</span>
                                <select defaultValue="90">
                                    <option value="30">30 days</option>
                                    <option value="60">60 days</option>
                                    <option value="90">90 days</option>
                                    <option value="never">Never</option>
                                </select>
                            </label>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <h4>Require Special Characters</h4>
                                <p>Passwords must include special characters</p>
                            </div>

                            <label className={styles.switch}>
                                <input type="checkbox" defaultChecked />
                                <span />
                            </label>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <h4>Two-Factor Authentication</h4>
                                <p>Require 2FA for admin accounts</p>
                            </div>

                            <label className={styles.switch}>
                                <input type="checkbox" defaultChecked />
                                <span />
                            </label>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}