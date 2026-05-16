import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './dashboard.module.css';
import TreasuryCard from '../../../components/admin/TreasuryCard';
import { fetchDashboardStats } from './dashboardSlice';
import { ArrowUpRightIcon, CalendarIcon, MoneyIcon, NewsIcon } from '../AdminLayout/Sidebar/icons';

// ─── Helpers ───────────────────────────────────────────────

const formatMoney = (value) => {
    if (!value && value !== 0) return '—';
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K DH`;
    return `${value} DH`;
};

const formatDate = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
};

const getRoleBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
        case 'admin': return styles.roleAdmin;
        case 'membre': return styles.roleMembre;
        case 'benevole': return styles.roleBenevole;
        default: return styles.roleMembre;
    }
};

// ─── Component ─────────────────────────────────────────────

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stats, loading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    // Build stats cards from live data
    const statsData = [
        {
            title: "Total Projets",
            value: loading ? '…' : stats.total_projets,
            trend: "+ 5%",
            description: "Augmentation ce mois",
            icon: "arrow-up-right",
            highlight: true,
        },
        {
            title: "Total Événements",
            value: loading ? '…' : stats.total_evenements,
            trend: "+ 3%",
            description: "Augmentation ce mois",
            icon: "calendar",
        },
        {
            title: "Total Domaines",
            value: loading ? '…' : stats.total_domaines,
            trend: "+ 3%",
            description: "Augmentation ce mois",
            icon: "news",
        },
        {
            title: "Total Dons",
            value: loading ? '…' : formatMoney(stats.total_dons_financiers),
            trend: "+ 8%",
            description: "Augmentation ce mois",
            icon: "money",
        },
    ];

    const iconMap = {
        "arrow-up-right": <ArrowUpRightIcon />,
        "calendar": <CalendarIcon />,
        "news": <NewsIcon />,
        "money": <MoneyIcon />,
    };

    return (
        <div className={styles.dashboardAdminPage}>

            {/* ── Header ── */}
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <h1>Dashboard</h1>
                    <p>Plan, prioritize, and accomplish your tasks with ease.</p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={styles.addProjectBtn}
                        onClick={() => navigate('/admin/projets/create')}
                    >
                        <span>+</span> Ajouter Projet
                    </button>
                    <button
                        className={styles.addEventBtn}
                        onClick={() => navigate('/admin/evenements/create')}
                    >
                        <span>+</span> Ajouter Événement
                    </button>
                </div>
            </header>

            {error && (
                <div className={styles.error}>
                    Erreur : {error}
                </div>
            )}

            {/* ── Stats Cards ── */}
            <div className={styles.statsGrid}>
                {statsData.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.statCard} ${item.highlight ? styles.goldCard : ''}`}
                    >
                        <div className={styles.cardHeader}>
                            <span>{item.title}</span>
                            <div className={styles.iconCircle}>
                                {iconMap[item.icon]}
                            </div>
                        </div>
                        <div className={styles.cardValue}>{item.value}</div>
                        <div className={styles.footerCard}>
                            <div className={styles.cardTrend}>
                                <span className={styles.trend}>{item.trend}</span> {item.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Content ── */}
            <div className={styles.mainContent}>
                <section className={styles.tableSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Utilisateurs récents</h2>
                        <button
                            className={styles.showMore}
                            onClick={() => navigate('/admin/membres')}
                        >
                            <span>Voir plus</span> &gt;
                        </button>
                    </div>

                    {loading ? (
                        <p style={{ padding: '1rem', color: '#9c8f7e', fontFamily: 'sans-serif', fontSize: '0.88rem' }}>
                            Chargement…
                        </p>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.requestsTable}>
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Email</th>
                                        <th>Rôle</th>
                                        <th>Date d'inscription</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(stats.recent_users ?? []).map((user) => (
                                        <tr key={user.id}>
                                            <td data-label="Nom">{user.nom}</td>
                                            <td data-label="Email">{user.email}</td>
                                            <td data-label="Rôle">
                                                <span className={`${styles.statusBadge} ${getRoleBadgeClass(user.type)}`}>
                                                    {user.type}
                                                </span>
                                            </td>
                                            <td data-label="Date">{formatDate(user.created_at)}</td>
                                        </tr>
                                    ))}

                                    {!loading && stats.recent_users?.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', color: '#a09585', fontFamily: 'sans-serif', fontSize: '0.85rem' }}>
                                                Aucun utilisateur récent.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <TreasuryCard
                    totalDons={stats.total_dons_financiers}
                    totalBudget={stats.total_budget_projets}
                    totalBeneficiaires={stats.total_beneficiaires}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;