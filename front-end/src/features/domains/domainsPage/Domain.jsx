import styles from "./domain.module.css";
import asni from "../../../assets/images/heros/asni.png";
import PageHero from "../../../components/common/PageHero";

// Import des images
import agricultureImg from "../../../assets/images/domains/agriculture.png";
import eauImg from "../../../assets/images/domains/water.jpg";
import santeImg from "../../../assets/images/domains/sante.jpg";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../../../i18n";
import { fetchDomainsPage } from "./domainsPageSlice";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

// getting the images from the json file
// const images = import.meta.glob('../../../assets/images/domains/*.{png,jpg,jpeg}', { eager: true, as: 'url' });
// const getImageUrl = (relativePath) => {
//     const fileName = relativePath.split('/').pop();
//     const key = Object.keys(images).find(k => k.includes(fileName));
//     return key ? images[key] : '';
// };


export default function Domain() {
    const { id } = useParams();
    const cardRefs = useRef({});
    const { t } = useTranslation("domainsPage")
    const dispatch = useDispatch()
    const { data: domainsList, laoding } = useSelector((state) => state.domainsPage);
    useEffect(() => {
        if (id && cardRefs.current[id]) {

            setTimeout(() => {
                cardRefs.current[id].scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 300);
        }
    }, [id, domainsList]);
    // domainsList.map((element)=>(
    //     console.log("^^^^^^",BASE_BACK_END_URL+element.icone)
    // ))

    useEffect(() => {
        const lang = i18n.language || "fr";
        dispatch(fetchDomainsPage(lang))
    }, [dispatch, i18n.language])
    if (laoding) return <Loader />

    return (
        <div className={styles.fullContainer}>
            <PageHero title={t("heroTitle")} heroImg={asni} />
            <div className={styles.domainContainer}>
                <div className={styles.title}>
                    <p>{t("intro.overline")}</p>
                    <h1>{t("intro.title")}</h1>
                    <p>{t("intro.description")}</p>
                </div>

                {domainsList?.map((domaine) => (
                    <section key={domaine.id}>
                        <div
                            aria-label="loading"
                            className={styles.domainCard}
                            ref={(el) => (cardRefs.current[domaine.id] = el)}
                            style={{ '--bg-image': `url(${BASE_BACK_END_URL}${domaine.icone})` }}
                        >

                            <div className={styles.second}>
                                <p>{domaine.category}</p>
                                <h2>{domaine.nom}</h2>
                                <p>{domaine.description}</p>

                                <div className={styles.dDetails}>
                                    <div className={styles.subDetails}>
                                        <div className={styles.nbrProject}>
                                            <div className={`${styles.svgContainer} ${styles.fst}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" width={40}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                                </svg>
                                            </div>
                                            <div className={styles.nbr}>
                                                <p>{domaine.projets} {t("stats.projects")}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.subDetails}>
                                        <div className={styles.nbrProject}>
                                            <div className={`${styles.svgContainer} ${styles.snd}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" width={40}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                                </svg>
                                            </div>
                                            <div className={styles.nbr}>
                                                <p>{domaine.evenements} {t("stats.events")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
            <div className={styles.title}>
                <h1>{t("cta.title")}</h1>
                <p>{t("cta.description")}</p>
                <button>{t("cta.button")}</button>
            </div>

        </div>
    );
}