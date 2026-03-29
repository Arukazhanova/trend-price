import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ components/ProtectedRoute.tsx';
import LoginPage from '../ pages/LoginPage/LoginPage.tsx';
import RegisterPage from '../ pages/RegisterPage/ RegisterPage.tsx';
import DashboardPage from '../ pages/ DashboardPage/ DashboardPage.tsx';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}