import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import MainHeader from "../../ components/MainHeader/MainHeader";
import styles from "./DashboardPage.module.css";
import profileIcon from "../../assets/User.svg";
import arrowLeftIcon from "../../assets/ArrowLeft.svg";
import profileMenuIcon from "../../assets/UserCircleGrey.svg";
import receiptIcon from "../../assets/Package.svg";
import notificationIcon from "../../assets/BellRinging.svg";
import settingsIcon from "../../assets/Gear.svg";
import signOutIcon from "../../assets/SignOut.svg";
import arrowRightIcon from "../../assets/CaretRight.svg";
import editIcon from "../../assets/PencilSimpleLine.svg";
import emailIcon from "../../assets/Envelope.svg";
import phoneIcon from "../../assets/Phone.svg";
import calendarIcon from "../../assets/CalendarDots.svg";

export default function DashboardPage() {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const fullName =
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
        user?.username ||
        "User";
    const firstName = user?.firstName ?? user?.username ?? "";

    const email = user?.email ?? "";
    const role = user?.roles?.length ? user.roles.join(", ") : "Customer";
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName ?? user?.username ?? "",
        lastName: user?.lastName ?? "",
        phoneNumber: user?.phoneNumber ?? "",
        dateOfBirth: user?.dateOfBirth ?? "",
    });

    const handleChange = (field: keyof typeof formData, value: string) => {
        let newValue = value;

        if (field === "phoneNumber") {
            newValue = value.replace(/[^\d+]/g, "");

            if (newValue.includes("+")) {
                newValue = "+" + newValue.replace(/\+/g, "");
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
            firstName: user?.firstName ?? user?.username ?? "",
            lastName: user?.lastName ?? "",
            phoneNumber: user?.phoneNumber ?? "",
            dateOfBirth: user?.dateOfBirth ?? "",
        });
        setIsEditing(false);
    };
    const handleLogout = () => {
        logout();
        navigate("/login");
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
                        <div className={styles.heroIcon}>
                            <img src={profileIcon} alt="" />
                        </div>

                        <div>
                            <h1>My Account</h1>
                            <p>Manage your profile and preferences</p>
                        </div>
                    </section>

                    <div className={styles.layout}>
                        <aside className={styles.sidebar}>
                            <div className={styles.profileTop}>
                                <div className={styles.avatar}>
                                    {firstName?.[0]?.toUpperCase() || "U"}
                                </div>

                                <div>
                                    <h2>{fullName}</h2>
                                    <p>{role}</p>
                                </div>
                            </div>

                            <div className={styles.stats}>
                                <div>
                                    <b>12</b>
                                    <span>Order</span>
                                </div>

                                <div>
                                    <b>2</b>
                                    <span>Saved</span>
                                </div>
                            </div>

                            <nav className={styles.menu}>
                                <Link to="/dashboard" className={`${styles.menuItem} ${styles.activeItem}`}>
                                    <img src={profileMenuIcon} alt="" />
                                    <span>Profile</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </Link>

                                <Link to="/receipts" className={styles.menuItem}>
                                    <img src={receiptIcon} alt="" />
                                    <span>My receipts</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </Link>

                                <Link to="/notifications" className={styles.menuItem}>
                                    <img src={notificationIcon} alt="" />
                                    <span>Notifications</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </Link>

                                <Link to="/settings" className={styles.menuItem}>
                                    <img src={settingsIcon} alt="" />
                                    <span>Settings</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className={`${styles.menuItem} ${styles.signOutItem}`}
                                >
                                    <img src={signOutIcon} alt="" />
                                    <span>Sign out</span>
                                    <img src={arrowRightIcon} alt="" className={styles.arrowIcon} />
                                </button>
                            </nav>
                        </aside>

                        <section className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h2>Personal Information</h2>
                                    <p>Update your personal details</p>
                                </div>

                                {isEditing ? (
                                    <div className={styles.editActions}>
                                        <button type="button" onClick={handleSave} className={styles.saveButton}>
                                            Save
                                        </button>

                                        <button type="button" onClick={handleCancel} className={styles.cancelButton}>
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

                            <div className={styles.formGrid}>
                                <label>
                                    <span>First Name</span>
                                    <input
                                        value={formData.firstName}
                                        readOnly={!isEditing}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                    />
                                </label>

                                <label>
                                    <span>Last Name</span>
                                    <input
                                        value={formData.lastName}
                                        readOnly={!isEditing}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
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
                                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
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
                                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                />
                            </label>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}