import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MainHeader from '../../ components/MainHeader/MainHeader';
import styles from './CatalogPage.module.css';
import heartIcon from '../../assets/Heart.svg';
import searchIcon from '../../assets/Search.svg';
import analyticsIcon from '../../assets/ChartLine.svg';
import filterIcon from '../../assets/FadersHorizontal.svg';
import { productService } from '../../services/productService';
import { catalogService } from '../../services/catalogService';
import type { Brand, CatalogProduct, Category, Price } from '../../types/api';

const PAGE_SIZE = 20;

const DEFAULT_TYPES = ['Г', 'КГ', 'МЛ', 'Л', 'ШТ'];

const parseMultiParam = (value: string | null) => {
    if (!value) {
        return [];
    }

    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

const toParamValue = (values: string[]) => {
    return values.filter(Boolean).join(',');
};

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

export default function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchValueFromUrl = searchParams.get('search') ?? '';
    const categoryIdsFromUrl = parseMultiParam(searchParams.get('category'));
    const brandIdsFromUrl = parseMultiParam(searchParams.get('brand'));
    const typeIdsFromUrl = parseMultiParam(searchParams.get('type'));
    const pageFromUrl = Number(searchParams.get('page') ?? 1);

    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    const [searchValue, setSearchValue] = useState(searchValueFromUrl);
    const [selectedCategoryIds, setSelectedCategoryIds] =
        useState<string[]>(categoryIdsFromUrl);
    const [selectedBrandIds, setSelectedBrandIds] =
        useState<string[]>(brandIdsFromUrl);
    const [selectedTypes, setSelectedTypes] = useState<string[]>(typeIdsFromUrl);

    const [draftCategoryIds, setDraftCategoryIds] =
        useState<string[]>(categoryIdsFromUrl);
    const [draftBrandIds, setDraftBrandIds] = useState<string[]>(brandIdsFromUrl);
    const [draftTypes, setDraftTypes] = useState<string[]>(typeIdsFromUrl);

    const [categorySearch, setCategorySearch] = useState('');
    const [brandSearch, setBrandSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(
        Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1
    );
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const selectedCategoryTitle = useMemo(() => {
        if (selectedCategoryIds.length === 0) {
            return 'All products';
        }

        if (selectedCategoryIds.length === 1) {
            return (
                categories.find(
                    (category) => category.id === selectedCategoryIds[0]
                )?.title ?? 'Selected category'
            );
        }

        return `${selectedCategoryIds.length} categories`;
    }, [categories, selectedCategoryIds]);

    const availableTypes = useMemo(() => {
        const typesFromProducts = products
            .map((product) => product.type)
            .filter((type): type is string => Boolean(type));

        return Array.from(new Set([...DEFAULT_TYPES, ...typesFromProducts]));
    }, [products]);

    const filteredCategories = useMemo(() => {
        const normalizedSearch = categorySearch.trim().toLowerCase();

        if (!normalizedSearch) {
            return categories;
        }

        return categories.filter((category) =>
            category.title.toLowerCase().includes(normalizedSearch)
        );
    }, [categories, categorySearch]);

    const filteredBrands = useMemo(() => {
        const normalizedSearch = brandSearch.trim().toLowerCase();

        if (!normalizedSearch) {
            return brands;
        }

        return brands.filter((brand) =>
            brand.title.toLowerCase().includes(normalizedSearch)
        );
    }, [brands, brandSearch]);

    useEffect(() => {
        setSearchValue(searchValueFromUrl);
        setSelectedCategoryIds(categoryIdsFromUrl);
        setSelectedBrandIds(brandIdsFromUrl);
        setSelectedTypes(typeIdsFromUrl);

        setDraftCategoryIds(categoryIdsFromUrl);
        setDraftBrandIds(brandIdsFromUrl);
        setDraftTypes(typeIdsFromUrl);

        const nextPage =
            Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

        setCurrentPage(nextPage);
    }, [searchValueFromUrl, searchParams]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [categoriesData, brandsData] = await Promise.all([
                    productService.getAllCategories(),
                    productService.getAllBrands(),
                ]);

                setCategories(categoriesData);
                setBrands(brandsData);
            } catch (error) {
                console.log('FILTERS LOAD ERROR:', error);
            }
        };

        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError('');

            try {
                const pageData = await catalogService.searchProducts({
                    page: currentPage,
                    size: PAGE_SIZE,
                    title: searchValue.trim() || undefined,
                    category: selectedCategoryIds.length
                        ? selectedCategoryIds
                        : undefined,
                    brand: selectedBrandIds.length ? selectedBrandIds : undefined,
                    type: selectedTypes.length ? selectedTypes : undefined,
                });

                const nextProducts = pageData.content ?? [];

                setProducts(nextProducts);
                setTotalPages(pageData.totalPages || 1);
                setTotalElements(pageData.totalElements || nextProducts.length);
            } catch (error) {
                console.log('CATALOG PRODUCTS SEARCH ERROR:', error);
                setError('Failed to load catalog products from backend');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [
        currentPage,
        searchValue,
        selectedCategoryIds,
        selectedBrandIds,
        selectedTypes,
    ]);

    const updateUrlParams = (nextValues?: {
        search?: string;
        categories?: string[];
        brands?: string[];
        types?: string[];
        page?: number;
    }) => {
        const nextParams: Record<string, string> = {};

        const nextSearch = nextValues?.search ?? searchValue;
        const nextCategories = nextValues?.categories ?? selectedCategoryIds;
        const nextBrands = nextValues?.brands ?? selectedBrandIds;
        const nextTypes = nextValues?.types ?? selectedTypes;
        const nextPage = nextValues?.page ?? currentPage;

        if (nextSearch.trim()) {
            nextParams.search = nextSearch.trim();
        }

        if (nextCategories.length) {
            nextParams.category = toParamValue(nextCategories);
        }

        if (nextBrands.length) {
            nextParams.brand = toParamValue(nextBrands);
        }

        if (nextTypes.length) {
            nextParams.type = toParamValue(nextTypes);
        }

        if (nextPage > 1) {
            nextParams.page = String(nextPage);
        }

        setSearchParams(nextParams);
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setCurrentPage(1);

        updateUrlParams({
            search: searchValue,
            page: 1,
        });
    };

    const handleCategoryClick = (categoryId: string) => {
        const nextCategoryIds = selectedCategoryIds.includes(categoryId)
            ? selectedCategoryIds.filter((id) => id !== categoryId)
            : [...selectedCategoryIds, categoryId];

        setSelectedCategoryIds(nextCategoryIds);
        setDraftCategoryIds(nextCategoryIds);
        setCurrentPage(1);

        updateUrlParams({
            categories: nextCategoryIds,
            page: 1,
        });
    };

    const toggleDraftCategory = (categoryId: string) => {
        setDraftCategoryIds((current) =>
            current.includes(categoryId)
                ? current.filter((id) => id !== categoryId)
                : [...current, categoryId]
        );
    };

    const toggleDraftBrand = (brandId: string) => {
        setDraftBrandIds((current) =>
            current.includes(brandId)
                ? current.filter((id) => id !== brandId)
                : [...current, brandId]
        );
    };

    const toggleDraftType = (type: string) => {
        setDraftTypes((current) =>
            current.includes(type)
                ? current.filter((item) => item !== type)
                : [...current, type]
        );
    };

    const openFilter = () => {
        setDraftCategoryIds(selectedCategoryIds);
        setDraftBrandIds(selectedBrandIds);
        setDraftTypes(selectedTypes);
        setCategorySearch('');
        setBrandSearch('');
        setIsFilterOpen((value) => !value);
    };

    const applyFilter = () => {
        setSelectedCategoryIds(draftCategoryIds);
        setSelectedBrandIds(draftBrandIds);
        setSelectedTypes(draftTypes);
        setCurrentPage(1);

        updateUrlParams({
            categories: draftCategoryIds,
            brands: draftBrandIds,
            types: draftTypes,
            page: 1,
        });

        setIsFilterOpen(false);
    };

    const resetFilters = () => {
        setSearchValue('');
        setSelectedCategoryIds([]);
        setSelectedBrandIds([]);
        setSelectedTypes([]);
        setDraftCategoryIds([]);
        setDraftBrandIds([]);
        setDraftTypes([]);
        setCategorySearch('');
        setBrandSearch('');
        setCurrentPage(1);
        setSearchParams({});
        setIsFilterOpen(false);
    };

    const goToPage = (page: number) => {
        const nextPage = Math.min(Math.max(page, 1), totalPages);

        setCurrentPage(nextPage);
        updateUrlParams({ page: nextPage });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleAddToCart = (product: CatalogProduct) => {
        const cartRaw = localStorage.getItem('trend-price-cart');

        const cart: Array<{
            id: string;
            title: string;
            price: number;
            currency: string;
            quantity: number;
            subtitle?: string;
            oldPrice?: number;
        }> = cartRaw ? JSON.parse(cartRaw) : [];

        const currentPrice = getPriceValue(product.bestPrice);
        const oldPrice = getOldPriceValue(product.bestPrice);
        const currency = product.bestPrice?.currency || '₸';

        const brandTitle = getBrandTitle(product.brand);

        const subtitle = [
            brandTitle,
            product.type,
            product.bestPrice?.unitAmount
                ? `${product.bestPrice.unitAmount} ${product.bestPrice.unit || ''}`
                : '',
        ]
            .filter(Boolean)
            .join(' · ');

        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: currentPrice,
                currency,
                quantity: 1,
                subtitle,
                oldPrice: oldPrice || undefined,
            });
        }

        localStorage.setItem('trend-price-cart', JSON.stringify(cart));
    };

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.categories}>
                        <button
                            type="button"
                            className={`${styles.categoryChip} ${
                                selectedCategoryIds.length === 0
                                    ? styles.activeChip
                                    : ''
                            }`}
                            onClick={resetFilters}
                        >
                            All
                        </button>

                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    className={`${styles.categoryChip} ${
                                        selectedCategoryIds.includes(category.id)
                                            ? styles.activeChip
                                            : ''
                                    }`}
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    {category.title}
                                </button>
                            ))
                        ) : (
                            <span className={styles.noCategoriesText}>
                                No categories from API
                            </span>
                        )}
                    </div>

                    <Link to="/" className={styles.backLink}>
                        ← Home
                    </Link>

                    <div className={styles.toolbar}>
                        <form className={styles.search} onSubmit={handleSearchSubmit}>
                            <img src={searchIcon} alt="" />
                            <input
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder="Search"
                            />
                        </form>

                        <div className={styles.filterWrap}>
                            <button
                                type="button"
                                className={styles.filterButton}
                                onClick={openFilter}
                            >
                                <img src={filterIcon} alt="" />
                                <span>Filter</span>
                            </button>

                            {isFilterOpen && (
                                <div className={styles.filterDropdown}>
                                    <div className={styles.filterDropdownHeader}>
                                        <h2>Filter</h2>

                                        <button type="button" onClick={resetFilters}>
                                            reset
                                        </button>
                                    </div>

                                    <div className={styles.filterSection}>
                                        <h3>Categories</h3>

                                        <input
                                            className={styles.filterSearch}
                                            value={categorySearch}
                                            onChange={(event) =>
                                                setCategorySearch(event.target.value)
                                            }
                                            placeholder="Search categories..."
                                        />

                                        <div className={styles.filterList}>
                                            {filteredCategories.map((category) => (
                                                <label
                                                    key={category.id}
                                                    className={styles.filterOption}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={draftCategoryIds.includes(category.id)}
                                                        onChange={() =>
                                                            toggleDraftCategory(category.id)
                                                        }
                                                    />
                                                    <span>{category.title}</span>
                                                </label>
                                            ))}

                                            {filteredCategories.length === 0 && (
                                                <p className={styles.filterEmpty}>
                                                    No categories found
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.filterSection}>
                                        <h3>Brands</h3>

                                        <input
                                            className={styles.filterSearch}
                                            value={brandSearch}
                                            onChange={(event) =>
                                                setBrandSearch(event.target.value)
                                            }
                                            placeholder="Search brands..."
                                        />

                                        <div className={styles.filterList}>
                                            {filteredBrands.map((brand) => (
                                                <label
                                                    key={brand.id}
                                                    className={styles.filterOption}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={draftBrandIds.includes(brand.id)}
                                                        onChange={() => toggleDraftBrand(brand.id)}
                                                    />
                                                    <span>{brand.title}</span>
                                                </label>
                                            ))}

                                            {filteredBrands.length === 0 && (
                                                <p className={styles.filterEmpty}>
                                                    No brands found
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.filterSection}>
                                        <h3>Type</h3>

                                        <div className={styles.filterList}>
                                            {availableTypes.map((type) => (
                                                <label
                                                    key={type}
                                                    className={styles.filterOption}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={draftTypes.includes(type)}
                                                        onChange={() => toggleDraftType(type)}
                                                    />
                                                    <span>{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.applyFilterButton}
                                        onClick={applyFilter}
                                    >
                                        Choose
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {(selectedBrandIds.length > 0 ||
                        selectedCategoryIds.length > 0 ||
                        selectedTypes.length > 0) && (
                        <div className={styles.activeFilters}>
                            {selectedCategoryIds.map((categoryId) => (
                                <span key={categoryId}>
                                    Category:{' '}
                                    {categories.find(
                                        (category) => category.id === categoryId
                                    )?.title ?? categoryId}
                                </span>
                            ))}

                            {selectedBrandIds.map((brandId) => (
                                <span key={brandId}>
                                    Brand:{' '}
                                    {brands.find((brand) => brand.id === brandId)
                                        ?.title ?? brandId}
                                </span>
                            ))}

                            {selectedTypes.map((type) => (
                                <span key={type}>Type: {type}</span>
                            ))}

                            <button type="button" onClick={resetFilters}>
                                Clear
                            </button>
                        </div>
                    )}

                    <div className={styles.catalogHeaderRow}>
                        <h1 className={styles.categoryTitle}>
                            {selectedCategoryTitle}
                        </h1>

                        <span className={styles.totalText}>
                            {totalElements} products · page {currentPage} of{' '}
                            {totalPages}
                        </span>
                    </div>

                    {searchValueFromUrl && (
                        <p className={styles.searchResultText}>
                            Search results for: <strong>{searchValueFromUrl}</strong>
                        </p>
                    )}

                    {isLoading && (
                        <p className={styles.emptyText}>Loading products...</p>
                    )}

                    {error && <p className={styles.emptyText}>{error}</p>}

                    {!isLoading && !error && products.length === 0 && (
                        <p className={styles.emptyText}>No products found</p>
                    )}

                    {!isLoading && !error && products.length > 0 && (
                        <>
                            <div className={styles.productsGrid}>
                                {products.map((product) => {
                                    const bestPrice = product.bestPrice;

                                    const currentPrice = getPriceValue(bestPrice);
                                    const oldPrice = getOldPriceValue(bestPrice);
                                    const discountText = getDiscountText(bestPrice);

                                    const brandTitle = getBrandTitle(product.brand);

                                    const categoriesText =
                                        product.categories
                                            ?.map((category) => category.title)
                                            .join(', ') || 'No category';

                                    return (
                                        <article
                                            key={product.id}
                                            className={styles.productCard}
                                        >
                                            <button
                                                type="button"
                                                className={styles.favoriteButton}
                                            >
                                                <img src={heartIcon} alt="" />
                                            </button>

                                            <Link
                                                to={`/products/${product.id}`}
                                                className={styles.cardLink}
                                            >
                                                <div className={styles.imageBlock}>
                                                    <div
                                                        className={
                                                            styles.imagePlaceholder
                                                        }
                                                    >
                                                        {product.title}
                                                    </div>
                                                </div>

                                                <div className={styles.productInfo}>
                                                    <h2>{product.title}</h2>

                                                    <p>
                                                        {brandTitle
                                                            ? `${brandTitle} · ${categoriesText}`
                                                            : categoriesText}
                                                    </p>

                                                    <div className={styles.priceRow}>
                                                        <span className={styles.price}>
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
                                                    className={styles.cartButton}
                                                    onClick={() =>
                                                        handleAddToCart(product)
                                                    }
                                                >
                                                    Add to cart
                                                </button>

                                                <Link
                                                    to={`/products/${product.id}/analytics`}
                                                    className={styles.analyticsButton}
                                                >
                                                    <img src={analyticsIcon} alt="" />
                                                    <span>Price analytics</span>
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <div className={styles.pagination}>
                                <button
                                    type="button"
                                    disabled={currentPage <= 1}
                                    onClick={() => goToPage(currentPage - 1)}
                                >
                                    Previous
                                </button>

                                <span>
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => goToPage(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </>
    );
}