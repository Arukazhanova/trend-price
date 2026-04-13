import MainHeader from '../../ components/MainHeader/MainHeader';
import HeroSection from '../../ components/HeroSection/HeroSection';
import MainCatalogSection from '../../ components/MainCatalogSection/MainCatalogSection';
import Footer from '../../ components/Footer/Footer';
import styles from './MainPage.module.css';

export default function MainPage() {
    return (
        <div className={styles.page}>
            <MainHeader />

            <main className={styles.main}>
                <div className={styles.heroWrap}>
                    <HeroSection />
                </div>
            </main>

            <section className={styles.catalogSectionBg}>
                <div className={styles.catalogSectionInner}>
                    <MainCatalogSection />
                </div>
            </section>

            <Footer />
        </div>
    );
}