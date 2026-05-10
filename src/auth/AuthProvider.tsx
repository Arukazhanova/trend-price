import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../ shared/api';
import {
    AuthContext,
    type AuthContextValue,
    type LoginResponse,
    type MeResponse,
    type RegisterResponse,
    type User,
} from './AuthContext';

type LoginPayload = {
    username: string;
    password: string;
};

type RegisterPayload = {
    username: string;
    email: string;
    password: string;
};

type BackendLoginResponse = LoginResponse & {
    token?: string;
};

const normalizeRoles = (roles?: string[] | null) => {
    return (roles ?? []).map((role) =>
        role.replace(/^ROLE_/i, '').toUpperCase()
    );
};

const makeUserFromLogin = (data: BackendLoginResponse): User => ({
    id: data.userId,
    userId: data.userId,
    username: data.username,
    email: data.email,
    roles: normalizeRoles(data.roles),
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token || token === 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                setUser(null);
                setIsInitializing(false);
                return;
            }

            try {
                const profileResponse = await api.get<MeResponse>('/users/me/profile');

                let roles: string[] = [];

                try {
                    const rolesResponse = await api.get<string[]>('/users/me/roles');
                    roles = rolesResponse.data;
                } catch {
                    roles = [];
                }

                const savedUser: User = {
                    id: localStorage.getItem('userId'),
                    userId: localStorage.getItem('userId'),
                    username:
                        profileResponse.data.username ??
                        localStorage.getItem('username') ??
                        '',
                    email:
                        profileResponse.data.email ??
                        localStorage.getItem('email') ??
                        null,
                    roles: normalizeRoles(profileResponse.data.roles ?? roles),
                    ...profileResponse.data,
                };

                setUser(savedUser);
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                setUser(null);
            } finally {
                setIsInitializing(false);
            }
        };

        void initializeAuth();
    }, []);

    const login = async (payload: LoginPayload) => {
        const { data } = await api.post<BackendLoginResponse>('/auth/login', payload);

        console.log('LOGIN RESPONSE:', data);

        const accessToken = data.accessToken ?? data.token;

        if (!accessToken) {
            throw new Error('Backend did not return accessToken');
        }

        localStorage.setItem('token', accessToken);

        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }

        localStorage.setItem('userId', String(data.userId));
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);

        const loginUser = makeUserFromLogin(data);

        setUser(loginUser);

        return loginUser;
    };

    const register = async (payload: RegisterPayload) => {
        const { data } = await api.post<RegisterResponse>('/auth/register', payload);
        return data;
    };

    const updateProfile = async (payload: Partial<User>) => {
        const { data } = await api.put<MeResponse>('/users/me/profile', payload);

        const updatedUser: User = {
            ...user,
            ...data,
            username: data.username ?? user?.username ?? '',
            email: data.email ?? user?.email ?? null,
            roles: normalizeRoles(data.roles ?? user?.roles),
        };

        setUser(updatedUser);

        return updatedUser;
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            await api.post('/auth/logout', { refreshToken }).catch(() => undefined);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');

        setUser(null);
    };

    const value: AuthContextValue = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            isInitializing,
            login,
            register,
            updateProfile,
            logout,
        }),
        [user, isInitializing]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}