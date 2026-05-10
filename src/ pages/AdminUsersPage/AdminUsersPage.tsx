import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { adminUserService, type AdminUser } from '../../services/adminUserService';
import styles from './AdminUsersPage.module.css';

const getStatus = (user: AdminUser) => {
    if (user.blocked) return 'Blocked';
    if (!user.emailVerified || !user.enabled) return 'Pending';
    return 'Active';
};

const getMainRole = (roles: string[]) => {
    const normalizedRoles = roles.map((role) => role.replace(/^ROLE_/i, '').toUpperCase());
    return normalizedRoles.includes('ADMIN') ? 'ADMIN' : 'USER';
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionId, setActionId] = useState<number | null>(null);

    const loadUsers = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await adminUserService.getAllUsers();
            setUsers(data);
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
            { title: 'Total Users', value: String(users.length) },
            { title: 'Admins', value: String(admins) },
            { title: 'Active', value: String(active) },
            { title: 'Blocked', value: String(blocked) },
        ];
    }, [users]);

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
                        </div>
                    </div>

                    {error && <p style={{ color: '#ff3b3b', marginBottom: 12 }}>{error}</p>}

                    <div className={styles.statsGrid}>
                        {stats.map((item) => (
                            <div key={item.title} className={styles.statCard}>
                                <div className={styles.statIcon} />
                                <div>
                                    <p>{item.title}</p>
                                    <h3>{item.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.tableCard}>
                        {loading ? (
                            <p>Loading users...</p>
                        ) : (
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
                                {users.map((user) => {
                                    const role = getMainRole(user.roles);
                                    const status = getStatus(user);
                                    const disabled = actionId === user.id;

                                    return (
                                        <tr key={user.id}>
                                            <td>
                                                <div className={styles.userCell}>
                                                    <strong>{user.username}</strong>
                                                    <span>{user.email}</span>
                                                </div>
                                            </td>

                                            <td>
                                                    <span
                                                        className={`${styles.role} ${
                                                            role === 'ADMIN' ? styles.adminRole : styles.userRole
                                                        }`}
                                                    >
                                                        {role.toLowerCase()}
                                                    </span>
                                            </td>

                                            <td>{user.emailVerified ? 'Yes' : 'No'}</td>

                                            <td>
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

                                            <td className={styles.actions}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRoleToggle(user)}
                                                    disabled={disabled}
                                                >
                                                    {role === 'ADMIN' ? 'Make user' : 'Make admin'}
                                                </button>

                                                <button
                                                    type="button"
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
                        )}

                        <div className={styles.pagination}>
                            <span>Showing {users.length} of {users.length} users</span>
                            <div>
                                <button type="button" onClick={loadUsers}>
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}