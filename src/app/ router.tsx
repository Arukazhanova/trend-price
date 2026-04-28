import { BrowserRouter,  Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ components/ProtectedRoute.tsx';
import LoginPage from '../ pages/LoginPage/LoginPage.tsx';
import RegisterPage from '../ pages/RegisterPage/ RegisterPage.tsx';
import DashboardPage from '../ pages/ DashboardPage/ DashboardPage.tsx';
import MainPage from "../ pages/MainPage/MainPage.tsx";
import FavouritesPage from "../ pages/FavouritesPage/FavouritesPage.tsx"
import VerifyEmailPage from "../ pages/VerifyEmailPage/VerifyEmailPage.tsx";
import NotFoundPage from "../ pages/NotFoundPage/NotFoundPage.tsx";
import ProductPage from "../ pages/ProductPage/ProductPage.tsx";
import PriceAnalyticsPage from "../ pages/PriceAnalyticsPage/PriceAnalyticsPage.tsx";
import PurchasePage from "../ pages/PurchasePage/PurchasePage.tsx";
export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/favourites" element={<FavouritesPage />} />
                <Route path="/products/:id" element={<ProductPage />} />
                <Route path="/products/:id/analytics" element={<PriceAnalyticsPage />} />
                <Route path="/purchase" element={<PurchasePage />} />
                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </BrowserRouter>
    );
}