import PageHero from "../../components/common/PageHero";
import styles from "./partner.module.css";
import herImg from "../../assets/images/partners.jpg";
import defaultPartner from "../../assets/images/default-partner.png";
import lnk from "../../assets/icons/link.png";
import partner from "../../assets/icons/partner.png";
// import agr from "../../assets/images/partenaires/agriculture.png"; // unused
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef } from "react";
import i18n from "../../i18n";
import { useDispatch, useSelector } from "react-redux";
import { fetchPartners } from "./partnersSlice";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

import VanillaTilt from "vanilla-tilt"

export default function Partner() {
    const { t } = useTranslation("partners");
    const currentLang = i18n.language;
    const dispatch = useDispatch();
    const { setTitlRef } = useTilt(); // Plus besoin de cleanupAll ici

    const {
        partners,
        loading,
        error,
    } = useSelector((state) => state.partners);

    useEffect(() => {
        dispatch(fetchPartners({ lang: currentLang }));
    }, [dispatch, currentLang]);

    // 1. Solution pour le bouton : Utiliser un useCallback au lieu d'un useEffect
    const buttonCallbackRef = useCallback((element) => {
        if (element) {
            VanillaTilt.init(element, {
                max: 30,
                speed: 400,
                glare: false,
                'max-glare': 0.2,
                reverse: true
            });
        }
    }, []);

    // SUPPRIMÉ : Les deux useEffect qui cassaient votre code (celui du bouton et celui du cleanupAll)

    if (loading && partners.length === 0) {
        return (
            <div className={styles.fullContainerPartner}>
                <PageHero title={t("heroTitle")} heroImg={herImg} />
                <div className={styles.partnerContainer}>
                    <p>Loading partners...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.fullContainerPartner}>
                <PageHero title={t("heroTitle")} heroImg={herImg} />
                <div className={styles.partnerContainer}>
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }
    console.log("ach tari", partners)
    return (
        <div className={styles.fullContainerPartner}>
            <PageHero title={t("heroTitle")} heroImg={herImg} />
            <div className={styles.partnerContainer}>
                <div className={styles.header}>
                    <h1>{t("sectionTitle")}</h1>
                    <p>{t("sectionDescription")}</p>
                </div>

                {/* -----Partner Cards----- */}
                <div className={styles.parentCards} >
                    <div className={styles.partnerCards} >
                        {partners.map((partner) => (
                            <div key={partner.id} ref={(el) => setTitlRef(el, partner.id)} className={styles.element}>
                                <div className={styles.innerContainer}>
                                    <div className={styles.imageContainer}>
                                        <img
                                            src={partner.image ? `${BASE_BACK_END_URL}${partner.image}` : defaultPartner}
                                            alt={partner.name}
                                        />
                                    </div>

                                    <div className={styles.contentText}>
                                        <h3>{partner.name}</h3>
                                        <p>{partner.description}</p>
                                    </div>
                                </div>

                                <div className={styles.linkDetails}>
                                    <Link target="_blank" to={partner.site_web}>
                                        {t("visitWebsite")}
                                    </Link>
                                    <img src={lnk} alt="partner" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.bePartner}>
                    <h2>{t("becomePartner.title")}</h2>
                    <p>{t("becomePartner.description")}</p>
                    {/* On utilise la callback ref ici */}
                    <Link to={`/${currentLang}/contact`} ref={buttonCallbackRef}>
                        <button>
                            <span>{t("becomePartner.button")}</span>
                            <img src={partner} alt="" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function useTilt() {
    const tiltRefs = useRef(new Map());

    const cleanupTilt = useCallback((id) => {
        const element = tiltRefs.current.get(id);
        if (element && element.vanillaTilt) {
            element.vanillaTilt.destroy();
            tiltRefs.current.delete(id);
        }
    }, []);

    // 2. Solution pour les cartes : Gérer l'initialisation ET le nettoyage directement dans le setRef
    const setTitlRef = useCallback((element, id) => {
        if (element) {
            // Initialise uniquement si ça n'a pas déjà été fait
            if (!element.vanillaTilt) {
                VanillaTilt.init(element, {
                    max: 15,
                    speed: 400,
                    glare: false,
                    "max-glare": 0.2,
                    reverse: true,
                    "mouse-event-element": ".tilt-trigger"
                });
                tiltRefs.current.set(id, element);
            }
        } else {
            // Quand React démonte la carte, il appelle ref avec 'null'
            // C'est ici que l'on doit nettoyer !
            cleanupTilt(id);
        }
    }, [cleanupTilt]);

    return { setTitlRef };
}