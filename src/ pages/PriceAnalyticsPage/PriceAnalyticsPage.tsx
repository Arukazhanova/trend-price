import MainHeader from "../../ components/MainHeader/MainHeader";
import Footer from "../../ components/Footer/Footer";
import styles from "./PriceAnalyticsPage.module.css";
import searchIcon from "../../assets/Search.svg";
import { useState } from "react";

const products = [
    {
        id: 1,
        title: "Apples",
        price: 490,
        change: -15,
        data: [570, 600, 530, 450, 370, 320],
    },
    {
        id: 2,
        title: "Bananas",
        price: 380,
        change: 7.9,
        data: [300, 320, 350, 370, 390, 420],
    },
    {
        id: 3,
        title: "Broccoli fresh",
        price: 350,
        change: -8,
        data: [420, 410, 390, 380, 360, 350],
    },
];
const topDrops = [
    { title: "Organic Milk", change: "-24%" },
    { title: "Fresh Broccoli", change: "-18%" },
    { title: "Cherry tomatoes", change: "-15%" },
];

const topIncreases = [
    { title: "Greek Yogurt", change: "+8%" },
    { title: "Eggs Large", change: "+5%" },
    { title: "Butter", change: "+3%" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const periods = ["7D", "1M", "3M", "6M", "1Y"];
export default function PriceAnalyticsPage() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(products[0]);
    const [activePeriod, setActivePeriod] = useState("6M");
    const filteredProducts = products.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );
    const maxPrice = 800;
    const chartTop = 30;
    const chartBottom = 230;
    const chartHeight = chartBottom - chartTop;
    const xPoints = [55, 175, 295, 415, 535, 660];

    const chartPoints = selected.data
        .map((price, index) => {
            const x = xPoints[index];
            const y = chartBottom - (price / maxPrice) * chartHeight;

            return `${x},${y}`;
        })
        .join(" ");

    const lowestPrice = Math.min(...selected.data);
    const highestPrice = Math.max(...selected.data);

    const averagePrice = Math.round(
        selected.data.reduce((sum, price) => sum + price, 0) / selected.data.length
    );

    const lowestIndex = selected.data.indexOf(lowestPrice);
    const highestIndex = selected.data.indexOf(highestPrice);

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <h1 className={styles.pageTitle}>Price Analytics</h1>

                    <div className={styles.layout}>
                        <aside className={styles.sidebar}>
                            <h2>Select Product</h2>

                            <div className={styles.searchWrap}>
                                <img src={searchIcon} alt="" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className={styles.search}
                                />
                            </div>

                            <div className={styles.productList}>
                                {filteredProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        className={styles.productItem}
                                        onClick={() => setSelected(product)}
                                    >
                                        <div>
                                            <b>{product.title}</b>
                                            <span>{product.price}₸</span>
                                        </div>

                                        <span
                                            className={
                                                product.change > 0 ? styles.badgeUp : styles.badgeDown
                                            }
                                        >
      {product.change > 0 ? "+" : ""}
                                            {product.change}%
    </span>
                                    </button>
                                ))}
                            </div>
                        </aside>

                        <section className={styles.mainContent}>
                            <div className={styles.chartCard}>
                                <div className={styles.chartHeader}>
                                    <div>
                                        <h2>{selected.title}</h2>
                                        <p>
                                            Current price: {selected.price}₸
                                        </p>
                                    </div>

                                    <div className={styles.periods}>
                                        {periods.map((period) => (
                                            <button
                                                key={period}
                                                type="button"
                                                onClick={() => setActivePeriod(period)}
                                                className={activePeriod === period ? styles.activePeriod : ""}
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.chart}>
                                    <svg viewBox="0 0 700 280">
                                        {[800, 600, 400, 200, 0].map((value, index) => {
                                            const y = 30 + index * 50;

                                            return (
                                                <g key={value}>
                                                    <text x="20" y={y + 5} className={styles.yLabel}>
                                                        {value}
                                                    </text>

                                                    <line
                                                        x1="55"
                                                        y1={y}
                                                        x2="660"
                                                        y2={y}
                                                        className={styles.gridLine}
                                                    />
                                                </g>
                                            );
                                        })}

                                        {[55, 175, 295, 415, 535, 660].map((x) => (
                                            <line
                                                key={x}
                                                x1={x}
                                                y1="30"
                                                x2={x}
                                                y2="230"
                                                className={styles.gridLine}
                                            />
                                        ))}

                                        <line x1="55" y1="30" x2="55" y2="230" className={styles.axis} />
                                        <line x1="55" y1="230" x2="660" y2="230" className={styles.axis} />

                                        <line
                                            x1="55"
                                            y1="82"
                                            x2="660"
                                            y2="82"
                                            className={styles.averageLine}
                                        />

                                        <polyline points={chartPoints} className={styles.priceLine} />

                                        {selected.data.map((price, index) => {
                                            const x = xPoints[index];
                                            const y = chartBottom - (price / maxPrice) * chartHeight;

                                            return (
                                                <circle
                                                    key={index}
                                                    cx={x}
                                                    cy={y}
                                                    r="4"
                                                    className={styles.point}
                                                />
                                            );
                                        })}
                                        {months.map((month, index) => (
                                            <text key={month} x={55 + index * 121} y="252" className={styles.month}>
                                                {month}
                                            </text>
                                        ))}
                                    </svg>

                                    <div className={styles.legend}>
                                        <span className={styles.greenLegend}>Actual Price</span>
                                        <span className={styles.redLegend}>Monthly Average</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.stats}>
                                <div>
                                    <span>Lowest Price</span>
                                    <b className={styles.greenText}>{lowestPrice}₸</b>
                                    <p>{months[lowestIndex]} 2026</p>
                                </div>

                                <div>
                                    <span>Highest Price</span>
                                    <b className={styles.redText}>{highestPrice}₸</b>
                                    <p>{months[highestIndex]} 2026</p>
                                </div>

                                <div>
                                    <span>Average Price</span>
                                    <b>{averagePrice}₸</b>
                                    <p>Last 6 months</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className={styles.bottomBlocks}>
                        <section className={styles.dropBlock}>
                        <h2>Top Price Drop This Week</h2>

                            {topDrops.map((item) => (
                                <div className={styles.smallRow} key={item.title}>
                                    <b>{item.title}</b>
                                    <span>{item.change}</span>
                                </div>
                            ))}
                    </section>

                    <section className={styles.increaseBlock}>
                        <h2>Top Price Increases This Week</h2>

                        {topIncreases.map((item) => (
                            <div className={styles.smallRow} key={item.title}>
                                <b>{item.title}</b>
                                <span>{item.change}</span>
                            </div>
                        ))}
                    </section>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}