import { Link } from 'react-router-dom';
import { useState } from 'react';

import MainHeader from '../../ components/MainHeader/MainHeader';
import AccountSidebar from '../../ components/AccountSidebar/AccountSidebar';

import { api } from '../../ shared/api';

import styles from '../ DashboardPage/DashboardPage.module.css';

import arrowLeftIcon from '../../assets/ArrowLeft.svg';
import settingsIcon from '../../assets/Gear.svg';
import Footer from "../../ components/Footer/Footer.tsx";

const getAuthToken = () => {
    const directTokenKeys = [
        'accessToken',
        'token',
        'jwt',
        'authToken',
    ];

    for (const key of directTokenKeys) {
        const value = localStorage.getItem(key);

        if (value) {
            return value;
        }
    }

    const jsonTokenKeys = [
        'user',
        'auth',
        'authData',
        'trend-price-auth',
    ];

    for (const key of jsonTokenKeys) {
        const value = localStorage.getItem(key);

        if (!value) {
            continue;
        }

        try {
            const parsed = JSON.parse(value);

            const token =
                parsed?.accessToken ??
                parsed?.token ??
                parsed?.jwt ??
                parsed?.authToken ??
                parsed?.user?.accessToken ??
                parsed?.user?.token;

            if (token) {
                return token;
            }
        } catch {
            continue;
        }
    }

    return null;
};

export default function SettingsPage() {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>(
        'success'
    );

    const handleChange = (
        field: keyof typeof passwordData,
        value: string
    ) => {
        if (!isEditingPassword) {
            return;
        }

        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setMessage('');
    };

    const handleCancelPassword = () => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

        setMessage('');
        setIsEditingPassword(false);
    };

    const handleUpdatePassword = async () => {
        if (!isEditingPassword) {
            setIsEditingPassword(true);
            setMessage('');
            return;
        }

        if (!passwordData.currentPassword.trim()) {
            setMessageType('error');
            setMessage('Enter current password');
            return;
        }

        if (!passwordData.newPassword.trim()) {
            setMessageType('error');
            setMessage('Enter new password');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessageType('error');
            setMessage('New password must be at least 6 characters');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessageType('error');
            setMessage('Passwords do not match');
            return;
        }

        try {
            setIsSaving(true);
            setMessage('');

            const token = getAuthToken();

            if (!token) {
                setMessageType('error');
                setMessage('Please log in again');
                return;
            }

            await api.put(
                '/users/me/password',
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: {
                        Authorization: token.startsWith('Bearer ')
                            ? token
                            : `Bearer ${token}`,
                    },
                }
            );

            setMessageType('success');
            setMessage('Password updated successfully');

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            setIsEditingPassword(false);
        } catch (error) {
            console.log(error);

            setMessageType('error');
            setMessage('Failed to update password');
        } finally {
            setIsSaving(false);
        }
    };

    const settingsCard = (
        <section className={styles.securityCard}>
            <div className={styles.securityHeader}>
                <div>
                    <h2>Security</h2>
                    <p>Manage your password and security settings</p>
                </div>
            </div>

            <div className={styles.securityForm}>
                <label>
                    <span>Current Password</span>
                    <input
                        type="password"
                        placeholder="Enter current password"
                        value={passwordData.currentPassword}
                        readOnly={!isEditingPassword}
                        onChange={(event) =>
                            handleChange(
                                'currentPassword',
                                event.target.value
                            )
                        }
                    />
                </label>

                <label>
                    <span>New Password</span>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        readOnly={!isEditingPassword}
                        onChange={(event) =>
                            handleChange('newPassword', event.target.value)
                        }
                    />
                </label>

                <label>
                    <span>Confirm New Password</span>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        readOnly={!isEditingPassword}
                        onChange={(event) =>
                            handleChange(
                                'confirmPassword',
                                event.target.value
                            )
                        }
                    />
                </label>

                {message && (
                    <p
                        className={`${styles.securityMessage} ${
                            messageType === 'error'
                                ? styles.securityMessageError
                                : styles.securityMessageSuccess
                        }`}
                    >
                        {message}
                    </p>
                )}

                <div className={styles.passwordActions}>
                    <button
                        type="button"
                        className={styles.updatePasswordButton}
                        onClick={handleUpdatePassword}
                        disabled={isSaving}
                    >
                        {isSaving
                            ? 'Saving...'
                            : isEditingPassword
                                ? 'Save Password'
                                : 'Update Password'}
                    </button>

                    {isEditingPassword && (
                        <button
                            type="button"
                            className={styles.cancelPasswordButton}
                            onClick={handleCancelPassword}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </section>
    );

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
                            <img src={settingsIcon} alt="" />
                        </div>

                        <div>
                            <h1>Settings</h1>
                            <p>Manage your password and security settings</p>
                        </div>
                    </section>

                    <div className={styles.layout}>
                        <AccountSidebar
                            activePage="settings"
                            mobileContents={{
                                settings: settingsCard,
                            }}
                        />

                        <div className={styles.desktopContent}>
                            {settingsCard}
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
}