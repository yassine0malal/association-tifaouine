import { motion } from "framer-motion";
import styles from "./PartnerSection.module.css";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../../../../i18n";
import { useEffect, useState } from "react";
import { fetchPartenaires } from "../../about/partnerSlice";
import defaultImage from "../../../../assets/images/default-partner.png";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function Partner({ t }) {
    const lang = i18n.language;
    // Détection de la direction (rtl ou ltr)
    const isRtl = i18n.dir() === 'rtl'; 
    
    const { partenaires: partners, loading: partenairesLoading } = useSelector((state) => state.partenaires);
    const dispatch = useDispatch();
    
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        dispatch(fetchPartenaires({ lang }));
    }, [dispatch, lang]);

    const duplicatedPartners = partners ? [...partners, ...partners] : [];

    return (
        <section className={styles.partnerContainer} dir={isRtl ? "rtl" : "ltr"}>
            <div className={styles.header}>
                <h2>{t("partner.title")}</h2>
                <p>{t("partner.subtitle")}</p>
            </div>

            <div className={styles.partnerSection}>
                <div className={styles.textLabel}>
                    {t("partner.label")}
                </div>

                <div className={styles.sliderWrapper}>
                    <motion.div
                        className={styles.sliderTrack}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        animate={isPaused ? {} : {
                            // INVERSION : En RTL, on déplace vers la droite (50%), en LTR vers la gauche (-50%)
                            x: isRtl ? ["0%", "50%"] : ["0%", "-50%"],
                        }}
                        transition={{
                            ease: "linear",
                            duration: 120, 
                            repeat: Infinity,
                        }}
                    >
                        {duplicatedPartners.map((partner, index) => (
                            <div key={`${partner.id}-${index}`} className={styles.partnerLogo}>
                                <img
                                    src={partner.image ? `${BASE_BACK_END_URL}${partner.image}` : defaultImage}
                                    alt={partner.name}
                                    title={partner.name}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}