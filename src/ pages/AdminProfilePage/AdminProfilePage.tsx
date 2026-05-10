import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../ shared/api';
import styles from './AdminProfilePage.module.css';

type ProfileForm = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
};

type PasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const getInitials = (firstName?: string | null, lastName?: string | null, username?: string) => {
    const first = firstName?.trim()?.[0];
    const last = lastName?.trim()?.[0];

    if (first || last) {
        return `${first ?? ''}${last ?? ''}`.toUpperCase();
    }

    return username?.slice(0, 2).toUpperCase() || 'AD';
};

export default function AdminProfilePage() {
    const { user, updateProfile } = useAuth();

    const [profileForm, setProfileForm] = useState<ProfileForm>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
    });

    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        setProfileForm({
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            phoneNumber: user.phoneNumber ?? '',
            dateOfBirth: user.dateOfBirth ?? '',
        });
    }, [user]);

    const role = useMemo(() => {
        const roles = user?.roles ?? [];
        return roles.includes('ADMIN') ? 'admin' : 'user';
    }, [user]);

    const fullName = useMemo(() => {
        const name = `${profileForm.firstName} ${profileForm.lastName}`.trim();
        return name || user?.username || 'Admin';
    }, [profileForm.firstName, profileForm.lastName, user?.username]);

    const handleProfileChange = (field: keyof ProfileForm, value: string) => {
        setProfileForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
        setPasswordForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleProfileSubmit = async () => {
        setProfileMessage('');
        setProfileLoading(true);

        try {
            await updateProfile(profileForm);
            setProfileMessage('Profile updated successfully');
        } catch {
            setProfileMessage('Не удалось обновить профиль');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async () => {
        setPasswordMessage('');

        if (passwordForm.newPassword.length < 6) {
            setPasswordMessage('Новый пароль должен быть минимум 6 символов');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordMessage('Пароли не совпадают');
            return;
        }

        setPasswordLoading(true);

        try {
            await api.put('/users/me/password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });

            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            setPasswordMessage('Password updated successfully');
        } catch {
            setPasswordMessage('Не удалось изменить пароль');
        } finally {
            setPasswordLoading(false);
        }
    };

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
                        <div className={styles.bigAvatar}>
                            {getInitials(profileForm.firstName, profileForm.lastName, user?.username)}
                        </div>

                        <div>
                            <div className={styles.nameRow}>
                                <h2>{fullName}</h2>
                                <span>{role}</span>
                            </div>
                            <p>{user?.email ?? 'No email'}</p>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h2>Personal Information</h2>
                            <p className={styles.subtitle}>Update your personal details here</p>

                            {profileMessage && (
                                <p
                                    style={{
                                        color: profileMessage.includes('successfully') ? '#009966' : '#ff3b3b',
                                    }}
                                >
                                    {profileMessage}
                                </p>
                            )}

                            <div className={styles.formGrid}>
                                <label>
                                    <span>First name</span>
                                    <input
                                        value={profileForm.firstName}
                                        onChange={(event) =>
                                            handleProfileChange('firstName', event.target.value)
                                        }
                                    />
                                </label>

                                <label>
                                    <span>Last Name</span>
                                    <input
                                        value={profileForm.lastName}
                                        onChange={(event) =>
                                            handleProfileChange('lastName', event.target.value)
                                        }
                                    />
                                </label>
                            </div>

                            <label className={styles.fullField}>
                                <span>Email Address</span>
                                <div className={styles.verifiedInput}>
                                    <input value={user?.email ?? ''} readOnly />
                                    <b>✓ Verified</b>
                                </div>
                            </label>

                            <label className={styles.fullField}>
                                <span>Phone Number</span>
                                <input
                                    value={profileForm.phoneNumber}
                                    onChange={(event) =>
                                        handleProfileChange('phoneNumber', event.target.value)
                                    }
                                />
                            </label>

                            <label className={styles.fullField}>
                                <span>Date of Birth</span>
                                <input
                                    value={profileForm.dateOfBirth}
                                    onChange={(event) =>
                                        handleProfileChange('dateOfBirth', event.target.value)
                                    }
                                    placeholder="YYYY-MM-DD"
                                />
                            </label>

                            <button
                                type="button"
                                className={styles.updateButton}
                                onClick={handleProfileSubmit}
                                disabled={profileLoading}
                            >
                                {profileLoading ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>

                        <aside className={styles.sideCards}>
                            <div className={styles.card}>
                                <h2>Account Info</h2>

                                <div className={styles.statRow}>
                                    <span>Username</span>
                                    <b>{user?.username ?? '-'}</b>
                                </div>

                                <div className={styles.statRow}>
                                    <span>Role</span>
                                    <b>{role}</b>
                                </div>
                            </div>

                            <div className={styles.deleteCard}>
                                <h2>Admin Account</h2>
                                <p>
                                    Account deleting is disabled from frontend because backend
                                    does not provide this endpoint.
                                </p>
                                <button type="button" disabled>
                                    Delete Disabled
                                </button>
                            </div>
                        </aside>
                    </div>

                    <div className={styles.card}>
                        <h2>Security</h2>
                        <p className={styles.subtitle}>Manage your password and security settings</p>

                        {passwordMessage && (
                            <p
                                style={{
                                    color: passwordMessage.includes('successfully') ? '#009966' : '#ff3b3b',
                                }}
                            >
                                {passwordMessage}
                            </p>
                        )}

                        <label className={styles.fullField}>
                            <span>Current Password</span>
                            <input
                                type="password"
                                placeholder="Enter current password"
                                value={passwordForm.currentPassword}
                                onChange={(event) =>
                                    handlePasswordChange('currentPassword', event.target.value)
                                }
                            />
                        </label>

                        <label className={styles.fullField}>
                            <span>New Password</span>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={passwordForm.newPassword}
                                onChange={(event) =>
                                    handlePasswordChange('newPassword', event.target.value)
                                }
                            />
                        </label>

                        <label className={styles.fullField}>
                            <span>Confirm New Password</span>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={passwordForm.confirmPassword}
                                onChange={(event) =>
                                    handlePasswordChange('confirmPassword', event.target.value)
                                }
                            />
                        </label>

                        <button
                            type="button"
                            className={styles.updateButton}
                            onClick={handlePasswordSubmit}
                            disabled={passwordLoading}
                        >
                            {passwordLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}