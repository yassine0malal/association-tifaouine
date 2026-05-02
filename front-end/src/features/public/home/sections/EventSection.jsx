import styles from './EventSection.module.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Placeholder images — remplace par tes vraies images
const PLACEHOLDER = "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80";

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export default function EventSection({ t }) {
    const events = [
        {
            id: 1,
            titre_fr: "Festival de la Culture Amazighe",
            description_fr: "Une célébration vivante du patrimoine, de la musique et des traditions berbères au cœur du Haut Atlas.",
            image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
            date: "2025-06-14",
            lieu: "Marrakech",
            statut: "upcoming",
        },
        {
            id: 2,
            titre_fr: "Journée de l'Environnement",
            description_fr: "Plantation d'arbres, nettoyage des oueds et sensibilisation des jeunes aux enjeux climatiques locaux.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
            date: "2025-05-20",
            lieu: "Ouarzazate",
            statut: "ongoing",
        },
        {
            id: 3,
            titre_fr: "Formation en Agriculture Durable",
            description_fr: "Atelier pratique pour les agriculteurs locaux sur les techniques d'irrigation et de compostage.",
            image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
            date: "2025-04-10",
            lieu: "Tahannaout",
            statut: "done",
        },
        {
            id: 4,
            titre_fr: "Soirée de Collecte de Fonds",
            description_fr: "Gala annuel réunissant partenaires et donateurs pour financer nos projets communautaires.",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
            date: "2025-07-05",
            lieu: "Casablanca",
            statut: "upcoming",
        },
    ];

    const [featured, ...rest] = events;

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const statutLabel = {
        upcoming: { label: "À venir", cls: styles.tagUpcoming },
        ongoing: { label: "En cours", cls: styles.tagOngoing },
        done: { label: "Terminé", cls: styles.tagDone },
    };

    return (
        <section className={styles.section}>

            {/* ── Header ── */}
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>{t("event.title")}</h2>
                    <p className={styles.subtitle}>{t("event.subtitle")}</p>
                </div>
                <Link to="/fr/evenements" className={styles.viewAll}>
                    VOIR TOUS <ArrowIcon />
                </Link>
            </div>

            {/* ── Grid ── */}
            <div className={styles.grid}>

                {/* Grande carte à gauche */}
                {featured && (
                    <Link to={`/fr/evenements/${featured.id}`} className={`${styles.card} ${styles.cardFeatured}`}>
                        <img src={featured.image} alt={featured.titre_fr} className={styles.img} />
                        <div className={styles.overlay}>
                            <span className={`${styles.tag} ${statutLabel[featured.statut]?.cls}`}>
                                {/* {statutLabel[featured.statut]?.label} */}
                            </span>
                            <div className={styles.cardBody}>
                                <p className={styles.cardDate}>
                                    <span className={styles.calender}>
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 20 20" version="1.1">

                                            <title>calendar [#1322]</title>
                                            <desc>Created with Sketch.</desc>
                                            <defs>

                                            </defs>
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <g id="Dribbble-Light-Preview" transform="translate(-60.000000, -2319.000000)" fill="#fff">
                                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                                        <path d="M21.971246,2167 L5.99680511,2167 L5.99680511,2163.971 C5.99680511,2163.435 6.43111022,2163 6.96625399,2163 L7.99361022,2163 L7.99361022,2165 L9.99041534,2165 L9.99041534,2163 L17.9776358,2163 L17.9776358,2165 L19.9744409,2165 L19.9744409,2163 L20.9728435,2163 C21.5239617,2163 21.971246,2163.448 21.971246,2164 L21.971246,2167 Z M21.971246,2176 C21.971246,2176.55 21.5219649,2177 20.9728435,2177 L6.99520767,2177 C6.44408946,2177 5.99680511,2176.552 5.99680511,2176 L5.99680511,2169 L21.971246,2169 L21.971246,2176 Z M4.06389776,2176.761 C4.06389776,2177.865 5.02136581,2179 6.12360224,2179 L22.0980431,2179 C23.201278,2179 24,2177.979 24,2176.761 C24,2176.372 23.9680511,2164.36 23.9680511,2163.708 C23.9680511,2161.626 23.6875,2161 19.9744409,2161 L19.9744409,2159 L17.9776358,2159 L17.9776358,2161 L9.99041534,2161 L9.99041534,2159 L7.99361022,2159 L7.99361022,2161 L5.99680511,2161 C4.8985623,2161 4,2161.9 4,2163 L4.06389776,2176.761 Z" id="calendar-[#1322]">

                                                        </path>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </span>

                                    {formatDate(featured.date)} · {featured.lieu}
                                    </p>
                                <h3 className={styles.cardTitle}>{featured.titre_fr}</h3>
                                <p className={styles.cardDesc}>{featured.description_fr}</p>
                                <span className={styles.arrowBtn}><ArrowIcon /></span>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Petites cartes à droite */}
                <div className={styles.rightGrid}>

                    {rest[0] && (
                        <Link to={`/fr/evenements/${rest[0].id}`} className={`${styles.card} ${styles.cardTop}`}>
                            <img src={rest[0].image} alt={rest[0].titre_fr} className={styles.img} />
                            <div className={styles.overlay}>
                                <span className={`${styles.tag} ${statutLabel[rest[0].statut]?.cls}`}>
                                    {/* {statutLabel[rest[0].statut]?.label} */}
                                </span>
                                <div className={styles.cardBody}>
                                    <p className={styles.cardDate}>
                                        <span className={styles.calender}>
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 20 20" version="1.1">

                                            <title>calendar [#1322]</title>
                                            <desc>Created with Sketch.</desc>
                                            <defs>

                                            </defs>
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <g id="Dribbble-Light-Preview" transform="translate(-60.000000, -2319.000000)" fill="#fff">
                                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                                        <path d="M21.971246,2167 L5.99680511,2167 L5.99680511,2163.971 C5.99680511,2163.435 6.43111022,2163 6.96625399,2163 L7.99361022,2163 L7.99361022,2165 L9.99041534,2165 L9.99041534,2163 L17.9776358,2163 L17.9776358,2165 L19.9744409,2165 L19.9744409,2163 L20.9728435,2163 C21.5239617,2163 21.971246,2163.448 21.971246,2164 L21.971246,2167 Z M21.971246,2176 C21.971246,2176.55 21.5219649,2177 20.9728435,2177 L6.99520767,2177 C6.44408946,2177 5.99680511,2176.552 5.99680511,2176 L5.99680511,2169 L21.971246,2169 L21.971246,2176 Z M4.06389776,2176.761 C4.06389776,2177.865 5.02136581,2179 6.12360224,2179 L22.0980431,2179 C23.201278,2179 24,2177.979 24,2176.761 C24,2176.372 23.9680511,2164.36 23.9680511,2163.708 C23.9680511,2161.626 23.6875,2161 19.9744409,2161 L19.9744409,2159 L17.9776358,2159 L17.9776358,2161 L9.99041534,2161 L9.99041534,2159 L7.99361022,2159 L7.99361022,2161 L5.99680511,2161 C4.8985623,2161 4,2161.9 4,2163 L4.06389776,2176.761 Z" id="calendar-[#1322]">

                                                        </path>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                        </span>
                                         {formatDate(rest[0].date)} · {rest[0].lieu}
                                         
                                         </p>
                                    <h3 className={styles.cardTitle}>{rest[0].titre_fr}</h3>
                                    <p className={styles.cardDesc}>{rest[0].description_fr}</p>
                                    <span className={styles.arrowBtn}><ArrowIcon /></span>
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className={styles.bottomRow}>
                        {rest.slice(1).map((ev) => (
                            <Link key={ev.id} to={`/fr/evenements/${ev.id}`} className={`${styles.card} ${styles.cardBottom}`}>
                                <img src={ev.image} alt={ev.titre_fr} className={styles.img} />
                                <div className={styles.overlay}>
                                    <span className={`${styles.tag} ${statutLabel[ev.statut]?.cls}`}>
                                        {/* {statutLabel[ev.statut]?.label} */}
                                    </span>
                                    <div className={styles.cardBody}>
                                        <p className={styles.cardDate}>
                                            
                                            <span className={styles.calender}>
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 20 20" version="1.1">

                                            <title>calendar [#1322]</title>
                                            <desc>Created with Sketch.</desc>
                                            <defs>

                                            </defs>
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <g id="Dribbble-Light-Preview" transform="translate(-60.000000, -2319.000000)" fill="#fff">
                                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                                        <path d="M21.971246,2167 L5.99680511,2167 L5.99680511,2163.971 C5.99680511,2163.435 6.43111022,2163 6.96625399,2163 L7.99361022,2163 L7.99361022,2165 L9.99041534,2165 L9.99041534,2163 L17.9776358,2163 L17.9776358,2165 L19.9744409,2165 L19.9744409,2163 L20.9728435,2163 C21.5239617,2163 21.971246,2163.448 21.971246,2164 L21.971246,2167 Z M21.971246,2176 C21.971246,2176.55 21.5219649,2177 20.9728435,2177 L6.99520767,2177 C6.44408946,2177 5.99680511,2176.552 5.99680511,2176 L5.99680511,2169 L21.971246,2169 L21.971246,2176 Z M4.06389776,2176.761 C4.06389776,2177.865 5.02136581,2179 6.12360224,2179 L22.0980431,2179 C23.201278,2179 24,2177.979 24,2176.761 C24,2176.372 23.9680511,2164.36 23.9680511,2163.708 C23.9680511,2161.626 23.6875,2161 19.9744409,2161 L19.9744409,2159 L17.9776358,2159 L17.9776358,2161 L9.99041534,2161 L9.99041534,2159 L7.99361022,2159 L7.99361022,2161 L5.99680511,2161 C4.8985623,2161 4,2161.9 4,2163 L4.06389776,2176.761 Z" id="calendar-[#1322]">

                                                        </path>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                        </span>
                                            
                                             {formatDate(ev.date)} · {ev.lieu}</p>
                                        <h3 className={styles.cardTitleSm}>{ev.titre_fr}</h3>
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