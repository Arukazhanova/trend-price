import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Личный кабинет</h1>
                <p className={styles.subtitle}>
                    Добро пожаловать в систему мониторинга и анализа цен и расходов.
                </p>

                <div className={styles.infoBox}>
                    <div className={styles.row}>
                        <span className={styles.label}>Username:</span>
                        <span className={styles.value}>{user?.username ?? '—'}</span>
                    </div>

                    <div className={styles.row}>
                        <span className={styles.label}>Email:</span>
                        <span className={styles.value}>{user?.email ?? '—'}</span>
                    </div>

                    <div className={styles.row}>
                        <span className={styles.label}>Roles:</span>
                        <span className={styles.value}>
                            {user?.roles?.length ? user.roles.join(', ') : '—'}
                        </span>
                    </div>
                </div>

                <button className={styles.logoutButton} onClick={handleLogout}>
                    Выйти
                </button>
            </div>
        </div>
    );
}