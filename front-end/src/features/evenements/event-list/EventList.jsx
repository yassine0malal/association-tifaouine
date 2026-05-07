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
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";


function EventList() {
  const dispatch = useDispatch();
  const { t } = useTranslation("events");
  const { events, domains } = useSelector((state) => state);

  const {
    loading,
    currentPage,
    totalPages,
    currentFilter,
    itemsPerPage,
  } = events;

  const filters = domains.data.map( domain => ({ key:domain.id , label:domain.label }) )
  const currentLang = i18n.language || 'fr';

  useEffect(() => {
    dispatch(
      fetchEvents({
        page: currentPage,
        filter: currentFilter,
        lang: currentLang,
      }),
    );
  }, [dispatch, currentPage, currentFilter, currentLang]);

  const renderEvents = () => {
    if (loading) {
      return Array.from({ length: itemsPerPage }, (_, i) => (
        <EventCardSkeleton key={`skeleton-${i}`} />
      ));
    }

    return events.data.map((event) => <EventCard key={event.id} {...event} />);
  };

  const handleFilterChange = (filter) => {
    dispatch(setFilter(filter));
  };
  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };
  return (
    <div className={styles.eventListPage}>
      <PageHero title={t("events.hero.title")} heroImg={heroImg} />

      <div className={styles.eventListContainer}>
        <div className={styles.filtersContainer}>
          <h2>{t("events.section_title")}</h2>
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
