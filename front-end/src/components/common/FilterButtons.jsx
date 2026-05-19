import { useTranslation } from "react-i18next";
import styles from "./filter-buttons.module.css";

function FilterButtons({ currentFilter, filters, handleFilterChange }) {
  const { t } = useTranslation("projects")
  // 🔹 Render Filters
  const renderFilters = () =>
    filters.map((filter) => (
      <button
        key={filter.label}
        onClick={() => handleFilterChange(filter.value)}
        className={currentFilter === filter.value ? styles.active : ""}
      >
        {t(`projects.filters.${filter.label}`, filter.label)}
      </button>
    ));

  return <div className={styles.filter}>{renderFilters()}</div>;
}

export default FilterButtons;
