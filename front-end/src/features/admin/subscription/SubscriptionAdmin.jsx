import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './SubscriptionAdmin.module.css';
import ConfirmPopup from '../../../components/popup/ConfirmPopup';
import { fetchAbonnes, fetchAbonnementStats, deleteAbonne } from './SubscriptionAdminSlice';
import BackButton from '../../../components/common/admin/BackButton';

export default function SubscriptionAdmin() {
    const dispatch = useDispatch();
    const { abonnes, stats, loading, loadingStats, error } = useSelector(
        (state) => state.adminSubscription
    );

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [abonneToDelete, setAbonneToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchAbonnes());
        dispatch(fetchAbonnementStats());
    }, [dispatch]);

    // --- HANDLERS ---
    const handleEmail = (email) => {
        window.open(`mailto:${email}`, '_blank');
    };

    const triggerDeletePopup = (e, abonne) => {
        e.stopPropagation();
        setAbonneToDelete(abonne);
        setIsPopupOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteAbonne(abonneToDelete.id));
        setIsPopupOpen(false);
        setAbonneToDelete(null);
    };

    const handleExportCSV = () => {
        const header = "ID,Email,Date d'adhésion\n";
        const rows = abonnes
            .map((a) => `${a.id},${a.email},${formatDate(a.dateAbonnement ?? a.created_at)}`)
            .join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `abonnes.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // --- HELPERS ---
    const getInitial = (email = '') => email.charAt(0).toUpperCase();

    const formatDate = (isoString) => {
        if (!isoString) return '—';
        return new Date(isoString).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    };

    // --- LOADING STATE ---
    if (loading && abonnes.length === 0) {
        return <div className={styles.container}><p>Chargement des abonnés...</p></div>;
    }
    console.log("reee ", abonnes);
    return (
        <div className={styles.container}>
            <ConfirmPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleConfirmDelete}
                variant="danger"
                title="Supprimer l'abonné ?"
                description="Êtes-vous sûr de vouloir supprimer cet abonné de la newsletter ?"
                detailLabel="Email"
                detailValue={abonneToDelete?.email || ''}
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
            />

            {/* ── Header ── */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <BackButton />
                    <h1 className={styles.title}>GESTION DES ABONNÉS</h1>
                    <p className={styles.subtitle}>
                        Gérez la communauté Heritage Hearth, suivez les nouvelles inscriptions
                        et maintenez le lien avec vos contributeurs.
                    </p>
                </div>
                <button className={styles.exportBtn} onClick={handleExportCSV}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Exporter CSV
                </button>
            </header>

            {/* ── Stats ── */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>TOTAL ENGAGEMENT</span>
                    <span className={styles.statValue}>
                        {loadingStats ? '…' : (stats?.totalAbonnes ?? 0).toLocaleString('fr-FR')}
                    </span>
                    <span className={styles.statSub}>
                        {`${stats?.croissanceMensuelle ?? 0} nouvelle(s) inscription(s) ce mois-ci.`}
                    </span>
                </div>
                <div className={`${styles.statCard} ${styles.accentCard}`}>
                    <span className={styles.statLabel}>ACTIFS CE MOIS</span>
                    <span className={styles.statValue}>
                        {loadingStats ? '…' : (stats?.abonnesCeMois ?? 0)}
                    </span>
                    <span className={styles.statSub}>
                        {abonnes.length > 0 ? 'Dernière inscription récemment.' : 'Aucune inscription récente.'}
                    </span>
                </div>
            </div>

            {/* ── Table header ── */}
            <div className={styles.tableHead}>
                <span>ABONNÉ</span>
                <span>DATE D'ADHÉSION</span>
                <span>ACTIONS</span>
            </div>

            {/* ── List ── */}
            <div className={styles.list}>
                {error && (
                    <div className={styles.error}>{error}</div>
                )}

                {!error && abonnes.length === 0 && !loading && (
                    <div className={styles.empty}>Aucun abonné pour le moment.</div>
                )}

                {abonnes.map((abonne) => (
                    <div key={abonne.id} className={styles.card}>
                        <div className={styles.subscriberInfo}>
                            <div className={styles.avatar}>{getInitial(abonne.email)}</div>
                            <div>
                                <p className={styles.emailText}>{abonne.email}</p>
                                <p className={styles.idLabel}>ID: #{abonne.id}</p>
                            </div>
                        </div>

                        <div className={styles.dateCell}>
                            <span>Membre depuis le</span>
                            <strong>{formatDate(abonne.dateAbonnement ?? abonne.created_at)}</strong>
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={styles.emailBtn}
                                onClick={() => handleEmail(abonne.email)}
                                title={`Envoyer un email à ${abonne.email}`}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M2 7l10 7 10-7" />
                                </svg>
                                Envoyer un Email
                            </button>
                            <button
                                className={styles.deleteBtn}
                                onClick={(e) => triggerDeletePopup(e, abonne)}
                                title="Supprimer cet abonné"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}