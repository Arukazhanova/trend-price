import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HeroSection.module.css';
import aiStarIcon from '../../assets/Starlinky.svg';
import banner1 from '../../assets/banner1.svg';
import banner2 from '../../assets/banner2.svg';
import banner3 from '../../assets/banner3.png';

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

const banners = [
    {
        bg: banner3,
        subtitle: 'Tell AI what you buy — it calculates where you save the most money.',
        title: (
            <>
                MEET YOUR AI
                <br />
                SHOPPING ASSISTANT
            </>
        ),
        primaryButton: 'Try AI Assistant',
        secondaryButton: null,
    },
    {
        bg: banner1,
        subtitle: 'All food prices are in one place',
        title: <>Shop with confidence: compare store deals and make every purchase worthwhile</>,
        primaryButton: 'Compare now',
        secondaryButton: 'View the catalog',
    },
    {
        bg: banner2,
        subtitle: 'Fresh beef, chicken and pork — compare all stores high',
        title: <>Meat prices dropped up to 20% at Magnum</>,
        primaryButton: 'Compare now',
        secondaryButton: 'View the catalog',
    },
];

export default function HeroSection() {
    const [currentBanner, setCurrentBanner] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const banner = banners[currentBanner];

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
                style={{ backgroundImage: `url(${banner.bg})` }}
            >
                <div className={styles.overlay} />

                <div className={styles.bannerContent}>
                    <div className={styles.badge}>
                        <span>Live price tracking</span>
                        <span>3+ stores</span>
                    </div>

                    <p className={styles.subtitle}>{banner.subtitle}</p>

                    <h1 className={styles.title}>{banner.title}</h1>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => {
                                if (banner.primaryButton === 'Compare now') {
                                    navigate('/products/1/analytics');
                                }

                                if (banner.primaryButton === 'Try AI Assistant') {
                                    window.dispatchEvent(new Event('open-ai-chat'));
                                }
                            }}
                        >
                            {banner.primaryButton}
                        </button>
                        {banner.secondaryButton && (
                            <button type="button" className={styles.secondaryButton}>
                                {banner.secondaryButton}
                            </button>
                        )}
                    </div>
                </div>

                {currentBanner === 0 && (
                    <div className={styles.aiCard}>
                        <div className={styles.aiHeader}>
                            <div className={styles.aiIcon}>
                                <img src={aiStarIcon} alt="" />
                            </div>
                            <strong>TrendPrice AI</strong>

                            <div className={styles.online}>
                                <span />
                                Online
                            </div>
                        </div>

                        <div className={styles.aiQuestion}>
                            Where is milk cheaper?
                        </div>

                        <div className={styles.aiAnswer}>
                            Arbuz offers the best price for milk — only 670₸.
                            This is 120₸ cheaper than in Small!
                        </div>
                    </div>
                )}

                <div className={styles.dots}>
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`${styles.dot} ${
                                currentBanner === index ? styles.activeDot : ''
                            }`}
                            onClick={() => setCurrentBanner(index)}
                        />
                    ))}
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