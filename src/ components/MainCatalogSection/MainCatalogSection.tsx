import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import styles from './MainCatalogSection.module.css';
import heartIcon from '../../assets/heart.svg';
import analyticsIcon from '../../assets/ChartLine.svg';

import { useFavourites } from '../../favourites/useFavourites';
import { useCart } from '../../cart/useCart';

import { catalogService } from '../../services/catalogService';
import { productService } from '../../services/productService';
import { imageService } from '../../services/imageService';

import type { CatalogProduct, Category, Price } from '../../types/api';

type ProductSection = {
    id: string;
    title: string;
    products: CatalogProduct[];
};

const PRODUCTS_PER_SECTION = 4;

const getBrandTitle = (brand: CatalogProduct['brand']) => {
    if (!brand) {
        return '';
    }

    return typeof brand === 'string' ? brand : brand.title;
};

const getPriceValue = (price?: Price | null) => {
    if (!price) {
        return 0;
    }

    return Number(price.finalPrice ?? price.pricePerUnit ?? 0);
};

const getOldPriceValue = (price?: Price | null) => {
    if (!price) {
        return 0;
    }

    const finalPrice = Number(price.finalPrice ?? 0);
    const pricePerUnit = Number(price.pricePerUnit ?? 0);

    if (pricePerUnit > finalPrice && finalPrice > 0) {
        return pricePerUnit;
    }

    return 0;
};

const getDiscountText = (price?: Price | null) => {
    if (!price) {
        return '';
    }

    const discount = Number(price.discount ?? 0);

    if (discount > 0 && discount < 1) {
        return `-${Math.round(discount * 100)}%`;
    }

    if (discount >= 1) {
        return `-${Math.round(discount)}%`;
    }

    if (discount < 0 && discount > -1) {
        return `+${Math.round(Math.abs(discount) * 100)}%`;
    }

    if (discount <= -1) {
        return `+${Math.round(Math.abs(discount))}%`;
    }

    const oldPrice = getOldPriceValue(price);
    const finalPrice = getPriceValue(price);

    if (oldPrice > finalPrice && finalPrice > 0) {
        const percent = Math.round(((oldPrice - finalPrice) / oldPrice) * 100);
        return `-${percent}%`;
    }

    if (finalPrice > oldPrice && oldPrice > 0) {
        const percent = Math.round(((finalPrice - oldPrice) / oldPrice) * 100);
        return `+${percent}%`;
    }

    return '';
};

const formatPrice = (value: number, currency = '₸') => {
    if (!value) {
        return 'No price';
    }

    return `${Math.round(value)}${currency}`;
};

const buildSubtitle = (product: CatalogProduct) => {
    const brandTitle = getBrandTitle(product.brand);

    const categoriesText =
        product.categories?.map((category) => category.title).join(', ') ||
        'No category';

    return brandTitle ? `${brandTitle} · ${categoriesText}` : categoriesText;
};

const findVegetablesCategory = (categories: Category[]) => {
    return categories.find((category) => {
        const title = category.title.toLowerCase();

        return (
            title.includes('vegetable') ||
            title.includes('fruit') ||
            title.includes('овощ') ||
            title.includes('фрукт')
        );
    });
};

const findDrinksCategory = (categories: Category[]) => {
    return categories.find((category) => {
        const title = category.title.toLowerCase();

        return (
            title.includes('drink') ||
            title.includes('water') ||
            title.includes('juice') ||
            title.includes('beverage') ||
            title.includes('напит') ||
            title.includes('вода') ||
            title.includes('сок')
        );
    });
};

export default function MainCatalogSection() {
    const { toggleFavourite, isFavourite } = useFavourites();
    const { cartItems, addToCart } = useCart();

    const [sections, setSections] = useState<ProductSection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMainProducts = async () => {
            setIsLoading(true);
            setError('');

            try {
                const [allProductsPage, categories] = await Promise.all([
                    catalogService.searchProducts({
                        page: 1,
                        size: PRODUCTS_PER_SECTION,
                    }),
                    productService.getAllCategories(),
                ]);

                const vegetablesCategory = findVegetablesCategory(categories);
                const drinksCategory = findDrinksCategory(categories);

                const [vegetablesProductsPage, drinksProductsPage] =
                    await Promise.all([
                        vegetablesCategory
                            ? catalogService.searchProducts({
                                page: 1,
                                size: PRODUCTS_PER_SECTION,
                                category: [vegetablesCategory.id],
                            })
                            : Promise.resolve(null),

                        drinksCategory
                            ? catalogService.searchProducts({
                                page: 1,
                                size: PRODUCTS_PER_SECTION,
                                category: [drinksCategory.id],
                            })
                            : Promise.resolve(null),
                    ]);

                setSections([
                    {
                        id: 'popular',
                        title: 'Over and over again...',
                        products: allProductsPage.content ?? [],
                    },
                    {
                        id: vegetablesCategory?.id ?? 'vegetables-and-fruits',
                        title: 'Vegetables and Fruits',
                        products: vegetablesProductsPage?.content ?? [],
                    },
                    {
                        id: drinksCategory?.id ?? 'drinks',
                        title: 'Drinks',
                        products: drinksProductsPage?.content ?? [],
                    },
                ]);
            } catch (requestError) {
                console.error('MAIN CATALOG LOAD ERROR:', requestError);
                setError('Failed to load products from backend');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMainProducts();
    }, []);

    const handleAddToCart = (
        event: MouseEvent<HTMLButtonElement>,
        product: CatalogProduct
    ) => {
        event.preventDefault();
        event.stopPropagation();

        const bestPrice = product.bestPrice;
        const currentPrice = getPriceValue(bestPrice);
        const oldPrice = getOldPriceValue(bestPrice);
        const imageUrl = imageService.getProductImageUrl(product.id);

        addToCart({
            id: product.id,
            title: product.title,
            price: currentPrice,
            currency: bestPrice?.currency || '₸',
            subtitle: buildSubtitle(product),
            oldPrice: oldPrice || undefined,
            image: imageUrl,
        });
    };

    return (
        <section className={styles.wrapper}>
            {isLoading && (
                <p className={styles.emptyText}>Loading products...</p>
            )}

            {error && <p className={styles.emptyText}>{error}</p>}

            {!isLoading &&
                !error &&
                sections.map((section) => (
                    <div key={section.id} className={styles.sectionBlock}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                {section.title}
                            </h2>
                        </div>

                        {section.products.length === 0 ? (
                            <p className={styles.emptyText}>
                                No products found
                            </p>
                        ) : (
                            <div className={styles.productsGrid}>
                                {section.products.map((product) => {
                                    const bestPrice = product.bestPrice;
                                    const imageUrl =
                                        imageService.getProductImageUrl(
                                            product.id
                                        );

                                    const isAddedToCart = cartItems.some(
                                        (item) => item.id === product.id
                                    );

                                    const favourite = isFavourite(product.id);
                                    const currentPrice = getPriceValue(bestPrice);
                                    const oldPrice =
                                        getOldPriceValue(bestPrice);
                                    const discountText =
                                        getDiscountText(bestPrice);
                                    const subtitle = buildSubtitle(product);

                                    return (
                                        <article
                                            key={product.id}
                                            className={styles.productCard}
                                        >
                                            <button
                                                type="button"
                                                className={`${styles.favoriteButton} ${
                                                    favourite
                                                        ? styles.favoriteButtonActive
                                                        : ''
                                                }`}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();

                                                    toggleFavourite({
                                                        id: product.id,
                                                        title: product.title,
                                                        subtitle,
                                                        price: formatPrice(
                                                            currentPrice,
                                                            bestPrice?.currency
                                                        ),
                                                        oldPrice:
                                                            oldPrice > 0
                                                                ? formatPrice(
                                                                    oldPrice,
                                                                    bestPrice?.currency
                                                                )
                                                                : undefined,
                                                        discount:
                                                            discountText ||
                                                            undefined,
                                                        image: imageUrl,
                                                    });
                                                }}
                                            >
                                                <img src={heartIcon} alt="" />
                                            </button>

                                            <Link
                                                to={`/products/${product.id}`}
                                                className={styles.cardLink}
                                            >
                                                <div
                                                    className={styles.imageBlock}
                                                >
                                                    <img
                                                        className={
                                                            styles.productImage
                                                        }
                                                        src={imageUrl}
                                                        alt={product.title}
                                                        loading="lazy"
                                                        onError={(event) => {
                                                            event.currentTarget.style.display =
                                                                'none';

                                                            const fallback =
                                                                event
                                                                    .currentTarget
                                                                    .nextElementSibling as HTMLDivElement | null;

                                                            if (fallback) {
                                                                fallback.style.display =
                                                                    'flex';
                                                            }
                                                        }}
                                                    />

                                                    <div
                                                        className={
                                                            styles.imagePlaceholder
                                                        }
                                                    >
                                                        {product.title}
                                                    </div>
                                                </div>

                                                <div
                                                    className={
                                                        styles.productInfo
                                                    }
                                                >
                                                    <h2>{product.title}</h2>

                                                    <p>{subtitle}</p>

                                                    <div
                                                        className={
                                                            styles.priceRow
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                styles.price
                                                            }
                                                        >
                                                            {formatPrice(
                                                                currentPrice,
                                                                bestPrice?.currency
                                                            )}
                                                        </span>

                                                        {oldPrice > 0 && (
                                                            <span
                                                                className={
                                                                    styles.oldPrice
                                                                }
                                                            >
                                                                {formatPrice(
                                                                    oldPrice,
                                                                    bestPrice?.currency
                                                                )}
                                                            </span>
                                                        )}

                                                        {discountText && (
                                                            <span
                                                                className={
                                                                    discountText.startsWith(
                                                                        '+'
                                                                    )
                                                                        ? styles.badgeUp
                                                                        : styles.badgeDown
                                                                }
                                                            >
                                                                <span
                                                                    className={
                                                                        discountText.startsWith(
                                                                            '+'
                                                                        )
                                                                            ? styles.badgeArrowUp
                                                                            : styles.badgeArrowDown
                                                                    }
                                                                />

                                                                {discountText}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>

                                            <div className={styles.actions}>
                                                <button
                                                    type="button"
                                                    className={`${styles.cartButton} ${
                                                        isAddedToCart
                                                            ? styles.cartButtonAdded
                                                            : ''
                                                    }`}
                                                    onClick={(event) =>
                                                        handleAddToCart(
                                                            event,
                                                            product
                                                        )
                                                    }
                                                >
                                                    {isAddedToCart
                                                        ? 'Added'
                                                        : 'Add to cart'}
                                                </button>

                                                <Link
                                                    to={`/products/${product.id}/analytics`}
                                                    className={
                                                        styles.analyticsButton
                                                    }
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                    }}
                                                >
                                                    <img
                                                        src={analyticsIcon}
                                                        alt=""
                                                    />
                                                    <span>
                                                        Price analytics
                                                    </span>
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
        </section>
    );
}