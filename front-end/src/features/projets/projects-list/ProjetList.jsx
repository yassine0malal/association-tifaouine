import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ProjectCard from "../../../components/common/ProjectCard";
import ProjectCardSkeleton from "../../../components/common/ProjectCardSkeleton";
import PageHero from "../../../components/common/PageHero";
import Pagination from "../../../components/common/Pagination";
import FilterButtons from "../../../components/common/FilterButtons";

import styles from "./projectList.module.css";
import heroImg from "../../../assets/images/projects_hero.jpg";

import { fetchProjects, setPage, setFilter } from "./projectsSlice";
import i18n from "../../../i18n";

export default function Projets() {
  const dispatch = useDispatch();
  const projectsRef = useRef(null);

  const { t } = useTranslation("projects");

  const {
    data,
    loading,
    currentPage,
    totalPages,
    currentFilter,
    itemsPerPage,
  } = useSelector((state) => state.projects);

  const filters = [
    { key: "all", label: t("projects.filters.all") },
    { key: "completed", label: t("projects.filters.completed") },
    { key: "inProgress", label: t("projects.filters.inProgress") },
    { key: "pending", label: t("projects.filters.pending") },
  ];

  // 🔹 Fetch projects when page OR filter changes
  const currentLang = i18n.language || "fr";

  useEffect(() => {
    dispatch(
      fetchProjects({
        page: currentPage,
        filter: currentFilter,
        lang: currentLang,
      }),
    );
  }, [dispatch, currentPage, currentFilter, currentLang]);


  // 🔹 Handlers
  const handleFilterChange = (filterKey) => {
    projectsRef.current.scrollIntoView({ behavior: "smooth" });
    dispatch(setFilter(filterKey));
  };

  const handlePageChange = (page) => {
    projectsRef.current.scrollIntoView({ behavior: "smooth" , block:"start"});
    dispatch(setPage(page));
  };

  console.log(itemsPerPage);
  // 🔹 Render Filters
  const renderFilters = () =>
    filters.map(({ key, label }) => (
      <button
        key={key}
        onClick={() => handleFilterChange(key)}
        className={currentFilter === key ? styles.active : ""}
      >
        {label}
      </button>
    ));

  // 🔹 Render Project Cards
  const renderProjects = () => {
    if (loading) {
      return Array.from({ length: itemsPerPage }, (_, i) => (
        <ProjectCardSkeleton key={`skeleton-${i}`} />
      ));
    }

    if (!data || data.length === 0) {
      return <p>{t("projects.noProjects")}</p>;
    }

    return data.map((project) => <ProjectCard key={project.id} {...project} />);
  };

  return (
    <div className={styles.projectList}>
      <PageHero heroImg={heroImg} title={t("projects.heroTitle")} />

      <div className={styles.projectsContainer} ref={projectsRef}>
        <div className={styles.filterContainer}>
          <h2 className={styles.header}>{t("projects.viewProjects")}</h2>
          <FilterButtons
            currentFilter={currentFilter}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>

        <div className={styles.projects}>
          {renderProjects()}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
