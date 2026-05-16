import styles from "./mission.module.css";
import { useTranslation } from "react-i18next";

const icons = [
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" key="icon-1">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" key="icon-2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" key="icon-3">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      <path d="M12 8v4M10 10h4" opacity=".5"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" key="icon-4">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
      <path d="M13 13l6 6"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" key="icon-5">
      <path d="M6.5 6.5s1.5-2 5.5-2 5.5 2 5.5 2"/>
      <path d="M3 12s2-3 9-3 9 3 9 3"/>
      <path d="M6.5 17.5s1.5 2 5.5 2 5.5-2 5.5-2"/>
      <path d="M12 9v6"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" key="icon-6">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
];

export default function Mission() {
  const { t } = useTranslation("home");
  const translatedValues = t("mission.values", { returnObjects: true }) || [];

  return (
    <section className={styles.section} aria-labelledby="mission-heading">

      {/* Decorative shapes */}
      <div className={styles.decorCircle} aria-hidden="true" />
      <div className={styles.decorRing} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            {t("mission.eyebrow")}
          </div>
          <h2 id="mission-heading" className={styles.title}>
            {t("mission.title")}<br />
            <span className={styles.titleAccent}>{t("mission.titleAccent")}</span>
          </h2>
          <p className={styles.subtitle}>
            {t("mission.subtitle")}
          </p>
        </div>

        {/* Values grid */}
        <div className={styles.grid}>
          {translatedValues.map((v, i) => (
            <article
              className={styles.card}
              key={i}
              style={{ "--i": i }}
            >
              <div className={styles.iconWrap}>{icons[i % icons.length]}</div>
              <h3 className={styles.cardTitle}>{v.title}</h3>
              <p className={styles.cardDesc}>{v.desc}</p>
              <div className={styles.cardLine} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}