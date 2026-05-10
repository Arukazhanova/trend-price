import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import styles from './AdminHeader.module.css';
import chevronDownIcon from '../../assets/CaretDown.svg';
const getDisplayName = (user: ReturnType<typeof useAuth>['user']) => {
    if (!user) return 'Admin';

    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

    if (fullName) return fullName;
    if (user.username) return user.username;
    if (user.email) return user.email;

    return 'Admin';
};

const getInitials = (user: ReturnType<typeof useAuth>['user']) => {
    if (!user) return 'AD';

    const firstName = user.firstName?.trim();
    const lastName = user.lastName?.trim();

    if (firstName || lastName) {
        return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
    }

    if (user.username) {
        const parts = user.username.split(/[\s._-]+/).filter(Boolean);

        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }

        return user.username.slice(0, 2).toUpperCase();
    }

    if (user.email) {
        return user.email.slice(0, 2).toUpperCase();
    }

    return 'AD';
};

export default function AdminHeader() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const displayName = useMemo(() => getDisplayName(user), [user]);
    const initials = useMemo(() => getInitials(user), [user]);

    return (
        <header className={styles.header}>
            <div />

            <div className={styles.rightSide}>

                <button
                    type="button"
                    className={styles.profile}
                    onClick={() => navigate('/admin/profile')}
                >
                    <div className={styles.avatar}>{initials}</div>

                    <span className={styles.profileName}>{displayName}</span>

                    <img
                        src={chevronDownIcon}
                        alt=""
                        className={styles.chevronIcon}
                    />
                </button>
            </div>
        </header>
    );
}