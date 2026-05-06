import { Link } from 'react-router-dom';
import { useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import { getUserIdFromToken } from '../../auth/getUserIdFromToken';

import MainHeader from '../../ components/MainHeader/MainHeader';
import AccountSidebar from '../../ components/AccountSidebar/AccountSidebar';
import UserAvatarView from '../../ components/UserAvatarView/UserAvatarView';

import styles from './DashboardPage.module.css';

import arrowLeftIcon from '../../assets/ArrowLeft.svg';
import editIcon from '../../assets/PencilSimpleLine.svg';
import emailIcon from '../../assets/Envelope.svg';
import phoneIcon from '../../assets/Phone.svg';
import calendarIcon from '../../assets/CalendarDots.svg';
import UserAvatarUpload from "../../ components/UserAvatarUpload/UserAvatarUpload.tsx";

export default function DashboardPage() {
    const { user, updateProfile } = useAuth();

    const fullName =
        `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
        user?.username ||
        'User';

    const firstName = user?.firstName ?? user?.username ?? '';

    const userId =
        user?.id ??
        user?.userId ??
        user?.uuid ??
        getUserIdFromToken();

    const email = user?.email ?? '';
    const role = user?.roles?.length ? user.roles.join(', ') : 'Customer';

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName ?? user?.username ?? '',
        lastName: user?.lastName ?? '',
        phoneNumber: user?.phoneNumber ?? '',
        dateOfBirth: user?.dateOfBirth ?? '',
    });

    const handleChange = (field: keyof typeof formData, value: string) => {
        let newValue = value;

        if (field === 'phoneNumber') {
            newValue = value.replace(/[^\d+]/g, '');

            if (newValue.includes('+')) {
                newValue = '+' + newValue.replace(/\+/g, '');
            }
        }

        setFormData((prev) => ({
            ...prev,
            [field]: newValue,
        }));
    };

    const handleSave = async () => {
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName ?? user?.username ?? '',
            lastName: user?.lastName ?? '',
            phoneNumber: user?.phoneNumber ?? '',
            dateOfBirth: user?.dateOfBirth ?? '',
        });
        setIsEditing(false);
    };

    return (
        <>
            <MainHeader />

            <main className={styles.page}>
                <div className={styles.container}>
                    <Link to="/" className={styles.backLink}>
                        <img src={arrowLeftIcon} alt="" />
                        <span>Home</span>
                    </Link>

                    <section className={styles.hero}>
                        <UserAvatarView userId={userId} firstName={firstName} />

                        <div>
                            <h1>{fullName}</h1>
                            <p>{role}</p>
                        </div>
                    </section>

                    <div className={styles.layout}>
                        <AccountSidebar activePage="profile" />

                        <section className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h2>Personal Information</h2>
                                    <p>Update your personal details</p>
                                </div>

                                {isEditing ? (
                                    <div className={styles.editActions}>
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            className={styles.saveButton}
                                        >
                                            Save
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className={styles.cancelButton}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className={styles.editButton}
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <img src={editIcon} alt="" />
                                        <span>Edit</span>
                                    </button>
                                )}
                            </div>
                            <div className={styles.photoSettings}>
                                <UserAvatarUpload
                                    userId={userId}
                                    firstName={firstName}
                                    size="large"
                                    showPreview={false}
                                    disabled={!isEditing}
                                />

                                <div className={styles.photoSettingsText}>
                                    <h3>Profile photo</h3>
                                    <p>Change or remove your account photo</p>
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <label>
                                    <span>First Name</span>
                                    <input
                                        value={formData.firstName}
                                        readOnly={!isEditing}
                                        onChange={(event) =>
                                            handleChange(
                                                'firstName',
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <label>
                                    <span>Last Name</span>
                                    <input
                                        value={formData.lastName}
                                        readOnly={!isEditing}
                                        onChange={(event) =>
                                            handleChange(
                                                'lastName',
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>
                            </div>

                            <label className={styles.fullField}>
                                <span className={styles.fieldLabel}>
                                    <img src={emailIcon} alt="" />
                                    Email
                                </span>
                                <input value={email} readOnly />
                            </label>

                            <label className={styles.fullField}>
                                <span className={styles.fieldLabel}>
                                    <img src={phoneIcon} alt="" />
                                    Phone Number
                                </span>

                                <input
                                    type="tel"
                                    inputMode="tel"
                                    placeholder=" "
                                    value={formData.phoneNumber}
                                    readOnly={!isEditing}
                                    onChange={(event) =>
                                        handleChange(
                                            'phoneNumber',
                                            event.target.value
                                        )
                                    }
                                />
                            </label>

                            <label className={styles.fullField}>
                                <span className={styles.fieldLabel}>
                                    <img src={calendarIcon} alt="" />
                                    Date of Birth
                                </span>
                                <input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    readOnly={!isEditing}
                                    onChange={(event) =>
                                        handleChange(
                                            'dateOfBirth',
                                            event.target.value
                                        )
                                    }
                                />
                            </label>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}