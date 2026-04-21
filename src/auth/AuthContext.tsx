import { createContext, useContext } from 'react';

type User = {
    username: string;
    email: string | null;
    roles: string[];
};

type LoginPayload = {
    username: string;
    password: string;
};

type RegisterPayload = {
    username: string;
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    type: string;
};

export type RegisterResponse = {
    message: string;
    verificationToken: string;
    verificationUrl: string;
};

export type MeResponse = {
    username: string;
    email: string | null;
    roles: string[];
};

export type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<RegisterResponse>;
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