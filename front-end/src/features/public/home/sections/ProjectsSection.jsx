import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchProjects } from "../../../../features/projets/projects-list/projectsSlice";
import styles from "./projects-section.module.css";
import projet1 from "../../../../assets/images/home/projects/projet1.jpg"
import projet2 from "../../../../assets/images/home/projects/projet2.jpeg"
import projet3 from "../../../../assets/images/home/projects/projet3.jpg"

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

const projects = [
  {
    id: 9,
    title: "Projet Igran d'Asni",
    domain: "Développement agricole",
    image: projet1,
    state: "Terminé",
  },
  {
    id: 7,
    title: "Alimentation en eau potable du musée environnemental",
    domain: "Protection de l'environnement",
    image: projet2,
    state: "Terminé",
  },
  {
    id: 5,
    title: "Jardin d'enfants et école coranique",
    domain: "Éducation et formation",
    image: projet3,
    state: "Terminé",
  },
];

export default function Projects() {
  const { t, i18n } = useTranslation("home");
  const { lang } = useParams();
  const dispatch = useDispatch();
  const currentLang = i18n.language;

  const displayProjects = projects.map((project, index) => {
    const list = t("projects.list", { returnObjects: true });
    if (Array.isArray(list) && list[index]) {
      return {
        ...project,
        title: list[index].title,
        state: list[index].state,
        domain: list[index].domain,
      };
    }
    return project;
  });

  return (
    <section className={styles.section} aria-labelledby="projects-heading">
      <div className={styles.container}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>{t("projects.eyebrow")}</span>
            <h2 id="projects-heading" className={styles.title}>
              {t("projects.title")}
              <br />
              <span className={styles.titleItalic}>
                {t("projects.titleItalic")}
              </span>
            </h2>
          </div>
          <Link
            to={`/${lang || i18n.language}/projets`}
            className={styles.viewAll}
          >
            {t("projects.viewAll")}
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        {/* ── Cards grid ── */}
        {displayProjects.length > 0 && (
          <div className={styles.grid}>
            {displayProjects.map((project, i) => (
              <ProjectCard
                key={project.id ?? i}
                project={project}
                index={i}
                lang={lang || i18n.language}
              />
            ))}
          </div>
        )}

        {displayProjects.length === 0 && (
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
  const image = project.image
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
