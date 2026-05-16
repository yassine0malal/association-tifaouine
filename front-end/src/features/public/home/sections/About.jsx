import { Link } from "react-router-dom";
import styles from "./about.module.css";
import { useTranslation } from "react-i18next";
import about_img1 from "./../../../../assets/images/home/about1.jpeg"
import about_img2 from "./../../../../assets/images/home/about2.jpeg"

const stats = [
  { value: "500", suffix: "+", label: "Beneficiaries Supported" },
  { value: "25", suffix: "+", label: "Community Projects" },
  { value: "15", suffix: "+", label: "Partner Organizations" },
  { value: "10", suffix: "+", label: "Years of Community Impact" },
];

export default function AboutUs() {
  const { t , i18n } = useTranslation("home");
  const currentLang = i18n.language
  return (
    <section className={styles.section}>
      {/* Decorative geometric background */}
      <div className={styles.bgDecor} aria-hidden="true">
        <div className={styles.bgCircle} />
        <div className={styles.bgArc} />
        <div className={styles.bgDots} />
      </div>

      <div className={styles.container}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          <span className={styles.eyebrowText}>{t("about.eyebrow")}</span>
        </div>

        <div className={styles.row}>
          {/* Left column */}
          <div className={styles.col1}>
            <h1 className={styles.heading}>
              {t("about.title")}
            </h1>
            <p className={styles.body}>
              {t("about.description")}
            </p>
            <Link to={`/${currentLang}/nous`} className={styles.seeMore}>
              {t("about.cta")}
              <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Right column — images */}
          <div className={styles.col2}>
            <div className={styles.images}>
              <div className={styles.imageAccent} aria-hidden="true" />
              <div className={`${styles.image} ${styles.imageBack}`}>
                <img src={about_img1} alt="Community members working together" />
              </div>
              <div className={`${styles.image} ${styles.imageFront}`}>
                <img src={about_img2} alt="Youth education program" />
              </div>
              <div className={styles.imageBadge}>
                <span className={styles.badgeNumber}>10</span>
                <span className={styles.badgeLabel}>{t("about.imageBadge")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => {
            const statsTranslated = t("about.stats", { returnObjects: true });
            const label = Array.isArray(statsTranslated) && statsTranslated[i] 
              ? statsTranslated[i].label 
              : stat.label;

            return (
              <div className={styles.statItem} key={i} style={{ "--delay": `${i * 0.1}s` }}>
                <div className={styles.statValue}>
                  {stat.value}<span className={styles.statSuffix}>{stat.suffix}</span>
                </div>
                <div className={styles.statLabel}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}