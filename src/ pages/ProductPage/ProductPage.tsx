import { Link, useParams } from "react-router-dom";
import MainHeader from "../../ components/MainHeader/MainHeader";
import Footer from "../../ components/Footer/Footer";
import starIcon from "../../assets/Star.svg";
import arrowLeftIcon from "../../assets/ArrowLeft.svg";
import heartIcon from "../../assets/Heart.svg";
import styles from "./ProductPage.module.css";

const products = [
    {
        id: 6,
        title: "Bananas, kg",
        category: "Vegetables, fruits, greens",
        subcategory: "Fruit",
        price: "799₸",
        oldPrice: "1099₸",
        discount: "-27%",
        rating: "4,9",
        ratingsCount: "1250",
        image: "",
        description:
            "Bananas from Ecuador are ripe, fragrant fruits with soft creamy flesh and a pleasant sweet taste. They are characterized by stable quality and dense texture. They are suitable for fresh consumption, making desserts, pastries, smoothies and porridges. They are convenient as a quick and nutritious snack.",
        nutrition: [
            { value: "89", label: "calories" },
            { value: "1,1", label: "squirrels" },
            { value: "0,3", label: "fats" },
            { value: "22,8", label: "carbohydrates" },
        ],
        relatedProducts: [
            {
                id: 11,
                title: "Premium bananas",
                subtitle: "1 kg Magnum",
                price: "1545₸",
                color: "#fbffc8",
            },
            {
                id: 12,
                title: "Blueberry",
                subtitle: "125 g Arbuz",
                price: "2380₸",
                color: "#c9cff8",
            },
            {
                id: 13,
                title: "Oranges",
                subtitle: "0.8 kg Magnum",
                price: "1240₸",
                oldPrice: "1550₸",
                discount: "-20%",
                color: "#fff0d1",
            },
            {
                id: 14,
                title: "Grape",
                subtitle: "0.5 kg Small",
                price: "1330₸",
                oldPrice: "2660₸",
                discount: "-50%",
                color: "#563d78",
            },
        ],
    },
];

export default function ProductPage() {
    const { id } = useParams();

    const product = products.find((item) => item.id === Number(id));

    if (!product) {
        return (
            <>
                <MainHeader />
                <main className={styles.page}>
                    <div className={styles.container}>
                        <h1>Product not found</h1>
                        <Link to="/">Back to home</Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <Link to="/" className={styles.backLink}>
                        <img src={arrowLeftIcon} alt="" />
                        <span>Home</span>
                    </Link>

                    <p className={styles.breadcrumbs}>
                        {product.category} &gt; {product.subcategory} &gt; {product.title}
                    </p>

                    <section className={styles.productCard}>
                        <div className={styles.leftColumn}>
                            <div className={styles.imageBox}>
                                {product.image ? (
                                    <img src={product.image} alt={product.title} />
                                ) : (
                                    <span>{product.title}</span>
                                )}
                            </div>

                            <p className={styles.description}>{product.description}</p>
                        </div>

                        <div className={styles.rightColumn}>
                            <div className={styles.priceCard}>
                                <h1>{product.title}</h1>

                                <div className={styles.ratingSmall}>
                                    <img src={starIcon} alt="" />
                                    <span>{product.rating} ratings</span>
                                </div>

                                <div className={styles.oldPrice}>{product.oldPrice}</div>

                                <div className={styles.priceLine}>
                                    <span className={styles.price}>{product.price}</span>
                                    <span className={styles.discount}>{product.discount}</span>
                                </div>

                                <button className={styles.cartButton}>Add to cart</button>
                            </div>

                            <div className={styles.infoBlock}>
                                <h2>Nutritional value</h2>
                                <p>In 100 grams of product</p>

                                <div className={styles.nutritionList}>
                                    {product.nutrition.map((item) => (
                                        <div key={item.label}>
                                            <b>{item.value}</b>
                                            <span>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.infoBlock}>
                                <h2>Storage conditions</h2>
                                <p>Store at a temperature of +12°C to +18°C in a dry place.</p>
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.infoBlock}>
                                <h2>Rating</h2>

                                <div className={styles.ratingBig}>
                                    <span>{product.rating}</span>
                                    <div>
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <img key={index} src={starIcon} alt="" />
                                        ))}
                                    </div>
                                </div>

                                <p>{product.ratingsCount} ratings</p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.relatedSection}>
                        <h2>Related products</h2>

                        <div className={styles.relatedGrid}>
                            {product.relatedProducts.map((item) => (
                                <article key={item.id} className={styles.relatedCard}>
                                    <button className={styles.favoriteButton}>
                                        <img src={heartIcon} alt="" />
                                    </button>

                                    <div
                                        className={styles.relatedImage}
                                        style={{ backgroundColor: item.color }}
                                    />

                                    <div className={styles.relatedBody}>
                                        <h3>{item.title}</h3>
                                        <p>{item.subtitle}</p>

                                        <div className={styles.relatedPriceRow}>
                                            <span className={styles.relatedPrice}>{item.price}</span>

                                            {item.oldPrice && (
                                                <span className={styles.relatedOldPrice}>
                          {item.oldPrice}
                        </span>
                                            )}

                                            {item.discount && (
                                                <span className={styles.relatedDiscount}>
                          ▼ {item.discount}
                        </span>
                                            )}
                                        </div>

                                        <div className={styles.relatedActions}>
                                            <button>Add to cart</button>
                                            <button>Price analytics</button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}