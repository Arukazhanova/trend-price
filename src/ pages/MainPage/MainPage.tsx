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
                <HeroSection />

                <section className={styles.catalogArea}>
                    <MainCatalogSection />
                </section>
            </main>

            <Footer />
        </div>
    );
}