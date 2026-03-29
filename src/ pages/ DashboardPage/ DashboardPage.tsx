import { useAuth } from '../../auth/AuthContext.tsx';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <section className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Личный кабинет</h1>

                <p className={styles.subtitle}>
                    Добро пожаловать в систему мониторинга и анализа цен и расходов.
                </p>

                <div className={styles.userBlock}>
                    <div className={styles.userRow}>
                        <span className={styles.userLabel}>Имя:</span>
                        <span className={styles.userValue}>{user?.name ?? '—'}</span>
                    </div>

                    <div className={styles.userRow}>
                        <span className={styles.userLabel}>Email:</span>
                        <span className={styles.userValue}>{user?.email ?? '—'}</span>
                    </div>
                </div>

                <button className={styles.logoutButton} onClick={logout} type="button">
                    Выйти
                </button>
            </div>
        </section>
    );
}