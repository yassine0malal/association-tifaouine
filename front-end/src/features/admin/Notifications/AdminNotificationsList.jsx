import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './AdminNotificationsList.module.css';
import {
    fetchNotifications,
    markNotificationAsRead,
    markAllAsRead,
} from './adminNotificationsSlice';
import BackButton from '../../../components/common/admin/BackButton';

// ─── Type config ───────────────────────────────────────────
// Maps each notification type to a badge label, icon, accent color, and route
const TYPE_CONFIG = {
    NOUVEAU_CONTACT: {
        label: 'Contact',
        color: '#c9a96e',
        route: '/admin/messages',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    NOUVEL_ABONNE: {
        label: 'Abonné',
        color: '#4a7c59',
        route: '/admin/subscription',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
            </svg>
        ),
    },
    NOUVEAU_MEMBRE: {
        label: 'Membre',
        color: '#5a7eb5',
        route: '/admin/membres',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    NOUVEAU_BENEVOLE: {
        label: 'Bénévole',
        color: '#9b6b9b',
        route: '/admin/benevoles',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
};

const DEFAULT_CONFIG = {
    label: 'Notification',
    color: '#888',
    route: null,
    icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    ),
};

// ─── Helpers ───────────────────────────────────────────────
const getConfig = (type) => TYPE_CONFIG[type] || DEFAULT_CONFIG;

const timeAgo = (isoString) => {
    if (!isoString) return '';
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "à l'instant";
    if (mins < 60) return `il y a ${mins} min`;
    if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (days < 7) return `il y a ${days} jour${days > 1 ? 's' : ''}`;

    return new Date(isoString).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

// ─── Component ─────────────────────────────────────────────
export default function AdminNotificationsList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, unreadCount, loading, error } = useSelector(
        (state) => state.adminNotifications
    );

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleClick = (notification) => {
        // Mark as read if not already
        if (!notification.status) {
            dispatch(markNotificationAsRead(notification.id));
        }
        // Navigate to the relevant admin section
        const config = getConfig(notification.type);
        if (config.route) {
            navigate(config.route);
        }
    };

    const handleMarkAllRead = () => {
        dispatch(markAllAsRead());
    };

    if (loading && notifications.length === 0) {
        return (
            <div className={styles.container}>
                <p className={styles.loadingText}>Chargement des notifications…</p>
            </div>
        );
    }

    const unread = notifications.filter((n) => !n.status);
    const read = notifications.filter((n) => n.status);

    return (
        <div className={styles.container}>
            {/* ── Header ── */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <BackButton />
                    <h1 className={styles.title}>
                        Notifications
                        {unreadCount > 0 && (
                            <span className={styles.badge}>{unreadCount}</span>
                        )}
                    </h1>
                    <p className={styles.subtitle}>
                        {unreadCount > 0
                            ? `Vous avez ${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''} mise${unreadCount > 1 ? 's' : ''} à jour aujourd'hui.`
                            : 'Tout est à jour.'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button className={styles.markAllBtn} onClick={handleMarkAllRead}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 12L11.9497 16.9497L22.5572 6.34326M2.0498 12.0503L6.99955 17M17.606 6.39355L12.3027 11.6969" />
                        </svg>
                        Marquer tout comme lu
                    </button>
                )}
            </header>

            {error && <div className={styles.error}>{error}</div>}

            {notifications.length === 0 && !loading && (
                <div className={styles.empty}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <p>Aucune notification pour le moment.</p>
                </div>
            )}

            {/* ── Unread ── */}
            {unread.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Nouvelles</h2>
                    <div className={styles.list}>
                        {unread.map((n) => (
                            <NotificationCard
                                key={n.id}
                                notification={n}
                                onClick={handleClick}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Read ── */}
            {read.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Précédentes</h2>
                    <div className={styles.list}>
                        {read.map((n) => (
                            <NotificationCard
                                key={n.id}
                                notification={n}
                                onClick={handleClick}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

// ─── NotificationCard ───────────────────────────────────────
function NotificationCard({ notification, onClick }) {
    const config = getConfig(notification.type);
    const isUnread = !notification.status;

    return (
        <div
            className={`${styles.card} ${isUnread ? styles.unread : ''}`}
            onClick={() => onClick(notification)}
            style={{ '--accent': config.color }}
        >
            {/* Icon */}
            <div className={styles.iconWrap} style={{ background: `${config.color}18`, color: config.color }}>
                {config.icon}
            </div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.cardTop}>
                    <span className={styles.typeBadge} style={{ color: config.color, background: `${config.color}15` }}>
                        {config.label}
                    </span>
                    <span className={styles.time}>{timeAgo(notification.createdAt ?? notification.created_at)}</span>
                </div>
                <p className={styles.message}>{notification.message}</p>
            </div>

            {/* Unread dot */}
            {isUnread && <span className={styles.dot} style={{ background: config.color }} />}
        </div>
    );
}