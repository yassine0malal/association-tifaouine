import styles from "./filter-buttons.module.css";

function FilterButtons({ currentFilter, filters, handleFilterChange }) {
  // 🔹 Render Filters
  const renderFilters = () =>
    filters.map((filter) => (
      <button
        key={filter}
        onClick={() => handleFilterChange(filter)}
        className={currentFilter === filter ? styles.active : ""}
      >
        {filter}
      </button>
    ));

  return <div className={styles.filter}>{renderFilters()}</div>;
}

export default FilterButtons;
