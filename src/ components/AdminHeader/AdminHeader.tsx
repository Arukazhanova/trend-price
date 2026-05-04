import { useNavigate } from 'react-router-dom';
import styles from './AdminHeader.module.css';

export default function AdminHeader() {
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <div className={styles.search}>
                <input placeholder="I want to find" />
                <button type="button">Search</button>
            </div>

            <button
                type="button"
                className={styles.profile}
                onClick={() => navigate('/admin/profile')}
            >
                <div className={styles.avatar}>AU</div>
                <span>Aruzhan Ushkempirrova</span>
                <span>⌄</span>
            </button>
        </header>
    );
}