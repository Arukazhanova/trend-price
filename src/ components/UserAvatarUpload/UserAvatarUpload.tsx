import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';

import { imageService } from '../../services/imageService';
import styles from './UserAvatarUpload.module.css';

interface UserAvatarUploadProps {
    userId?: string | number | null;
    firstName?: string;
    size?: 'small' | 'large';
    showPreview?: boolean;
    disabled?: boolean;
    refreshKey?: number;
}

export default function UserAvatarUpload({
                                             userId,
                                             firstName,
                                             size = 'small',
                                             showPreview = true,
                                             disabled = false,
                                             refreshKey,
                                         }: UserAvatarUploadProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const normalizedUserId = userId ? String(userId) : '';

    const [imageVersion, setImageVersion] = useState(Date.now());
    const [isImageError, setIsImageError] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const initial = firstName?.[0]?.toUpperCase() || 'U';

    const imageUrl = normalizedUserId
        ? `${imageService.getUserImageUrl(normalizedUserId)}?v=${imageVersion}`
        : '';

    useEffect(() => {
        setIsImageError(false);
        setImageVersion(Date.now());
    }, [normalizedUserId, refreshKey]);

    const refreshAvatar = () => {
        setIsImageError(false);
        setImageVersion(Date.now());
    };

    const openFilePicker = () => {
        if (!normalizedUserId || isUploading || disabled) {
            return;
        }

        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!normalizedUserId) {
            console.log('USER AVATAR UPLOAD ERROR: userId is empty');
            return;
        }

        setIsUploading(true);

        try {
            await imageService.uploadUserImage(normalizedUserId, file);

            refreshAvatar();
        } catch (error) {
            console.log('USER AVATAR UPLOAD ERROR:', error);
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    const handleDeleteAvatar = async () => {
        if (!normalizedUserId) {
            return;
        }

        setIsUploading(true);

        try {
            await imageService.deleteUserImage(normalizedUserId);

            setIsImageError(true);
            setImageVersion(Date.now());
        } catch (error) {
            console.log('USER AVATAR DELETE ERROR:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            className={`${styles.avatarBlock} ${
                size === 'large'
                    ? styles.avatarBlockLarge
                    : styles.avatarBlockSmall
            } ${!showPreview ? styles.avatarBlockActionsOnly : ''}`}
        >
            {showPreview && (
                <button
                    type="button"
                    className={`${styles.avatar} ${
                        size === 'large'
                            ? styles.avatarLarge
                            : styles.avatarSmall
                    }`}
                    onClick={openFilePicker}
                    disabled={!normalizedUserId || isUploading || disabled}
                    title="Upload avatar"
                >
                    {normalizedUserId && !isImageError ? (
                        <img
                            key={imageUrl}
                            src={imageUrl}
                            alt="User avatar"
                            onError={() => {
                                setIsImageError(true);
                            }}
                        />
                    ) : (
                        <span>{initial}</span>
                    )}
                </button>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleFileChange}
            />

            <div className={styles.avatarActions}>
                <button
                    type="button"
                    className={styles.changeButton}
                    onClick={openFilePicker}
                    disabled={!normalizedUserId || isUploading || disabled}
                >
                    {isUploading ? 'Uploading...' : 'Change photo'}
                </button>

                {normalizedUserId && !isImageError && (
                    <button
                        type="button"
                        className={styles.removeButton}
                        onClick={handleDeleteAvatar}
                        disabled={isUploading || disabled}
                    >
                        Remove photo
                    </button>
                )}
            </div>
        </div>
    );
}