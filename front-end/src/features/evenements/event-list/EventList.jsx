import styles from "./event-list.module.css";
import PageHero from "../../../components/common/PageHero";
import FilterButtons from "../../../components/common/FilterButtons";
import EventCard from "../../../components/common/EventCard";
import heroImg from "../../../assets/images/projects_hero.jpg";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../components/common/Pagination";
import EventCardSkeleton from "../../../components/common/EventCardSkeleton";
import { useEffect } from "react";
import { fetchEvents, setFilter, setPage } from "./eventsSlice";

function EventList() {
  const dispatch = useDispatch();

  const {
    data,
    loading,
    currentPage,
    totalPages,
    currentFilter,
    itemsPerPage,
  } = useSelector((state) => state.events);

  const filters = ["Tout", "Eau", "Agricultur", "Aid", "Ramadan"];

  useEffect(() => {
    dispatch(fetchEvents({ page: currentPage, filter: currentFilter }));
  }, [dispatch, currentPage, currentFilter]);

  const renderEvents = () => {

    if (loading) {
      return Array.from({ length: itemsPerPage }, (_, i) => (
        <EventCardSkeleton key={`skeleton-${i}`} />
      ));
    }

    return data.map((event) => <EventCard key={event.id} {...event} />);
  };

  const handleFilterChange = (filter) => {
    dispatch(setFilter(filter))
  };
  const handlePageChange = (page) => {
    dispatch(setPage(page))
  };
  return (
    <div className={styles.eventListPage}>
      <PageHero title="Ne manquez rien de nos nouveautés" heroImg={heroImg} />

      <div className={styles.eventListContainer}>
        <div className={styles.filtersContainer}>
          <h2>Au cœur de l’action</h2>
          <FilterButtons
            filters={filters}
            currentFilter={currentFilter}
            handleFilterChange={handleFilterChange}
          />
        </div>

        <div className={styles.eventList}>{renderEvents()}</div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default EventList;
