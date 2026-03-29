import { createContext, useContext } from 'react';

type User = {
    id: string;
    name: string;
    email: string;
};

type LoginPayload = {
    email: string;
    password: string;
};

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    user: User;
};

export type MeResponse = {
    user: User;
};

export type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}