import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MainHeader from '../../ components/MainHeader/MainHeader';
import styles from './CatalogPage.module.css';
import heartIcon from '../../assets/Heart.svg';
import { api } from '../../ shared/api';

type Product = {
    id: number;
    name: string;
    description?: string;
    price?: number | string;
    oldPrice?: number | string;
    discount?: string;
    imageUrl?: string;
    isUp?: boolean;
};

export default function CatalogPage() {
    const [searchParams] = useSearchParams();
    const searchValue = searchParams.get('search') ?? '';

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError('');

            try {
                const response = await api.get('/products', {
                    params: searchValue
                        ? { search: searchValue }
                        : {},
                });

                setProducts(response.data);
            } catch (error) {
                console.log('PRODUCTS LOAD ERROR:', error);
                setError('Failed to load products');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [searchValue]);

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.categories}></div>

                    <Link to="/" className={styles.backLink}>
                        ← Home
                    </Link>

                    <div className={styles.toolbar}>
                        <div className={styles.search}>
                            <span>⌕</span>
                            <input placeholder="Search in category..." />
                        </div>

                        <button type="button" className={styles.filterButton}>
                            ⇄ Filter
                        </button>
                    </div>

                    <h1 className={styles.categoryTitle}>Vegetables, fruits, greens</h1>

                    {searchValue && (
                        <p className={styles.searchResultText}>
                            Search results for: <strong>{searchValue}</strong>
                        </p>
                    )}

                    {isLoading && (
                        <p className={styles.emptyText}>
                            Loading products...
                        </p>
                    )}

                    {error && (
                        <p className={styles.emptyText}>
                            {error}
                        </p>
                    )}

                    {!isLoading && !error && products.length === 0 && (
                        <p className={styles.emptyText}>
                            No products found
                        </p>
                    )}

                    {!isLoading && !error && products.length > 0 && (
                        <div className={styles.productsGrid}>
                            {products.map((product) => (
                                <article key={product.id} className={styles.productCard}>
                                    <button type="button" className={styles.favoriteButton}>
                                        <img src={heartIcon} alt="" />
                                    </button>

                                    <div className={styles.imageBlock}>
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} />
                                        ) : (
                                            <div className={styles.imagePlaceholder} />
                                        )}
                                    </div>

                                    <div className={styles.productInfo}>
                                        <h2>{product.name}</h2>

                                        <p>
                                            {product.description ?? 'No description'}
                                        </p>

                                        <div className={styles.priceRow}>
                                            {product.price && (
                                                <strong>{product.price}₸</strong>
                                            )}

                                            {product.oldPrice && (
                                                <span>{product.oldPrice}₸</span>
                                            )}

                                            {product.discount && (
                                                <b
                                                    className={
                                                        product.isUp
                                                            ? styles.discountUp
                                                            : styles.discountDown
                                                    }
                                                >
                                                    {product.isUp ? '▲' : '▼'} {product.discount}
                                                </b>
                                            )}
                                        </div>

                                        <div className={styles.actions}>
                                            <button type="button" className={styles.cartButton}>
                                                Add to cart
                                            </button>

                                            <Link
                                                to={`/products/${product.id}/analytics`}
                                                className={styles.analyticsButton}
                                            >
                                                Price analytics
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}