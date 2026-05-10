import { api } from '../ shared/api';

export type AdminUser = {
    id: number;
    username: string;
    email: string;
    emailVerified: boolean;
    enabled: boolean;
    blocked: boolean;
    roles: string[];
};

const normalizeRole = (role: string) => role.replace(/^ROLE_/i, '').toUpperCase();

export const adminUserService = {
    async getAllUsers(): Promise<AdminUser[]> {
        const { data } = await api.get<AdminUser[]>('/admin/users');

        return data.map((user) => ({
            ...user,
            roles: user.roles.map(normalizeRole),
        }));
    },

    async blockUser(id: number): Promise<void> {
        await api.patch(`/admin/users/${id}/block`);
    },

    async unblockUser(id: number): Promise<void> {
        await api.patch(`/admin/users/${id}/unblock`);
    },

    async changeRole(id: number, role: 'USER' | 'ADMIN'): Promise<void> {
        await api.patch(`/admin/users/${id}/role`, { role });
    },
};