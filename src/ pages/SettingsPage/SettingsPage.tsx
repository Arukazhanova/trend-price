import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../ shared/api";
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
import eyeIcon from "../../assets/eye.svg";
import eyeClosedIcon from "../../assets/eye-crossed.svg";

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await api.put("/users/me/password", {
                currentPassword,
                newPassword,
            });

            alert("Password changed successfully");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.log(error);
            alert("Password change failed");
        }
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

                                <Link to="/notifications" className={styles.menuItem}>
                                    <img src={notificationIcon} alt="" />
                                    <span>Notifications</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </Link>

                                <Link to="/settings" className={`${styles.menuItem} ${styles.activeItem}`}>
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

                        <section className={styles.securityCard}>
                            <div className={styles.securityHeader}>
                                <h2>Security</h2>
                                <p>Manage your password and security settings</p>
                            </div>

                            <form className={styles.securityForm}>
                                <label>
                                    <span>Current Password</span>
                                    <div className={styles.passwordField}>
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="Enter current password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                                            className={styles.eyeButton}
                                        >
                                            <img
                                                src={showCurrentPassword ? eyeIcon : eyeClosedIcon}
                                                alt=""
                                            />
                                        </button>
                                    </div>
                                </label>

                                <label>
                                    <span>New Password</span>
                                    <div className={styles.passwordField}>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            className={styles.eyeButton}
                                        >
                                            <img
                                                src={showNewPassword ? eyeIcon : eyeClosedIcon}
                                                alt=""
                                            />
                                        </button>
                                    </div>
                                </label>

                                <label>
                                    <span>Confirm New Password</span>
                                    <div className={styles.passwordField}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className={styles.eyeButton}
                                        >
                                            <img
                                                src={showConfirmPassword ? eyeIcon : eyeClosedIcon}
                                                alt=""
                                            />
                                        </button>
                                    </div>
                                </label>

                                <button
                                    type="button"
                                    onClick={handleUpdatePassword}
                                    className={styles.updatePasswordButton}
                                >
                                    Update Password
                                </button>
                            </form>

                            <div className={styles.deleteAccountBox}>
                                <div>
                                    <h3>Delete Account</h3>
                                    <p>Permanently delete your account and all data</p>
                                </div>

                                <button type="button" className={styles.deleteAccountButton}>
                                    Delete Account
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}