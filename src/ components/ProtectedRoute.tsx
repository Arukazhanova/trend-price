import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

type ProtectedRouteProps = {
    children: JSX.Element;
    requireAdmin?: boolean;
};

const normalizeRole = (role: string) => {
    return role.replace(/^ROLE_/i, '').toUpperCase();
};

export default function ProtectedRoute({
                                           children,
                                           requireAdmin = false,
                                       }: ProtectedRouteProps) {
    const { user, isAuthenticated, isInitializing } = useAuth();
    const location = useLocation();

    if (isInitializing) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const roles = user?.roles?.map(normalizeRole) ?? [];
    const isAdmin = roles.includes('ADMIN');

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}