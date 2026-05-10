import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../ components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../ components/AdminHeader/AdminHeader';
import { storeService } from '../../services/storeService';
import type { Store } from '../../types/api';
import styles from './AdminStoresPage.module.css';

import totalStoresIcon from '../../assets/StorefrontGreen.svg';
import activeStoreIcon from '../../assets/CheckCircle.svg';
import inactiveStoreIcon from '../../assets/Prohibit.svg';
import pendingStoreIcon from '../../assets/Power.svg';

const PAGE_SIZE = 8;

type StoreStatus = 'Active' | 'Inactive' | 'Pending';

type StoreWithFutureStatus = Store & {
    status?: string | null;
    active?: boolean | null;
    enabled?: boolean | null;
};

const formatDate = (dateValue?: string) => {
    if (!dateValue) return '-';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleString('ru-RU');
};

const getStoreStatus = (store: StoreWithFutureStatus): StoreStatus => {
    const status = store.status?.toLowerCase();

    if (status === 'inactive') return 'Inactive';
    if (status === 'pending') return 'Pending';
    if (status === 'active') return 'Active';

    if (store.active === false || store.enabled === false) {
        return 'Inactive';
    }

    return 'Active';
};

export default function AdminStoresPage() {
    const [stores, setStores] = useState<StoreWithFutureStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);

    const [openNoteId, setOpenNoteId] = useState<string | null>(null);

    const [savedNotes, setSavedNotes] = useState<Record<string, string>>(() => {
        const saved = localStorage.getItem('admin_store_notes');

        if (!saved) return {};

        try {
            return JSON.parse(saved) as Record<string, string>;
        } catch {
            return {};
        }
    });

    const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

    const loadStores = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await storeService.getAllStores();
            setStores(data);
            setPage(1);
        } catch {
            setError('Не удалось загрузить магазины');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadStores();
    }, []);

    const stats = useMemo(() => {
        const active = stores.filter(
            (store) => getStoreStatus(store) === 'Active'
        ).length;

        const inactive = stores.filter(
            (store) => getStoreStatus(store) === 'Inactive'
        ).length;

        const pending = stores.filter(
            (store) => getStoreStatus(store) === 'Pending'
        ).length;

        return [
            {
                title: 'Total stores',
                value: stores.length,
                icon: totalStoresIcon,
            },
            {
                title: 'Active',
                value: active,
                icon: activeStoreIcon,
            },
            {
                title: 'Inactive',
                value: inactive,
                icon: inactiveStoreIcon,
            },
            {
                title: 'Pending',
                value: pending,
                icon: pendingStoreIcon,
            },
        ];
    }, [stores]);

    const totalPages = Math.max(1, Math.ceil(stores.length / PAGE_SIZE));

    const paginatedStores = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        return stores.slice(start, end);
    }, [stores, page]);

    const from = stores.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const to = Math.min(page * PAGE_SIZE, stores.length);

    const goPrev = () => {
        setPage((prev) => Math.max(1, prev - 1));
    };

    const goNext = () => {
        setPage((prev) => Math.min(totalPages, prev + 1));
    };

    const handleOpenNote = (storeId: string) => {
        setOpenNoteId((currentId) => {
            if (currentId === storeId) {
                return null;
            }

            setDraftNotes((prev) => ({
                ...prev,
                [storeId]: savedNotes[storeId] ?? '',
            }));

            return storeId;
        });
    };

    const handleDraftNoteChange = (storeId: string, value: string) => {
        setDraftNotes((prev) => ({
            ...prev,
            [storeId]: value,
        }));
    };

    const handleSaveNote = (storeId: string) => {
        const note = draftNotes[storeId] ?? '';

        setSavedNotes((prev) => {
            const next = {
                ...prev,
                [storeId]: note,
            };

            localStorage.setItem('admin_store_notes', JSON.stringify(next));

            return next;
        });

        setOpenNoteId(null);
    };

    const handleCancelNote = () => {
        setOpenNoteId(null);
    };

    return (
        <div className={styles.adminPage}>
            <AdminSidebar />

            <main className={styles.content}>
                <AdminHeader />

                <section className={styles.pageContent}>
                    <div className={styles.titleRow}>
                        <div>
                            <h1>Stores Management</h1>
                            <p>Manage partner stores and their product listings</p>
                        </div>

                        <button
                            type="button"
                            className={styles.refreshButton}
                            onClick={loadStores}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.statsGrid}>
                        {stats.map((item) => (
                            <div key={item.title} className={styles.statCard}>
                                <div className={styles.statIcon}>
                                <img src={item.icon} alt="" />
                            </div>


                                <div>
                                    <p>{item.title}</p>
                                    <h3>{item.value.toLocaleString('ru-RU')}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.tableCard}>
                        {loading ? (
                            <p className={styles.loadingText}>Loading stores...</p>
                        ) : (
                            <>
                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>Store</th>
                                            <th>Description</th>
                                            <th>Contact</th>
                                            <th>Status</th>
                                            <th>Last Updated</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {paginatedStores.map((store) => {
                                            const status = getStoreStatus(store);

                                            return (
                                                <tr key={store.id}>
                                                    <td data-label="Store">
                                                        <strong>{store.title}</strong>
                                                    </td>

                                                    <td data-label="Description">
                                                        {store.description || '-'}
                                                    </td>

                                                    <td data-label="Contact">
                                                        {store.contactInfo || '-'}
                                                    </td>

                                                    <td data-label="Status">
                                                            <span
                                                                className={`${styles.status} ${
                                                                    status === 'Active'
                                                                        ? styles.active
                                                                        : status === 'Inactive'
                                                                            ? styles.inactive
                                                                            : styles.pending
                                                                }`}
                                                            >
                                                                {status}
                                                            </span>
                                                    </td>

                                                    <td data-label="Last Updated">
                                                        {formatDate(
                                                            store.updatedAt ?? store.createdAt
                                                        )}
                                                    </td>

                                                    <td
                                                        data-label="Actions"
                                                        className={styles.actionsCell}
                                                    >
                                                        <button
                                                            type="button"
                                                            className={styles.actionButton}
                                                            onClick={() => handleOpenNote(store.id)}
                                                        >
                                                            ...
                                                        </button>

                                                        {savedNotes[store.id] &&
                                                            openNoteId !== store.id && (
                                                                <span className={styles.notePreview}>
                                                                        Note saved
                                                                    </span>
                                                            )}

                                                        {openNoteId === store.id && (
                                                            <div className={styles.notePopover}>
                                                                    <textarea
                                                                        className={styles.noteInput}
                                                                        value={draftNotes[store.id] ?? ''}
                                                                        onChange={(event) =>
                                                                            handleDraftNoteChange(
                                                                                store.id,
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Write note..."
                                                                        rows={3}
                                                                    />

                                                                <div className={styles.noteActions}>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.cancelNoteButton}
                                                                        onClick={handleCancelNote}
                                                                    >
                                                                        Cancel
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className={styles.saveNoteButton}
                                                                        onClick={() => handleSaveNote(store.id)}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>

                                {stores.length === 0 && (
                                    <p className={styles.emptyText}>No stores found</p>
                                )}

                                <div className={styles.pagination}>
                                    <span>
                                        Showing {from}-{to} of {stores.length} stores
                                    </span>

                                    <div className={styles.paginationActions}>
                                        <button
                                            type="button"
                                            onClick={goPrev}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </button>

                                        <b>
                                            {page} / {totalPages}
                                        </b>

                                        <button
                                            type="button"
                                            onClick={goNext}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}