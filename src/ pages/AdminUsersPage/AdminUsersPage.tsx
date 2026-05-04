import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import styles from './AdminUsersPage.module.css';

const stats = [
    { title: 'Total Users', value: '8' },
    { title: 'Admins', value: '4' },
    { title: 'Active', value: '5' },
    { title: 'Blocked', value: '1' },
];

const users = [
    {
        name: 'John Smith',
        email: 'john@trendprice.com',
        role: 'admin',
        registered: '2026-01-15',
        lastLogin: '2026-01-15 14:30',
        status: 'Active',
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah@trendprice.com',
        role: 'store manager',
        registered: '2026-03-20',
        lastLogin: '2026-01-15 09:15',
        status: 'Active',
    },
    {
        name: 'Mike Wilson',
        email: 'mike@walmart.com',
        role: 'user',
        registered: '2026-06-10',
        lastLogin: '2026-01-14 16:45',
        status: 'Blocked',
    },
    {
        name: 'Emily Brown',
        email: 'emily@trendprice.com',
        role: 'admin',
        registered: '2026-08-05',
        lastLogin: '2026-01-15 11:20',
        status: 'Active',
    },
    {
        name: 'David Lee',
        email: 'david@target.com',
        role: 'admin',
        registered: '2026-09-12',
        lastLogin: '2026-01-13 10:00',
        status: 'Active',
    },
    {
        name: 'Lisa Anderson',
        email: 'lisa@gmail.com',
        role: 'store manager',
        registered: '2026-11-20',
        lastLogin: '2026-01-10 08:30',
        status: 'Active',
    },
    {
        name: 'Tom Harris',
        email: 'tom@costco.com',
        role: 'store manager',
        registered: '2026-01-05',
        lastLogin: '2026-01-10 10:30',
        status: 'Active',
    },
    {
        name: 'Alex Johnson',
        email: 'alex.j@freshmart.com',
        role: 'user',
        registered: '2026-08-05',
        lastLogin: 'Never',
        status: 'Pending',
    },
];

export default function AdminUsersPage() {
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
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Registered</th>
                                <th>Last Login</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {users.map((user, index) => (
                                <tr key={`${user.email}-${index}`}>
                                    <td>
                                        <div className={styles.userCell}>
                                            <strong>{user.name}</strong>
                                            <span>{user.email}</span>
                                        </div>
                                    </td>

                                    <td>
                                            <span
                                                className={`${styles.role} ${
                                                    user.role === 'admin'
                                                        ? styles.adminRole
                                                        : user.role === 'store manager'
                                                            ? styles.managerRole
                                                            : styles.userRole
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                    </td>

                                    <td>{user.registered}</td>
                                    <td>{user.lastLogin}</td>

                                    <td>
                                            <span
                                                className={`${styles.status} ${
                                                    user.status === 'Active'
                                                        ? styles.activeStatus
                                                        : user.status === 'Blocked'
                                                            ? styles.blockedStatus
                                                            : styles.pendingStatus
                                                }`}
                                            >
                                                {user.status}
                                            </span>
                                    </td>

                                    <td className={styles.actions}>...</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className={styles.pagination}>
                            <span>Showing 8 of 8 stores</span>

                            <div>
                                <button type="button">Previous</button>
                                <button type="button">Next</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}