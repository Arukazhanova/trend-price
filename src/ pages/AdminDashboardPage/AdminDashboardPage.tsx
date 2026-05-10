import { useEffect, useMemo, useState } from 'react';
import styles from './AdminDashboardPage.module.css';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { productService } from '../../services/productService';
import { priceService } from '../../services/priceService';
import { storeService } from '../../services/storeService';
import {type AdminUser, adminUserService} from '../../services/adminUserService';
import { useAuth } from '../../auth/AuthContext';
import type { Price, Product, Store } from '../../types/api';

import storeIcon from '../../assets/StorefrontGreen.svg';
import productIcon from '../../assets/PackageGreen.svg';
import refreshIcon from '../../assets/ArrowsClockwise (1).svg';
import usersIcon from '../../assets/Users-green.svg';
import tagIcon from '../../assets/Tag.svg';
import bellIcon from '../../assets/BellGreen.svg';
import {useNavigate} from "react-router-dom";

type StorePriceStat = {
    storeId: string;
    storeName: string;
    minPrice: number;
    averagePrice: number;
    pricesCount: number;
    differencePercent: number;
};

type StatCard = {
    title: string;
    value: string;
    badge: string;
    badgeType: 'up' | 'down' | 'neutral';
    icon: string;
};

const formatNumber = (value: number) => value.toLocaleString('ru-RU');

const formatPrice = (value?: number) => {
    if (!Number.isFinite(Number(value))) return '-';
    return `${Math.round(Number(value)).toLocaleString('ru-RU')}₸`;
};

const getPriceValue = (price: Price) => {
    return Number(price.finalPrice ?? price.pricePerUnit ?? 0);
};

const normalizeRole = (role: string) => {
    return role.replace(/^ROLE_/i, '').toUpperCase();
};

const getCategoryTitle = (product: Product) => {
    return product.categories?.map((category) => category.title).join(', ') || '-';
};

const getProductDate = (product: Product) => {
    return new Date(product.createdAt ?? product.updatedAt ?? 0).getTime();
};

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);
    const [prices, setPrices] = useState<Price[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [updatedStoresCount, setUpdatedStoresCount] = useState(0);
    const [updatedProductsCount, setUpdatedProductsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const adminName =
        `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
        user?.username ||
        'Admin';

    const loadDashboard = async () => {
        setLoading(true);
        setError('');

        try {
            const [
                loadedProducts,
                loadedPrices,
                loadedStores,
                loadedUsers,
                loadedUpdatedStores,
                loadedUpdatedProducts,
            ] = await Promise.all([
                productService.getAllProducts(),
                priceService.getAllPrices(),
                storeService.getAllStores(),
                adminUserService.getAllUsers().catch(() => []),
                priceService.getUpdatedStores().catch(() => 0),
                priceService.getUpdatedProducts().catch(() => 0),
            ]);

            setProducts(loadedProducts);
            setPrices(loadedPrices);
            setStores(loadedStores);
            setUsers(loadedUsers);
            setUpdatedStoresCount(loadedUpdatedStores);
            setUpdatedProductsCount(loadedUpdatedProducts);
        } catch {
            setError('Не удалось загрузить данные dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadDashboard();
    }, []);

    const categoryCount = useMemo(() => {
        return new Set(
            products.flatMap((product) =>
                product.categories?.map((category) => category.id) ?? []
            )
        ).size;
    }, [products]);

    const checkedProductsCount = useMemo(() => {
        return products.filter((product) => product.checked).length;
    }, [products]);

    const adminsCount = useMemo(() => {
        return users.filter((adminUser) =>
            adminUser.roles.map(normalizeRole).includes('ADMIN')
        ).length;
    }, [users]);

    const activeUsersCount = useMemo(() => {
        return users.filter((adminUser) => {
            return adminUser.enabled && !adminUser.blocked;
        }).length;
    }, [users]);

    const citiesCount = useMemo(() => {
        return new Set(
            prices
                .map((price) => price.city)
                .filter((city): city is string => Boolean(city))
        ).size;
    }, [prices]);

    const stats = useMemo<StatCard[]>(
        () => [
            {
                title: 'Total stores',
                value: formatNumber(stores.length),
                badge: `${formatNumber(updatedStoresCount)} updated`,
                badgeType: updatedStoresCount > 0 ? 'up' : 'neutral',
                icon: storeIcon,
            },
            {
                title: 'Total Products',
                value: formatNumber(products.length),
                badge: `${formatNumber(checkedProductsCount)} checked`,
                badgeType: checkedProductsCount > 0 ? 'up' : 'neutral',
                icon: productIcon,
            },
            {
                title: 'Prices Updated Today',
                value: formatNumber(updatedProductsCount),
                badge: `${formatNumber(prices.length)} total`,
                badgeType: updatedProductsCount > 0 ? 'up' : 'neutral',
                icon: refreshIcon,
            },
            {
                title: 'Active Users',
                value: formatNumber(activeUsersCount),
                badge: `${formatNumber(adminsCount)} admins`,
                badgeType: adminsCount > 0 ? 'up' : 'neutral',
                icon: usersIcon,
            },
            {
                title: 'Categories',
                value: formatNumber(categoryCount),
                badge: `${formatNumber(products.length)} products`,
                badgeType: categoryCount > 0 ? 'up' : 'neutral',
                icon: tagIcon,
            },
            {
                title: 'Price Listings',
                value: formatNumber(prices.length),
                badge: `${formatNumber(citiesCount)} cities`,
                badgeType: citiesCount > 0 ? 'up' : 'neutral',
                icon: bellIcon,
            },
        ],
        [
            stores.length,
            updatedStoresCount,
            products.length,
            checkedProductsCount,
            updatedProductsCount,
            prices.length,
            activeUsersCount,
            adminsCount,
            categoryCount,
            citiesCount,
        ]
    );

    const storesById = useMemo(() => {
        return Object.fromEntries(stores.map((store) => [store.id, store]));
    }, [stores]);

    const lowestStores = useMemo<StorePriceStat[]>(() => {
        const groupedByStore: Record<string, number[]> = {};

        prices.forEach((price) => {
            const value = getPriceValue(price);

            if (!Number.isFinite(value) || value <= 0) return;

            if (!groupedByStore[price.storeId]) {
                groupedByStore[price.storeId] = [];
            }

            groupedByStore[price.storeId].push(value);
        });

        const allPrices = Object.values(groupedByStore).flat();

        const marketAverage =
            allPrices.length > 0
                ? allPrices.reduce((sum, value) => sum + value, 0) / allPrices.length
                : 0;

        return Object.entries(groupedByStore)
            .map(([storeId, values]) => {
                const store = storesById[storeId];
                const minPrice = Math.min(...values);
                const averagePrice =
                    values.reduce((sum, value) => sum + value, 0) / values.length;

                const differencePercent =
                    marketAverage > 0
                        ? Number((((averagePrice - marketAverage) / marketAverage) * 100).toFixed(1))
                        : 0;

                return {
                    storeId,
                    storeName: store?.title ?? storeId,
                    minPrice,
                    averagePrice,
                    pricesCount: values.length,
                    differencePercent,
                };
            })
            .sort((a, b) => a.averagePrice - b.averagePrice)
            .slice(0, 6);
    }, [prices, storesById]);

    const priceRangeByProduct = useMemo(() => {
        const map: Record<string, number[]> = {};

        prices.forEach((price) => {
            const value = getPriceValue(price);

            if (!Number.isFinite(value) || value <= 0) return;

            if (!map[price.productId]) {
                map[price.productId] = [];
            }

            map[price.productId].push(value);
        });

        return map;
    }, [prices]);

    const latestProducts = useMemo(() => {
        return [...products]
            .sort((a, b) => getProductDate(b) - getProductDate(a))
            .slice(0, 5);
    }, [products]);

    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.dashboard}>
                    <div className={styles.titleRow}>
                        <div>
                            <h1>Dashboard</h1>
                            <p>
                                Welcome back, {adminName}. Here is what is happening today.
                            </p>
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.refresh}
                                onClick={loadDashboard}
                            >
                                Refresh
                            </button>

                            <button type="button" className={styles.export}>
                                Export
                            </button>
                        </div>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    {loading ? (
                        <p className={styles.loading}>Loading dashboard...</p>
                    ) : (
                        <>
                            <div className={styles.statsGrid}>
                                {stats.map((item) => (
                                    <div key={item.title} className={styles.statCard}>
                                        <div className={styles.statTop}>
                                            <div className={styles.statIcon}>
                                                <img src={item.icon} alt="" />
                                            </div>

                                            <span
                                                className={`${styles.changeBadge} ${
                                                    item.badgeType === 'up'
                                                        ? styles.up
                                                        : item.badgeType === 'down'
                                                            ? styles.down
                                                            : styles.neutral
                                                }`}
                                            >
                                                {item.badgeType === 'up' && '▲ '}
                                                {item.badge}
                                            </span>
                                        </div>

                                        <p>{item.title}</p>
                                        <h3>{item.value}</h3>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.bottomGrid}>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h2>Lowest Price Stores</h2>

                                        <button
                                            type="button"
                                            onClick={() => navigate('/admin/stores')}
                                        >
                                            View All
                                        </button>
                                    </div>

                                    <div className={styles.storeList}>
                                        {lowestStores.length ? (
                                            lowestStores.map((store, index) => {
                                                const isMoreExpensive = store.differencePercent > 0;
                                                const isEqual = store.differencePercent === 0;

                                                return (
                                                    <div
                                                        key={store.storeId}
                                                        className={styles.storeRow}
                                                    >
                                                        <span className={styles.storeIndex}>
                                                            {index + 1}
                                                        </span>

                                                        <div className={styles.storeInfo}>
                                                            <p>{store.storeName}</p>
                                                            <small>
                                                                {store.pricesCount} prices · avg{' '}
                                                                {formatPrice(store.averagePrice)}
                                                            </small>
                                                        </div>

                                                        <b
                                                            className={`${styles.percentBadge} ${
                                                                isEqual
                                                                    ? styles.percentNeutral
                                                                    : isMoreExpensive
                                                                        ? styles.percentBad
                                                                        : styles.percentGood
                                                            }`}
                                                        >
                                                            {!isEqual && (
                                                                <>
                                                                    {isMoreExpensive ? '▲' : '▼'}{' '}
                                                                </>
                                                            )}
                                                            {isEqual
                                                                ? '0%'
                                                                : `${Math.abs(
                                                                    store.differencePercent
                                                                )}%`}
                                                        </b>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className={styles.emptyText}>No price data yet</p>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h2>Latest Added Products</h2>

                                        <button
                                            type="button"
                                            onClick={() => navigate('/admin/products')}
                                        >
                                            View All
                                        </button>
                                    </div>

                                    <div className={styles.tableWrap}>
                                        <table className={styles.table}>
                                            <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Price Range</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {latestProducts.map((product) => {
                                                const values =
                                                    priceRangeByProduct[product.id] ?? [];

                                                const min = values.length
                                                    ? Math.min(...values)
                                                    : undefined;

                                                const max = values.length
                                                    ? Math.max(...values)
                                                    : undefined;

                                                return (
                                                    <tr key={product.id}>
                                                        <td>
                                                            <div className={styles.productCell}>
                                                                <b>{product.title}</b>
                                                            </div>
                                                        </td>

                                                        <td>{getCategoryTitle(product)}</td>

                                                        <td>
                                                            {values.length ? (
                                                                <>
                                                                        <span className={styles.minPrice}>
                                                                            {formatPrice(min)}
                                                                        </span>
                                                                    {' - '}
                                                                    <span className={styles.maxPrice}>
                                                                            {formatPrice(max)}
                                                                        </span>
                                                                </>
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}