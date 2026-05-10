import { createContext, useContext } from 'react';

export type User = {
    id?: string | number | null;
    userId?: string | number | null;
    uuid?: string | null;
    username: string;
    email: string | null;
    roles: string[];
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    dateOfBirth?: string | null;
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
    accessToken: string;
    refreshToken: string;
    type: string;
    userId: number;
    username: string;
    email: string;
    roles: string[];
};

export type RegisterResponse = {
    message: string;
};

export type MeResponse = Partial<User>;

export type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    login: (payload: LoginPayload) => Promise<User>;
    register: (payload: RegisterPayload) => Promise<RegisterResponse>;
    logout: () => Promise<void> | void;
    updateProfile: (payload: Partial<User>) => Promise<User>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}