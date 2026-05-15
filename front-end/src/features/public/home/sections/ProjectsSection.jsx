import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchProjects } from "../../../../features/projets/projects-list/projectsSlice";
import styles from "./projects-section.module.css";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function Projects() {
  const { t, i18n } = useTranslation("home");
  const { lang } = useParams();
  const dispatch = useDispatch();
  const currentLang = i18n.language
  
  const { data: projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects({ 
      page: 1, 
      lang: lang || i18n.language, 
      filter: "all", 
      limit: 6
    }));
  }, [dispatch, lang, i18n.language]);

  const displayProjects = projects?.slice(3, 6) || [];

  return (
    <section className={styles.section} aria-labelledby="projects-heading">
      <div className={styles.container}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>{t("projects.eyebrow")}</span>
            <h2 id="projects-heading" className={styles.title}>
              {t("projects.title")}<br />
              <span className={styles.titleItalic}>{t("projects.titleItalic")}</span>
            </h2>
          </div>
          <Link to={`/${lang || i18n.language}/projets`} className={styles.viewAll}>
            {t("projects.viewAll")}
            <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        </div>

        {/* ── States ── */}
        {loading && (
          <div className={styles.stateWrap} aria-live="polite">
            {[0, 1, 2].map((i) => (
              <div className={styles.skeleton} key={i} aria-hidden="true" />
            ))}
          </div>
        )}

        {error && (
          <div className={styles.stateWrap} role="alert">
            <p className={styles.errorMsg}>
              {t("projects.errorMsg")}
            </p>
          </div>
        )}

        {/* ── Cards grid ── */}
        {!loading && !error && displayProjects.length > 0 && (
          <div className={styles.grid}>
            {displayProjects.map((project, i) => (
              <ProjectCard key={project.id ?? i} project={project} index={i} lang={lang || i18n.language} />
            ))}
          </div>
        )}

        {!loading && !error && displayProjects.length === 0 && (
          <p className={styles.empty}>{t("projects.empty")}</p>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, lang }) {
  const { t } = useTranslation("home");
  
  const category = project.state || t("projects.categoryDefault");
  const title = project.title || "Untitled Project";
  const image = project.image ? `${BASE_BACK_END_URL}${project.image}` : `https://picsum.photos/seed/${index + 10}/800/600`;
  const id = project.id;

  return (
    <Link
      to={`/${lang}/projets/${id}`}
      className={styles.card}
      style={{ "--i": index }}
      aria-label={`${title} — ${category}`}
    >
      {/* Image fills the card */}
      <div className={styles.imgWrap}>
        <img src={image} alt={title} className={styles.img} loading="lazy" />
        <div className={styles.imgOverlay} aria-hidden="true" />
      </div>

      {/* Category badge top-left */}
      <span className={styles.badge}>{category}</span>

      {/* Bottom info */}
      <div className={styles.info}>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
    </Link>
  );
}