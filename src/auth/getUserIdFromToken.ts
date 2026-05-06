type JwtPayload = {
    uid?: number | string;
    user_id?: number | string;
    userId?: number | string;
    id?: number | string;
};

const isNumericId = (value: unknown) => {
    return (
        typeof value === 'number' ||
        (typeof value === 'string' && /^\d+$/.test(value))
    );
};

export const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return '';
    }

    try {
        const payloadPart = token.split('.')[1];

        if (!payloadPart) {
            return '';
        }

        const normalizedPayload = payloadPart
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const payload = JSON.parse(atob(normalizedPayload)) as JwtPayload;

        const possibleIds = [
            payload.uid,
            payload.user_id,
            payload.userId,
            payload.id,
        ];

        const numericId = possibleIds.find(isNumericId);

        return numericId ? String(numericId) : '';
    } catch (error) {
        console.log('JWT PARSE ERROR:', error);
        return '';
    }
};