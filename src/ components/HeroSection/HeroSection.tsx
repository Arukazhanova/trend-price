import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './HeroSection.module.css';
import aiStarIcon from '../../assets/Starlinky.svg';
import banner1 from '../../assets/banner1.svg';
import banner2 from '../../assets/banner2.svg';
import banner3 from '../../assets/banner3.png';

import { productService } from '../../services/productService';
import { priceService } from '../../services/priceService';
import { catalogService } from '../../services/catalogService';

import type { Category } from '../../types/api';

const banners = [
    {
        bg: banner3,
        subtitle:
            'Tell AI what you buy — it calculates where you save the most money.',
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
        title: <>compare store deals and make every purchase worthwhile</>,
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

type UnknownStatsResponse = {
    totalElements?: number;
    numberOfElements?: number;
    total?: number;
    count?: number;
    size?: number;
    content?: unknown[];
    data?: UnknownStatsResponse | unknown[];
    products?: unknown[];
    stores?: unknown[];
};

const formatStatNumber = (value?: number) => {
    if (!value) {
        return '0';
    }

    return value.toLocaleString('en-US').replace(/,/g, ' ');
};

const getStatNumber = (data: unknown): number => {
    if (typeof data === 'number') {
        return data;
    }

    if (Array.isArray(data)) {
        return data.length;
    }

    if (!data || typeof data !== 'object') {
        return 0;
    }

    const value = data as UnknownStatsResponse;

    if (typeof value.totalElements === 'number') {
        return value.totalElements;
    }

    if (typeof value.numberOfElements === 'number') {
        return value.numberOfElements;
    }

    if (typeof value.total === 'number') {
        return value.total;
    }

    if (typeof value.count === 'number') {
        return value.count;
    }

    if (typeof value.size === 'number') {
        return value.size;
    }

    if (Array.isArray(value.content)) {
        return value.content.length;
    }

    if (Array.isArray(value.products)) {
        return value.products.length;
    }

    if (Array.isArray(value.stores)) {
        return value.stores.length;
    }

    if (value.data) {
        return getStatNumber(value.data);
    }

    return 0;
};

export default function HeroSection() {
    const [currentBanner, setCurrentBanner] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);

    const [storesMonitored, setStoresMonitored] = useState('0');
    const [productsTracked, setProductsTracked] = useState('0');
    const [trackedToday, setTrackedToday] = useState('0');

    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await productService.getAllCategories();
                setCategories(response);
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchHeroStats = async () => {
            try {
                const [
                    updatedProductsData,
                    updatedStoresData,
                    catalogProductsData,
                ] = await Promise.all([
                    priceService.getUpdatedProducts(),
                    priceService.getUpdatedStores(),
                    catalogService.searchProducts({
                        page: 1,
                        size: 1,
                    }),
                ]);

                console.log('HERO UPDATED PRODUCTS DATA:', updatedProductsData);
                console.log('HERO UPDATED STORES DATA:', updatedStoresData);
                console.log('HERO CATALOG PRODUCTS DATA:', catalogProductsData);

                const updatedProductsCount =
                    getStatNumber(updatedProductsData);

                const storesCount = getStatNumber(updatedStoresData);

                const allProductsCount =
                    typeof catalogProductsData.totalElements === 'number'
                        ? catalogProductsData.totalElements
                        : getStatNumber(catalogProductsData);

                setStoresMonitored(formatStatNumber(storesCount));
                setProductsTracked(formatStatNumber(allProductsCount));
                setTrackedToday(formatStatNumber(updatedProductsCount));
            } catch (error) {
                console.error('Failed to load hero stats:', error);
            }
        };

        fetchHeroStats();
    }, []);

    const stats = useMemo(
        () => [
            {
                id: 1,
                value: storesMonitored,
                label: 'Stores monitored',
            },
            {
                id: 2,
                value: productsTracked,
                label: 'Products tracked',
            },
            {
                id: 3,
                value: trackedToday,
                label: 'Tracked today',
            },
            {
                id: 4,
                value: 'Live',
                label: 'Real-time updates',
            },
        ],
        [storesMonitored, productsTracked, trackedToday]
    );

    const banner = banners[currentBanner];

    const handleCategoryClick = (categoryId: string | number) => {
        navigate(`/catalog?category=${categoryId}`);
    };

    const handlePrimaryButtonClick = () => {
        if (banner.primaryButton === 'Compare now') {
            navigate(
                '/products/e52c04a4-7908-4120-b6e8-9ca5645d4017/analytics'
            );
        }

        if (banner.primaryButton === 'Try AI Assistant') {
            window.dispatchEvent(new Event('open-ai-chat'));
        }
    };

    const handleSecondaryButtonClick = () => {
        navigate('/catalog');
    };

    return (
        <section className={styles.heroSection}>
            <div className={styles.categories}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        className={styles.categoryChip}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        <span>{category.title}</span>
                    </button>
                ))}
            </div>

            <div
                className={`${styles.banner} ${
                    currentBanner === 0 ? styles.aiBanner : ''
                }`}
            >
                <img src={banner.bg} alt="" className={styles.bannerImage} />

                <div className={styles.overlay} />

                <div className={styles.bannerContent}>
                    <div className={styles.badge}>
                        <span>Live price tracking</span>
                        <span>{storesMonitored} stores</span>
                    </div>

                    <p className={styles.subtitle}>{banner.subtitle}</p>

                    <h1 className={styles.title}>{banner.title}</h1>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={handlePrimaryButtonClick}
                        >
                            {banner.primaryButton}
                        </button>

                        {banner.secondaryButton && (
                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={handleSecondaryButtonClick}
                            >
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

                        {index !== stats.length - 1 && (
                            <div className={styles.statDivider} />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}