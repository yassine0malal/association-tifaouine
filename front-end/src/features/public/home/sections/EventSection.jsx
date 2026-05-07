import styles from './EventSection.module.css';
import { Link } from 'react-router-dom';
import i18n from '../../../../i18n'; // chemin à adapter selon ton projet

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export default function EventSection({ t }) {
    const events = t("events", { returnObjects: true });

    const [featured, ...rest] = events;

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const statusClass = {
        upcoming: styles.tagUpcoming,
        ongoing: styles.tagOngoing,
        done: styles.tagDone,
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>{t("event.title")}</h2>
                    <p className={styles.subtitle}>{t("event.subtitle")}</p>
                </div>
                <Link to="/fr/evenements" className={styles.viewAll}>
                    {t("event.viewAll")} <ArrowIcon />
                </Link>
            </div>

            <div className={styles.grid}>
                {/* Grande carte à gauche */}
                {featured && (
                    <Link to={`/fr/evenements/${featured.id}`} className={`${styles.card} ${styles.cardFeatured}`}>
                        <img src={featured.image} alt={featured.titre} className={styles.img} />
                        <div className={styles.overlay}>
                            <span className={`${styles.tag} ${statusClass[featured.statut]}`}>
                                {t(`event.status.${featured.statut}`)}
                            </span>
                            <div className={styles.cardBody}>
                                <p className={styles.cardDate}>
                                    <span><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 20 20" version="1.1"><title>calendar [#1322]</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-60.000000, -2319.000000)" fill="#fff"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M21.971246,2167 L5.99680511,2167 L5.99680511,2163.971 C5.99680511,2163.435 6.43111022,2163 6.96625399,2163 L7.99361022,2163 L7.99361022,2165 L9.99041534,2165 L9.99041534,2163 L17.9776358,2163 L17.9776358,2165 L19.9744409,2165 L19.9744409,2163 L20.9728435,2163 C21.5239617,2163 21.971246,2163.448 21.971246,2164 L21.971246,2167 Z M21.971246,2176 C21.971246,2176.55 21.5219649,2177 20.9728435,2177 L6.99520767,2177 C6.44408946,2177 5.99680511,2176.552 5.99680511,2176 L5.99680511,2169 L21.971246,2169 L21.971246,2176 Z M4.06389776,2176.761 C4.06389776,2177.865 5.02136581,2179 6.12360224,2179 L22.0980431,2179 C23.201278,2179 24,2177.979 24,2176.761 C24,2176.372 23.9680511,2164.36 23.9680511,2163.708 C23.9680511,2161.626 23.6875,2161 19.9744409,2161 L19.9744409,2159 L17.9776358,2159 L17.9776358,2161 L9.99041534,2161 L9.99041534,2159 L7.99361022,2159 L7.99361022,2161 L5.99680511,2161 C4.8985623,2161 4,2161.9 4,2163 L4.06389776,2176.761 Z" id="calendar-[#1322]"></path></g></g></g></svg></span>
                                    {formatDate(featured.date)} · {featured.lieu}
                                </p>
                                <h3 className={styles.cardTitle}>{featured.titre}</h3>
                                <div className={styles.warperFooterEvent}>
                                    <p className={styles.cardDesc}>{featured.description}</p>
                                    <span className={styles.arrowBtn}><ArrowIcon /></span>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Petites cartes à droite */}
                <div className={styles.rightGrid}>

                    {/* Top small card (second event) */}
                    {rest[0] && (
                        <Link to={`/fr/evenements/${rest[0].id}`} className={`${styles.card} ${styles.cardTop}`}>
                            <img src={rest[0].image} alt={rest[0].titre} className={styles.img} />
                            <div className={styles.overlay}>
                                <span className={`${styles.tag} ${statusClass[rest[0].statut]}`}>
                                    {t(`event.status.${rest[0].statut}`)}
                                </span>
                                <div className={styles.cardBody}>
                                    <p className={styles.cardDate}>
                                        <span className={styles.calender}>
                                            {/* icône calendrier */}
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 20 20" version="1.1">
                                                <title>calendar [#1322]</title>
                                                <desc>Created with Sketch.</desc>
                                                <defs></defs>
                                                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                    <g id="Dribbble-Light-Preview" transform="translate(-60.000000, -2319.000000)" fill="#fff">
                                                        <g id="icons" transform="translate(56.000000, 160.000000)">
                                                            <path d="M21.971246,2167 L5.99680511,2167 L5.99680511,2163.971 C5.99680511,2163.435 6.43111022,2163 6.96625399,2163 L7.99361022,2163 L7.99361022,2165 L9.99041534,2165 L9.99041534,2163 L17.9776358,2163 L17.9776358,2165 L19.9744409,2165 L19.9744409,2163 L20.9728435,2163 C21.5239617,2163 21.971246,2163.448 21.971246,2164 L21.971246,2167 Z M21.971246,2176 C21.971246,2176.55 21.5219649,2177 20.9728435,2177 L6.99520767,2177 C6.44408946,2177 5.99680511,2176.552 5.99680511,2176 L5.99680511,2169 L21.971246,2169 L21.971246,2176 Z M4.06389776,2176.761 C4.06389776,2177.865 5.02136581,2179 6.12360224,2179 L22.0980431,2179 C23.201278,2179 24,2177.979 24,2176.761 C24,2176.372 23.9680511,2164.36 23.9680511,2163.708 C23.9680511,2161.626 23.6875,2161 19.9744409,2161 L19.9744409,2159 L17.9776358,2159 L17.9776358,2161 L9.99041534,2161 L9.99041534,2159 L7.99361022,2159 L7.99361022,2161 L5.99680511,2161 C4.8985623,2161 4,2161.9 4,2163 L4.06389776,2176.761 Z" id="calendar-[#1322]"></path>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                        </span>
                                        {formatDate(rest[0].date)} · {rest[0].lieu}
                                    </p>
                                    <h3 className={styles.cardTitle}>{rest[0].titre}</h3>
                                    <div className={styles.warperFooterEvent}>
                                        <p className={styles.cardDesc}>{rest[0].description}</p>
                                        <span className={styles.arrowBtn}><ArrowIcon /></span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Bottom row cards (third & fourth) */}
                    <div className={styles.bottomRow}>
                        {rest.slice(1).map((ev) => (
                            <Link key={ev.id} to={`/fr/evenements/${ev.id}`} className={`${styles.card} ${styles.cardBottom}`}>
                                <img src={ev.image} alt={ev.titre} className={styles.img} />
                                <div className={styles.overlay}>
                                    <span className={`${styles.tag} ${statusClass[ev.statut]}`}>
                                        {t(`event.status.${ev.statut}`)}
                                    </span>
                                    <div className={styles.cardBody}>
                                        <p className={styles.cardDate}>
                                            <span className={styles.calender}>
                                                {/* icône calendrier */}
                                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 20 20" version="1.1">
                                                    <title>calendar [#1322]</title>
                                                    <desc>Created with Sketch.</desc>
                                                    <defs></defs>
                                                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <g id="Dribbble-Light-Preview" transform="translate(-60.000000, -2319.000000)" fill="#fff">
                                                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                                                <path d="M21.971246,2167 L5.99680511,2167 L5.99680511,2163.971 C5.99680511,2163.435 6.43111022,2163 6.96625399,2163 L7.99361022,2163 L7.99361022,2165 L9.99041534,2165 L9.99041534,2163 L17.9776358,2163 L17.9776358,2165 L19.9744409,2165 L19.9744409,2163 L20.9728435,2163 C21.5239617,2163 21.971246,2163.448 21.971246,2164 L21.971246,2167 Z M21.971246,2176 C21.971246,2176.55 21.5219649,2177 20.9728435,2177 L6.99520767,2177 C6.44408946,2177 5.99680511,2176.552 5.99680511,2176 L5.99680511,2169 L21.971246,2169 L21.971246,2176 Z M4.06389776,2176.761 C4.06389776,2177.865 5.02136581,2179 6.12360224,2179 L22.0980431,2179 C23.201278,2179 24,2177.979 24,2176.761 C24,2176.372 23.9680511,2164.36 23.9680511,2163.708 C23.9680511,2161.626 23.6875,2161 19.9744409,2161 L19.9744409,2159 L17.9776358,2159 L17.9776358,2161 L9.99041534,2161 L9.99041534,2159 L7.99361022,2159 L7.99361022,2161 L5.99680511,2161 C4.8985623,2161 4,2161.9 4,2163 L4.06389776,2176.761 Z" id="calendar-[#1322]"></path>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </span>
                                            {formatDate(ev.date)} · {ev.lieu}
                                        </p>
                                        <h3 className={styles.cardTitleSm}>{ev.titre}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
}