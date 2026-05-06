import { useEffect, useState } from 'react';

import { imageService } from '../../services/imageService';
import styles from './UserAvatarView.module.css';

interface UserAvatarViewProps {
    userId?: string | number | null;
    firstName?: string;
}

export default function UserAvatarView({
                                           userId,
                                           firstName,
                                       }: UserAvatarViewProps) {
    const normalizedUserId = userId ? String(userId) : '';
    const [isImageError, setIsImageError] = useState(false);

    const initial = firstName?.[0]?.toUpperCase() || 'U';

    const imageUrl = normalizedUserId
        ? `${imageService.getUserImageUrl(normalizedUserId)}?v=${Date.now()}`
        : '';

    useEffect(() => {
        setIsImageError(false);
    }, [normalizedUserId]);

    return (
        <div className={styles.avatarView}>
            {normalizedUserId && !isImageError ? (
                <img
                    src={imageUrl}
                    alt="User avatar"
                    onError={() => setIsImageError(true)}
                />
            ) : (
                <span>{initial}</span>
            )}
        </div>
    );
}