import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProjectCard from "../../../components/common/ProjectCard";
import ProjectCardSkeleton from "../../../components/common/ProjectCardSkeleton";
import PageHero from "../../../components/common/PageHero";
import Pagination from "../../../components/common/Pagination";
import FilterButtons from "../../../components/common/FilterButtons";

import styles from "./projectList.module.css";
import heroImg from "../../../assets/images/heros/hero1.jpeg";

import { fetchProjects, setPage, setFilter } from "./projectsSlice";
import { useTranslation } from "react-i18next";

export default function Projets() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("projects");
  const projectsRef = useRef(null);
  const firstRender = useRef(true);
  const currentLang = i18n.language;
  const {
    data,
    loading,
    currentPage,
    totalPages,
    currentFilter,
    itemsPerPage,
  } = useSelector((state) => state.projects);

  const filters = [
    { label: "all", value: "all" },
    { label: "completed", value: "termine" },
    { label: "inProgress", value: "en_cours" },
    { label: "pending", value: "suspendu" },
    { label: "planned", value: "planifie" },
  ];

  // 🔹 Fetch projects when page OR filter changes
  useEffect(() => {
    dispatch(
      fetchProjects({
        page: currentPage,
        filter: currentFilter,
        lang: currentLang,
      }),
    );
    // scroll to projects section
    if(firstRender.current) {
      window.scrollTo(0,500);
      firstRender.current = false;
    }

  }, [dispatch, currentPage, currentFilter, currentLang]);

  // 🔹 Handlers
  const handleFilterChange = (filter) => {
    dispatch(setFilter(filter));
  };

  const handlePageChange = (page) => {
    projectsRef.current.scrollIntoView({ behavior: "smooth" });
    dispatch(setPage(page));
  };

  // 🔹 Render Project Cards
  const renderProjects = () => {
    if (loading) {
      return Array.from({ length: 9 }, (_, i) => (
        <ProjectCardSkeleton key={`skeleton-${i}`} />
      ));
    }

    if (!data || data.length === 0) {
      return <p style={{ alignItems: "center" }}>{t("projects.noProjects")}</p>;
    }

    return data.map((project) => <ProjectCard key={project.id} {...project} />);
  };

  return (
    <div className={styles.projectList} ref={projectsRef}>
      <PageHero heroImg={heroImg} title={t("projects.heroTitle")} />

      <div className={styles.projectsContainer}>
        {/* 🔹 Filters */}
        <div className={styles.filterContainer}>
          <h2 className={styles.header}>{t("projects.viewProjects")}</h2>
          <FilterButtons
            currentFilter={currentFilter}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>

        {/* 🔹 Projects */}
        <div className={styles.projects}>{renderProjects()}</div>

        {/* 🔹 Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
