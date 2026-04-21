import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../ shared/api';
import {
    AuthContext,
    type AuthContextValue,
    type LoginResponse,
    type MeResponse,
    type RegisterResponse,
} from './AuthContext';

type User = AuthContextValue['user'];

type LoginPayload = {
    username: string;
    password: string;
};

type RegisterPayload = {
    username: string;
    email: string;
    password: string;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsInitializing(false);
                return;
            }

            try {
                const { data } = await api.get<MeResponse>('/users/me/profile');
                setUser(data);
            } catch {
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setIsInitializing(false);
            }
        };

        void initializeAuth();
    }, []);

    const login = async (payload: LoginPayload) => {
        const { data } = await api.post<LoginResponse>('/auth/login', payload);
        localStorage.setItem('token', data.token);

        const me = await api.get<MeResponse>('/users/me/profile');
        setUser(me.data);
    };

    const register = async (payload: RegisterPayload) => {
        const { data } = await api.post<RegisterResponse>('/auth/register', payload);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            isInitializing,
            login,
            register,
            logout,
        }),
        [user, isInitializing]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}