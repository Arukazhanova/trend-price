import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import { getUserIdFromToken } from '../../auth/getUserIdFromToken';

import MainHeader from '../../ components/MainHeader/MainHeader';
import AccountSidebar from '../../ components/AccountSidebar/AccountSidebar';
import UserAvatarUpload from '../../ components/UserAvatarUpload/UserAvatarUpload.tsx';

import styles from './DashboardPage.module.css';

import profileMenuIcon from '../../assets/User.svg';
import arrowLeftIcon from '../../assets/ArrowLeft.svg';
import editIcon from '../../assets/PencilSimpleLine.svg';
import emailIcon from '../../assets/Envelope.svg';
import phoneIcon from '../../assets/Phone.svg';
import calendarIcon from '../../assets/CalendarDots.svg';
import receiptIcon from '../../assets/Package.svg';
import filterIcon from '../../assets/Funnel.svg';
import Footer from "../../ components/Footer/Footer.tsx";

type ReceiptItem = {
    id: string;
    title: string;
    price: number;
    currency: string;
    quantity: number;
    subtitle?: string;
    oldPrice?: number;
    image?: string;
};

type SavedReceipt = {
    id: string;
    createdAt: string;
    items: ReceiptItem[];
    totalQuantity: number;
    total: number;
    currency: string;
};

const RECEIPTS_STORAGE_KEY = 'trend-price-receipts';

const formatPrice = (value: number, currency = '₸') => {
    if (!value) {
        return 'No price';
    }

    return `${Math.round(value)}${currency}`;
};

const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('ru-RU');
};

const readReceiptsFromStorage = (): SavedReceipt[] => {
    try {
        const rawReceipts = localStorage.getItem(RECEIPTS_STORAGE_KEY);

        if (!rawReceipts) {
            return [];
        }

        const parsedReceipts = JSON.parse(rawReceipts);

        if (!Array.isArray(parsedReceipts)) {
            return [];
        }

        return parsedReceipts;
    } catch (error) {
        console.log('RECEIPTS READ ERROR:', error);
        return [];
    }
};

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

    const [receipts, setReceipts] = useState<SavedReceipt[]>(
        readReceiptsFromStorage
    );

    const [openedReceiptId, setOpenedReceiptId] = useState<string | null>(null);



    const totalSavedProducts = useMemo(() => {
        return receipts.reduce((sum, receipt) => {
            return sum + receipt.totalQuantity;
        }, 0);
    }, [receipts]);

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

    const handleDeleteReceipt = (receiptId: string) => {
        const nextReceipts = receipts.filter(
            (receipt) => receipt.id !== receiptId
        );

        setReceipts(nextReceipts);
        localStorage.setItem(
            RECEIPTS_STORAGE_KEY,
            JSON.stringify(nextReceipts)
        );
    };

    const handleClearReceipts = () => {
        setReceipts([]);
        localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify([]));
        setOpenedReceiptId(null);
    };

    const profileCard = (
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
                            handleChange('firstName', event.target.value)
                        }
                    />
                </label>

                <label>
                    <span>Last Name</span>
                    <input
                        value={formData.lastName}
                        readOnly={!isEditing}
                        onChange={(event) =>
                            handleChange('lastName', event.target.value)
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
                        handleChange('phoneNumber', event.target.value)
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
                        handleChange('dateOfBirth', event.target.value)
                    }
                />
            </label>
        </section>
    );

    const receiptsCard = (
        <section className={styles.receiptsCard}>
            <div className={styles.receiptsHeader}>
                <div>
                    <h2>All receipts</h2>
                    <p>Keep track of your receipts in one place</p>
                </div>

                <div className={styles.receiptsActions}>
                    {receipts.length > 0 && (
                        <button
                            type="button"
                            className={styles.clearReceiptsButton}
                            onClick={handleClearReceipts}
                        >
                            Clear all
                        </button>
                    )}

                    <button type="button" className={styles.filterButton}>
                        <img src={filterIcon} alt="" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {receipts.length === 0 ? (
                <div className={styles.emptyReceipts}>
                    <img src={receiptIcon} alt="" />
                    <h3>No receipts yet</h3>
                    <p>
                        Save a receipt from Purchase and it will appear here.
                    </p>

                    <Link to="/catalog" className={styles.receiptsCatalogButton}>
                        Go to catalog
                    </Link>
                </div>
            ) : (
                <div className={styles.receiptList}>
                    {receipts.map((receipt) => {
                        const isOpen = openedReceiptId === receipt.id;

                        return (
                            <article
                                key={receipt.id}
                                className={styles.receiptItem}
                            >
                                <button
                                    type="button"
                                    className={styles.receiptRow}
                                    onClick={() =>
                                        setOpenedReceiptId(
                                            isOpen ? null : receipt.id
                                        )
                                    }
                                >
                                    <span>
                                        Date: {formatDate(receipt.createdAt)}
                                    </span>

                                    <span>
                                        Quantity: {receipt.totalQuantity}
                                    </span>

                                    <span>
                                        Sum:{' '}
                                        {formatPrice(
                                            receipt.total,
                                            receipt.currency
                                        )}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className={styles.receiptDetails}>
                                        {receipt.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className={
                                                    styles.receiptProductRow
                                                }
                                            >
                                                <span>{item.title}</span>
                                                <span>x{item.quantity}</span>
                                                <span>
                                                    {formatPrice(
                                                        item.price *
                                                        item.quantity,
                                                        item.currency
                                                    )}
                                                </span>
                                            </div>
                                        ))}

                                        <div
                                            className={
                                                styles.receiptDetailsFooter
                                            }
                                        >
                                            <b>
                                                Total:{' '}
                                                {formatPrice(
                                                    receipt.total,
                                                    receipt.currency
                                                )}
                                            </b>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteReceipt(
                                                        receipt.id
                                                    )
                                                }
                                            >
                                                Delete receipt
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );

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
                        <div className={styles.accountHeroIcon}>
                            <img src={profileMenuIcon} alt="" />
                        </div>

                        <div>
                            <h1>My Account</h1>
                            <p>Manage your profile and preferences</p>
                        </div>
                    </section>

                    <div className={styles.layout}>
                        <AccountSidebar
                            activePage="profile"
                            receiptsCount={receipts.length}
                            productsCount={totalSavedProducts}
                            mobileContents={{
                                profile: profileCard,
                                receipts: receiptsCard,
                            }}
                        />

                        <div className={styles.desktopContent}>
                            {profileCard}
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
}