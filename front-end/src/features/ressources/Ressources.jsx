import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // pour la langue (si i18n est utilisé)

import styles from "./Ressources.module.css";
import PageHero from "../../components/common/PageHero";
import heroImg from "../../assets/images/projects_hero.jpg";
import ai from "../../assets/icons/ai.png";
import document from "../../assets/icons/document.png";
import download from "../../assets/icons/dawnload.png";
import library from "../../assets/images/library.png";
import ShowMoreButton from "../../components/common/ShowMoreButton";

// Import des actions Redux
import { fetchRessources, setRessourcesPage } from "./ressourcesSlice";

export default function RessourcesPage() {
    const dispatch = useDispatch();
    const { i18n } = useTranslation(); // pour obtenir la langue active

    // Récupération de l'état depuis Redux
    const {
        resources,
        featuredInsight,
        loading,
        error,
        currentPage,
        totalPages,
        nextPage,
        totalItems,
    } = useSelector((state) => state.ressources);

    useEffect(() => {
        const lang = i18n.language || "fr";
        dispatch(fetchRessources({ project: null, page: currentPage, lang }));
    }, [dispatch, currentPage, i18n.language]);

    
    const handlePageChange = () => {
        if (nextPage) {
            dispatch(setRessourcesPage({ page: nextPage }));
        }
    };
// the place of the loader component
    if (loading && !featuredInsight  && resources.length === 0) {
        return (
            <div className={styles.ressourcesPage}>
                <PageHero title={"Our Resources"} heroImg={heroImg} />
                <div className={styles.ressourcesContainer}>
                    <p>Loading resources...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.ressourcesPage}>
                <PageHero title={"Our Resources"} heroImg={heroImg} />
                <div className={styles.ressourcesContainer}>
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.ressourcesPage}>
            <PageHero title={"Our Resources"} heroImg={heroImg} />
            <div className={styles.ressourcesContainer}>
                <div className={styles.title}>
                    <h2>Featured Insights</h2>
                </div>

                <div className={styles.bestRepportOrganigram}>
                    {/* -----Left----- */}
                    <div className={styles.leftSide}>
                        <img src={library} alt="library" />

                        <div className={styles.contentBestContainer}>
                            <div className={styles.text}>
                                <div className={styles.top}>
                                    <span>{featuredInsight?.category}</span>
                                    <span>Our best project</span>
                                </div>
                                <h2>{featuredInsight?.title}</h2>
                                <p>{featuredInsight?.description}</p>
                            </div>
                            <div className={styles.bottomsDetails}>
                                <div className={styles.imagMetaData}>
                                    <img src={document} alt="document" />
                                    <p>{featuredInsight?.fileSize} {featuredInsight?.fileType}</p>
                                </div>
                                <div className={styles.downloadButtom}>
                                    <button>Download</button>
                                    <img src={download} alt="" />
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* ------Right----- */}
                    <div className={styles.rightSide}>
                        <div className={styles.textContent}>
                            <img src={ai} alt="intelligent" />
                            <div className={styles.topLeft}>
                                <span>Guide</span>
                                <span>Collaboration: Discover how we work</span>
                            </div>
                            <h2>The 2024 State of Heritage Preservation Report</h2>
                            <p>
                                Discover how our association's grassroots initiatives are
                                preserving cultural wisdom across generations and building
                                stronger, more connected communities.
                            </p>
                        </div>
                        <button>Read Full Report</button>
                    </div>
                </div>

                {/* ------------------------Cards-------------------------- */}
                <div className={styles.rapportCards}>
                    <div className={styles.header}>
                        <h2>Resource Library</h2>
                        <div className={styles.content}>
                            <p>
                                Showing {resources.length} of {totalItems} items
                            </p>
                           
                        </div>
                    </div>

                    {/* ----Card---- */}
                    <div className={styles.cardsContent}>
                        {resources.map((item) => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.imageWrapper} data-count={"Document"}>
                                    <img src={item.imageUrl} alt={item.title} />
                                </div>
                                <div className={styles.footerCard}>
                                    <div className={styles.titles}>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                    <div className={styles.bottomsDetailsCard}>
                                        <div className={styles.imagMetaDataCard}>
                                            <span>{item.fileSize}</span> <span>{item.fileType}</span>
                                        </div>
                                        <a href={item.downloadUrl} download>
                                            <button>
                                                <img src={download} alt="download" />
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.loadMore}>
                        <ShowMoreButton
                            loading={loading}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}