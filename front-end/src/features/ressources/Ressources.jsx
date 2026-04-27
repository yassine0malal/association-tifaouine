import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchRessources, setRessourcesPage, resetRessources } from "./ressourcesSlice";

import styles from "./Ressources.module.css";
import PageHero from "../../components/common/PageHero";
import heroImg from "../../assets/images/projects_hero.jpg";
import ai from "../../assets/icons/ai.png";
import document from "../../assets/icons/document.png";
import download from "../../assets/icons/dawnload.png";
import library from "../../assets/images/library.png";
import ShowMoreButton from "../../components/common/ShowMoreButton";
import i18n from "../../i18n";

export default function RessourcesPage() {
    const { t } = useTranslation("ressources");
    const currentLang = i18n.language || "fr";
    const {
        resources,
        featuredInsight,
        loading,
        error,
        itemsPerPage,
        currentPage,
        totalPages,
        nextPage,
        totalItems,
    } = useSelector((state) => state.ressources);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(resetRessources());
    }, [currentLang]);

    useEffect(() => {
        dispatch(fetchRessources({ page: currentPage, lang: currentLang }));
    }, [dispatch, currentPage, currentLang]);

    const handlePageChange = (page) => {
        if (!loading) {
            dispatch(setRessourcesPage({ page }));
        }
    };

    // Affichage pendant le chargement initial
    if (loading && !featuredInsight && resources.length === 0) {
        return (
            <div className={styles.ressourcesPage}>
                <PageHero title={t("ressources.heroTitle")} heroImg={heroImg} />
                <div className={styles.ressourcesContainer}>
                    <p>{t("ressources.loadingResources")}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.ressourcesPage}>
                <PageHero title={t("ressources.heroTitle")} heroImg={heroImg} />
                <div className={styles.ressourcesContainer}>
                    <p>{t("ressources.errorMessage", { error })}</p>
                </div>
            </div>
        );
    }

    // console.log(itemsPerPage * (currentPage-1) + resources.length, "item per page",itemsPerPage,"resources ,length",resources.length, "current one ",currentPage)
    return (
        <div className={styles.ressourcesPage}>
            <PageHero title={t("ressources.heroTitle")} heroImg={heroImg} />
            <div className={styles.ressourcesContainer}>
                <div className={styles.title}>
                    <h2>{t("ressources.featuredInsights")}</h2>
                </div>

                <div className={styles.bestRepportOrganigram}>
                    {/* -----Left----- */}
                    <div className={styles.leftSide}>
                        <img src={library} alt="library" />

                        <div className={styles.contentBestContainer}>
                            <div className={styles.text}>
                                <div className={styles.top}>
                                    <span>{featuredInsight?.category}</span>
                                    <span>{t("ressources.ourBestProject")}</span>
                                </div>
                                <h2>{featuredInsight?.title}</h2>
                                <p>{featuredInsight?.description}</p>
                            </div>
                            <div className={styles.bottomsDetails}>
                                <div className={styles.imagMetaData}>
                                    <img src={document} alt="document" />
                                    <p>
                                        {featuredInsight?.fileSize} {featuredInsight?.fileType}
                                    </p>
                                </div>
                                <div className={styles.downloadButtom}>
                                    <button>{t("ressources.download")}</button>
                                    {/* <img src={download} alt="" /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ------Right----- */}
                    <div className={styles.rightSide}>
                        <div className={styles.textContent}>
                            <img src={ai} alt="intelligent" />
                            <div className={styles.topLeft}>
                                <span>{t("ressources.guide")}</span>
                                <span>{t("ressources.collaborationText")}</span>
                            </div>
                            <h2>{t("ressources.rightSideTitle")}</h2>
                            <p>{t("ressources.rightSideDescription")}</p>
                        </div>
                        <button>{t("ressources.readFullReport")}</button>
                    </div>
                </div>

                {/* ------------------------Cards-------------------------- */}
                <div className={styles.rapportCards}>
                    <div className={styles.header}>
                        <h2>{t("ressources.resourceLibrary")}</h2>
                        <div className={styles.content}>
                            <p>
                                {t("ressources.showingItems", {
                                    count: itemsPerPage * (currentPage - 1) + resources.length,
                                    total: totalItems,
                                })}
                            </p>
                        </div>
                    </div>

                    {/* ----Card---- */}
                    <div className={styles.cardsContent}>
                        {resources.map((item) => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.imageWrapper} data-count={item.category}>
                                    <img src={item.imageUrl} alt={item.title} />
                                </div>
                                <div className={styles.footerCard}>
                                    <div className={styles.titles}>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>

                                    <div className={styles.bottomsDetailsCard}>
                                        <div className={styles.imagMetaDataCard}>
                                            <span>{item.fileSize}</span>{" "}
                                            <span>{item.fileType}</span>
                                        </div>
                                        <a href={item.downloadUrl} download>
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="" />
                                                </svg>
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