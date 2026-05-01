// import { useState } from "react";
// import styles from "./ProjectList.module.css";
// import {useNavigate} from"react-router-dom"
// import Pagination from "../../../components/common/Pagination";
// // Données de test basées sur votre image
// const MOCK_PROJECTS = [
//     {
//         id: 1,
//         titre: "Restauration des Kasbahs",
//         image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500", // Image d'illustration
//         statut: "EN COURS",
//         budget: "€245,000",
//         localisation: "Ouarzazate, MA"
//     },
//     {
//         id: 2,
//         titre: "Archives Textiles Vivantes",
//         image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500",
//         statut: "TERMINÉ",
//         budget: "€82,000",
//         localisation: "Fès, MA"
//     },
//     {
//         id: 3,
//         titre: "Archives Textiles Vivantes",
//         image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500",
//         statut: "TERMINÉ",
//         budget: "€82,000",
//         localisation: "Fès, MA"
//     },
//     {
//         id: 4,
//         titre: "Restauration des Kasbahs",
//         image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500", // Image d'illustration
//         statut: "EN COURS",
//         budget: "€245,000",
//         localisation: "Ouarzazate, MA"
//     },
//     {
//         id: 5,
//         titre: "Archives Textiles Vivantes",
//         image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500",
//         statut: "TERMINÉ",
//         budget: "€82,000",
//         localisation: "Fès, MA"
//     },
//     {
//         id: 6,
//         titre: "Archives Textiles Vivantes",
//         image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500",
//         statut: "TERMINÉ",
//         budget: "€82,000",
//         localisation: "Fès, MA"
//     }
// ];

// export default function AdminProjetsList() {
//     const navigate = useNavigate()
//     const [projects] = useState(MOCK_PROJECTS);

//     return (
//         <div className={styles.container}>
//             {/* --- HEADER --- */}
//             <header className={styles.header}>
//                 <h1 className={styles.mainTitle}>Registre des Projets</h1>
//                 <div className={styles.headerActions}>

//                 </div>
//             </header>

//             {/* --- STATS CARDS --- */}
//             <section className={styles.statsGrid}>

//                 <div className={styles.statCard}>
//                     <span className={styles.statLabel}>PROJETS TOTAUX</span>
//                     <div className={styles.statValue}>42
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20" height="20" viewBox="0 0 20 20">
//                             <g>
//                                 <path d="M2,9H9V2H2ZM4,4H7V7H4Zm7-2V9h7V2Zm5,5H13V4h3ZM2,18H9V11H2Zm2-5H7v3H4Zm7,5h7V11H11Zm2-5h3v3H13Z" />
//                             </g>
//                         </svg>
//                     </div>
//                 </div>
//                 <div className={styles.statCard}>
//                     <span className={styles.statLabel}>BUDGET ALLOUÉ</span>
//                     <div className={styles.statValue}>$1.2M <span className={styles.subText}>Allocated</span></div>
//                 </div>

//                 <div className={styles.statCard}>
//                     <span className={styles.statLabel}>Languages ACTIVES</span>
//                     <div className={styles.statValue}>+3 <span className={styles.iconCircle}>
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20" height="20" viewBox="0 0 512 512"><title>ionicons-v5-l</title><path d="M478.33,433.6l-90-218a22,22,0,0,0-40.67,0l-90,218a22,22,0,1,0,40.67,16.79L316.66,406H419.33l18.33,44.39A22,22,0,0,0,458,464a22,22,0,0,0,20.32-30.4ZM334.83,362,368,281.65,401.17,362Z" /><path d="M267.84,342.92a22,22,0,0,0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73,39.65-53.68,62.11-114.75,71.27-143.49H330a22,22,0,0,0,0-44H214V70a22,22,0,0,0-44,0V90H54a22,22,0,0,0,0,44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-31.41-41.68-43.08-68.65-43.17-68.87a22,22,0,0,0-40.58,17c.58,1.38,14.55,34.23,52.86,83.93.92,1.19,1.83,2.35,2.74,3.51-39.24,44.35-77.74,71.86-93.85,80.74a22,22,0,1,0,21.07,38.63c2.16-1.18,48.6-26.89,101.63-85.59,22.52,24.08,38,35.44,38.93,36.1a22,22,0,0,0,30.75-4.9Z" /></svg>
//                     </span>
//                     </div>
//                 </div>
//             </section>

//             {/* --- LIST HEADER --- */}
//             <div className={styles.listSectionHeader}>
//                 <div className={styles.titleGroup}>
//                     <h2 className={styles.sectionTitle}>Missions en cours</h2>
//                     <p className={styles.sectionSub}>Gérer et superviser la préservation du patrimoine vivant avec rigueur.</p>
//                 </div>
//             </div>
//             <div className={styles.divider}>
//             </div>
//             {/* --- PROJECTS GRID --- */}
//             <div className={styles.projectGrid}>
//                 {projects.map((project) => (
//                     <div key={project.id} className={styles.card}>
//                         <div className={styles.imageContainer}>
//                             <img src={project.image} alt={project.titre} className={styles.projectImg} />
//                             <span className={`${styles.badge} ${project.statut === 'TERMINÉ' ? styles.badgeDone : styles.badgeActive}`}>
//                                 {project.statut}
//                             </span>
//                         </div>
//                         <div className={styles.cardContent}>
//                             <div className={styles.cardHeader}>
//                                 <h3 className={styles.cardTitle}>{project.titre}</h3>
//                                 <div className={styles.actionIcons}>
//                                     <button className={styles.actionBtn} onClick={()=>{navigate(`/admin/projets/${project.id}/edit`)}}>
//                                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                             <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
//                                         </svg>
//                                     </button>
//                                     <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>
//                                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                             <path d="M3 6h18" />
//                                             <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className={styles.cardMeta}>
//                                 <div className={styles.metaItem}>
//                                     <span className={styles.metaLabel}>ALLOCATION BUDGET</span>
//                                     <span className={styles.metaValue}>{project.budget}</span>
//                                 </div>
//                                 <div className={styles.metaItem}>
//                                     <span className={styles.metaLabel}>LOCALISATION</span>
//                                     <span className={styles.metaValue}>{project.localisation}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//                 {/* <div className="container">
//                     <Pagination />
//                 </div> */}
//             </div>

//             {/* --- FAB --- */}
//             <button className={styles.fab} onClick={() => navigate("/admin/projets/create")}>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
//                 AJOUTER UN PROJET
//             </button>
//         </div>
//     );
// }





import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./ProjectList.module.css";
import Pagination from "../../../components/common/Pagination";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

// Import your Redux actions
import { fetchProjects, setPage, setFilter } from "./projectsSlice"

export default function AdminProjetsList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // --- GET DATA FROM REDUX ---
    const {
        data: projects,
        loading,
        currentPage,
        totalPages,
        currentFilter
    } = useSelector((state) => state.projects);

    // --- FETCH DATA ON MOUNT / PAGE CHANGE ---
    // Hardcoded 'fr' since you don't want the translation hook logic
    useEffect(() => {
        dispatch(fetchProjects({ 
            page: currentPage, 
            filter: currentFilter, 
            lang: "fr" 
        }));
    }, [dispatch, currentPage, currentFilter]);

    // --- HANDLERS ---
    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };
console.warn("proejcts  ===> ",projects,"currentPage ===> ",currentPage)
    return (
        <div className={styles.container}>
            {/* --- HEADER --- */}
            <header className={styles.header}>
                <h1 className={styles.mainTitle}>Registre des Projets</h1>
                <div className={styles.headerActions}></div>
            </header>

            {/* --- STATS CARDS --- */}
            <section className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>PROJETS TOTAUX</span>
                    <div className={styles.statValue}>
                        {projects.length}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20" height="20" viewBox="0 0 20 20">
                            <g>
                                <path d="M2,9H9V2H2ZM4,4H7V7H4Zm7-2V9h7V2Zm5,5H13V4h3ZM2,18H9V11H2Zm2-5H7v3H4Zm7,5h7V11H11Zm2-5h3v3H13Z" />
                            </g>
                        </svg>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>BUDGET ALLOUÉ</span>
                    <div className={styles.statValue}>$1.2M <span className={styles.subText}>Allocated</span></div>
                </div>

                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Languages ACTIVES</span>
                    <div className={styles.statValue}>+3 
                        <span className={styles.iconCircle}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20" height="20" viewBox="0 0 512 512">
                                <title>ionicons-v5-l</title>
                                <path d="M478.33,433.6l-90-218a22,22,0,0,0-40.67,0l-90,218a22,22,0,1,0,40.67,16.79L316.66,406H419.33l18.33,44.39A22,22,0,0,0,458,464a22,22,0,0,0,20.32-30.4ZM334.83,362,368,281.65,401.17,362Z" />
                                <path d="M267.84,342.92a22,22,0,0,0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73,39.65-53.68,62.11-114.75,71.27-143.49H330a22,22,0,0,0,0-44H214V70a22,22,0,0,0-44,0V90H54a22,22,0,0,0,0,44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-31.41-41.68-43.08-68.65-43.17-68.87a22,22,0,0,0-40.58,17c.58,1.38,14.55,34.23,52.86,83.93.92,1.19,1.83,2.35,2.74,3.51-39.24,44.35-77.74,71.86-93.85,80.74a22,22,0,1,0,21.07,38.63c2.16-1.18,48.6-26.89,101.63-85.59,22.52,24.08,38,35.44,38.93,36.1a22,22,0,0,0,30.75-4.9Z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </section>

            {/* --- LIST HEADER --- */}
            <div className={styles.listSectionHeader}>
                <div className={styles.titleGroup}>
                    <h2 className={styles.sectionTitle}>Missions en cours</h2>
                    <p className={styles.sectionSub}>Gérer et superviser la préservation du patrimoine vivant avec rigueur.</p>
                </div>
            </div>
            <div className={styles.divider}></div>

            {/* --- PROJECTS GRID --- */}
            <div className={styles.projectGrid}>
                {loading ? (
                    <p>Chargement...</p> 
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className={styles.card}>
                            <div className={styles.imageContainer}>
                                <img aria-label="loading" src={`${BASE_BACK_END_URL}${project.image}`} alt={project.title} className={styles.projectImg} />
                                <span className={`${styles.badge} ${project.statut === 'TERMINÉ' ? styles.badgeDone : styles.badgeActive}`}>
                                    {project.statut}
                                </span>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.cardTitle}>{project.title}</h3>
                                    <div className={styles.actionIcons}>
                                        <button className={styles.actionBtn} onClick={() => { navigate(`/admin/projets/${project.id}/edit`) }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                            </svg>
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.cardMeta}>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>ALLOCATION BUDGET</span>
                                        <span className={styles.metaValue}>{project.budget}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>LOCALISATION</span>
                                        <span className={styles.metaValue}>{project.localisation}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- PAGINATION --- */}
            <div className={styles.paginationWrapper}>
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                />
            </div>

            {/* --- FAB --- */}
            <button className={styles.fab} onClick={() => navigate("/admin/projets/create")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                AJOUTER UN PROJET
            </button>
        </div>
    );
}