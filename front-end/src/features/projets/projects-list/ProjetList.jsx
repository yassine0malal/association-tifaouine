import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProjectCard from "../../../components/common/ProjectCard";
import ProjectCardSkeleton from "../../../components/common/ProjectCardSkeleton";
import PageHero from "../../../components/common/PageHero";
import Pagination from "../../../components/common/Pagination";
import FilterButtons from "../../../components/common/FilterButtons";

import styles from "./projectList.module.css";
import heroImg from "../../../assets/images/projects_hero.jpg";

import { fetchProjects, setPage, setFilter } from "./projectsSlice";


export default function Projets() {
  const dispatch = useDispatch();

  const {
    data,
    loading,
    currentPage,
    totalPages,
    currentFilter,
    itemsPerPage,
  } = useSelector((state) => state.projects);

  const filters = ["All", "Terminé", "En cours", "En attente"];

  // 🔹 Fetch projects when page OR filter changes
  useEffect(() => {
    dispatch(fetchProjects({ page: currentPage, filter: currentFilter }));
  }, [dispatch, currentPage, currentFilter]);

  // 🔹 Handlers
  const handleFilterChange = (filter) => {
    dispatch(setFilter(filter));
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  console.log(itemsPerPage);

  // 🔹 Render Project Cards
  const renderProjects = () => {
    if (loading) {
      return Array.from({ length: itemsPerPage }, (_, i) => (
        <ProjectCardSkeleton key={`skeleton-${i}`} />
      ));
    }

    if (!data || data.length === 0) {
      return <p style={{ alignItems: "center" }}>No projects found.</p>;
    }

    return data.map((project) => <ProjectCard key={project.id} {...project} />);
  };

  return (
    <div className={styles.projectList}>
      <PageHero heroImg={heroImg} title="Découvrir nos projets" />

      <div className={styles.projectsContainer}>
        {/* 🔹 Filters */}
        <div className={styles.filterContainer}>
          <h2 className={styles.header}>Voir les projets</h2>
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
