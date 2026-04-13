import styles from './HeroSection.module.css';
import heroBg from '../../assets/Banner.svg';

const categories = [
    'Discount',
    'Vegetables and fruits',
    'Milk products',
    'Sausage and delicacies',
    'Bread',
    'Meat',
    'Seafood',
    'Water and juice',
];
const stats = [
    { id: 1, value: '3+', label: 'Stores monitored' },
    { id: 2, value: '10 000+', label: 'Products tracked' },
    { id: 3, value: '23%', label: 'Average savings' },
    { id: 4, value: 'Live', label: 'Real-time updates' },
];
export default function HeroSection() {
    return (
        <section className={styles.heroSection}>
            <div className={styles.categories}>
                {categories.map((item) => (
                    <button key={item} type="button" className={styles.categoryChip}>
                        <span>{item}</span>
                    </button>
                ))}
            </div>

            <div
                className={styles.banner}
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className={styles.overlay} />

                <div className={styles.bannerContent}>
                    <div className={styles.badge}>
                        <span>Live price tracking</span>
                        <span>3+ stores</span>
                    </div>

                    <p className={styles.subtitle}>All food prices are in one place</p>

                    <h1 className={styles.title}>
                        SHOP WITH CONFIDENCE:
                        <br />
                        COMPARE STORE DEALS AND MAKE
                        <br />
                        EVERY PURCHASE WORTHWHILE.
                    </h1>

                    <div className={styles.actions}>
                        <button type="button" className={styles.primaryButton}>
                            Compare now
                        </button>

                        <button type="button" className={styles.secondaryButton}>
                            View the catalog
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.stats}>
                {stats.map((item, index) => (
                    <div key={item.id} className={styles.statItemWrapper}>
                        <div className={styles.statItem}>
                            <h3 className={styles.statValue}>{item.value}</h3>
                            <p className={styles.statLabel}>{item.label}</p>
                        </div>

                        {index !== stats.length - 1 && <div className={styles.statDivider} />}
                    </div>
                ))}
            </div>
        </section>
    );
}