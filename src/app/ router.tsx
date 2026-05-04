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
import ReceiptsPage from "../ pages/ReceiptsPage/ReceiptsPage";
import NotificationsPage from "../ pages/NotificationsPage/NotificationsPage";
import SettingsPage from "../ pages/SettingsPage/SettingsPage";
import AdminDashboardPage from "../ pages/AdminDashboardPage/AdminDashboardPage";
import AdminStoresPage from "../ pages/AdminStoresPage/AdminStoresPage";
import AdminProductsPage from "../ pages/AdminProductsPage/AdminProductsPage";
import AdminPriceListingsPage from "../ pages/AdminPriceListingsPage/AdminPriceListingsPage";
import AdminCategoriesPage from "../ pages/AdminCategoriesPage/AdminCategoriesPage";
import AdminPromotionsPage from "../ pages/AdminPromotionsPage/AdminPromotionsPage";
import AdminUsersPage from "../ pages/AdminUsersPage/AdminUsersPage";
import AdminSettingsPage from "../ pages/AdminSettingsPage/AdminSettingsPage";
import AdminProfilePage from "../ pages/AdminProfilePage/AdminProfilePage";
import CatalogPage from "../ pages/CatalogPage/CatalogPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/catalog" element={<CatalogPage />} />

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
                <Route
                    path="/receipts"
                    element={
                        <ProtectedRoute>
                            <ReceiptsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <NotificationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
                <Route
                    path="/admin/stores"
                    element={
                        <ProtectedRoute>
                            <AdminStoresPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/products"
                    element={
                        <ProtectedRoute>
                            <AdminProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/price-listings"
                    element={
                        <ProtectedRoute>
                            <AdminPriceListingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/categories"
                    element={
                        <ProtectedRoute>
                            <AdminCategoriesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/promotions"
                    element={
                        <ProtectedRoute>
                            <AdminPromotionsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute>
                            <AdminUsersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute>
                            <AdminSettingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/profile"
                    element={
                        <ProtectedRoute>
                            <AdminProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />


            </Routes>
        </BrowserRouter>
    );
}