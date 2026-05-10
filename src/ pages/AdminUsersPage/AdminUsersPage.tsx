import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { adminUserService, type AdminUser } from '../../services/adminUserService';
import styles from './AdminUsersPage.module.css';
import totalUsersIcon from '../../assets/Users-green.svg';
import adminsIcon from '../../assets/Shield.svg';
import activeUsersIcon from '../../assets/CheckCircle.svg';
import blockedUsersIcon from '../../assets/Prohibit.svg';
const PAGE_SIZE = 8;

const normalizeRole = (role: string) => {
    return role.replace(/^ROLE_/i, '').toUpperCase();
};

const getStatus = (user: AdminUser) => {
    if (user.blocked) return 'Blocked';
    if (!user.emailVerified || !user.enabled) return 'Pending';
    return 'Active';
};

const getMainRole = (roles: string[]) => {
    const normalizedRoles = roles.map(normalizeRole);
    return normalizedRoles.includes('ADMIN') ? 'ADMIN' : 'USER';
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionId, setActionId] = useState<number | null>(null);
    const [page, setPage] = useState(1);

    const loadUsers = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await adminUserService.getAllUsers();
            setUsers(data);
            setPage(1);
        } catch {
            setError('Не удалось загрузить пользователей');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadUsers();
    }, []);

    const stats = useMemo(() => {
        const admins = users.filter((user) => getMainRole(user.roles) === 'ADMIN').length;
        const blocked = users.filter((user) => user.blocked).length;
        const active = users.filter((user) => getStatus(user) === 'Active').length;

        return [
            {
                title: 'Total Users',
                value: users.length,
                icon: totalUsersIcon,
            },
            {
                title: 'Admins',
                value: admins,
                icon: adminsIcon,
            },
            {
                title: 'Active',
                value: active,
                icon: activeUsersIcon,
            },
            {
                title: 'Blocked',
                value: blocked,
                icon: blockedUsersIcon,
            },
        ];
    }, [users]);

    const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        return users.slice(start, end);
    }, [users, page]);

    const from = users.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const to = Math.min(page * PAGE_SIZE, users.length);

    const goPrev = () => {
        setPage((prev) => Math.max(1, prev - 1));
    };

    const goNext = () => {
        setPage((prev) => Math.min(totalPages, prev + 1));
    };

    const handleBlockToggle = async (user: AdminUser) => {
        setActionId(user.id);
        setError('');

        try {
            if (user.blocked) {
                await adminUserService.unblockUser(user.id);
            } else {
                await adminUserService.blockUser(user.id);
            }

            await loadUsers();
        } catch {
            setError('Не удалось изменить статус пользователя');
        } finally {
            setActionId(null);
        }
    };

    const handleRoleToggle = async (user: AdminUser) => {
        setActionId(user.id);
        setError('');

        const currentRole = getMainRole(user.roles);
        const nextRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

        try {
            await adminUserService.changeRole(user.id, nextRole);
            await loadUsers();
        } catch {
            setError('Не удалось изменить роль пользователя');
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.pageContent}>
                    <div className={styles.titleRow}>
                        <div>
                            <h1>Users Management</h1>
                            <p>Manage user accounts, roles, and permissions</p>
                            <span>
                                Total: {users.length.toLocaleString('ru-RU')} • Showing {from}-{to}
                            </span>
                        </div>

                        <button
                            type="button"
                            className={styles.refreshButton}
                            onClick={loadUsers}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.statsGrid}>
                        {stats.map((item) => (
                            <div key={item.title} className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <img src={item.icon} alt="" />
                                </div>

                                <div>
                                    <p>{item.title}</p>
                                    <h3>{item.value.toLocaleString('ru-RU')}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.tableCard}>
                        {loading ? (
                            <p className={styles.loadingText}>Loading users...</p>
                        ) : (
                            <>
                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Email verified</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {paginatedUsers.map((user) => {
                                            const role = getMainRole(user.roles);
                                            const status = getStatus(user);
                                            const disabled = actionId === user.id;

                                            return (
                                                <tr key={user.id}>
                                                    <td data-label="User">
                                                        <div className={styles.userCell}>
                                                            <strong>{user.username}</strong>
                                                            <span>{user.email}</span>
                                                        </div>
                                                    </td>

                                                    <td data-label="Role">
                                                            <span
                                                                className={`${styles.role} ${
                                                                    role === 'ADMIN'
                                                                        ? styles.adminRole
                                                                        : styles.userRole
                                                                }`}
                                                            >
                                                                {role.toLowerCase()}
                                                            </span>
                                                    </td>

                                                    <td data-label="Email verified">
                                                        {user.emailVerified ? 'Yes' : 'No'}
                                                    </td>

                                                    <td data-label="Status">
                                                            <span
                                                                className={`${styles.status} ${
                                                                    status === 'Active'
                                                                        ? styles.activeStatus
                                                                        : status === 'Blocked'
                                                                            ? styles.blockedStatus
                                                                            : styles.pendingStatus
                                                                }`}
                                                            >
                                                                {status}
                                                            </span>
                                                    </td>

                                                    <td data-label="Actions" className={styles.actions}>
                                                        <button
                                                            type="button"
                                                            className={styles.roleButton}
                                                            onClick={() => handleRoleToggle(user)}
                                                            disabled={disabled}
                                                        >
                                                            {role === 'ADMIN' ? 'Make user' : 'Make admin'}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={
                                                                user.blocked
                                                                    ? styles.unblockButton
                                                                    : styles.blockButton
                                                            }
                                                            onClick={() => handleBlockToggle(user)}
                                                            disabled={disabled}
                                                        >
                                                            {user.blocked ? 'Unblock' : 'Block'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>

                                {users.length === 0 && (
                                    <p className={styles.emptyText}>No users found</p>
                                )}

                                <div className={styles.pagination}>
                                    <span>
                                        Showing {from}-{to} of {users.length} users
                                    </span>

                                    <div className={styles.paginationActions}>
                                        <button
                                            type="button"
                                            onClick={goPrev}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </button>

                                        <b>
                                            {page} / {totalPages}
                                        </b>

                                        <button
                                            type="button"
                                            onClick={goNext}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}