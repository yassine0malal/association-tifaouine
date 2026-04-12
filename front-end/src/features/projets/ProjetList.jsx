import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ProjectCard from "../../components/common/ProjectCard";
import ProjectCardSkeleton from "../../components/common/ProjectCardSkeleton";
import PageHero from "../../components/common/PageHero";
import Pagination from "../../components/common/Pagination";

import styles from "./projectList.module.css";
import heroImg from "../../assets/images/projects_hero.jpg";

import { fetchProjects, setPage, setFilter } from "./projectsSlice";
import i18n from "../../i18n";

export default function Projets() {
  const dispatch = useDispatch();
  const { t } = useTranslation("projects");

  const {
    data,
    loading,
    currentPage,
    totalPages,
    currentfilter,
  } = useSelector((state) => state.projects);

  const filters = [
    { key: "all", label: t("projects.filters.all") },
    { key: "completed", label: t("projects.filters.completed") },
    { key: "inProgress", label: t("projects.filters.inProgress") },
    { key: "pending", label: t("projects.filters.pending") },
  ];

  // 🔹 Fetch projects when page OR filter changes
  useEffect(() => {
    const lang = i18n.language || "fr";
    dispatch(fetchProjects({ page: currentPage, lang, filter: currentfilter }));
  }, [dispatch, currentPage, currentfilter, i18n.language]);

  // 🔹 Handlers
  const handleFilterChange = (filterKey) => {
    dispatch(setFilter(filterKey));
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  // 🔹 Render Filters
  const renderFilters = () =>
    filters.map(({ key, label }) => (
      <button
        key={key}
        onClick={() => handleFilterChange(key)}
        className={currentfilter === key ? styles.active : ""}
      >
        {label}
      </button>
    ));

  // 🔹 Render Project Cards
  const renderProjects = () => {
    if (loading) {
      return Array.from({ length: 6 }, (_, i) => (
        <ProjectCardSkeleton key={`skeleton-${i}`} />
      ));
    }

    if (!data || data.length === 0) {
      return <p>{t("projects.noProjects")}</p>;
    }

    return data.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ));
  };

  return (
    <div className={styles.projectList}>
      <PageHero heroImg={heroImg} title={t("projects.heroTitle")} />

      <div className={styles.projectsContainer}>
        <div className={styles.filterContainer}>
          <h2 className={styles.header}>{t("projects.viewProjects")}</h2>
          <div className={styles.filter}>{renderFilters()}</div>
        </div>

        <div className={styles.projects}>{renderProjects()}</div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}