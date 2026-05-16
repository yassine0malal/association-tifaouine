import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEventsAdmin, setPage, deleteEvent } from "./eventsAdminSlice";
import styles from "./Evenements.module.css";
import Pagination from "../../../components/common/Pagination";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import Loader from "../../../components/common/Loader";
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminEventsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: events, loading, currentPage, totalPages, total } = useSelector(
    (state) => state.eventsAdmin
  );

  const [popup, setPopup] = useState({ open: false, id: null, title: "" });

  useEffect(() => {
    dispatch(fetchEventsAdmin({ page: currentPage, limit: 12 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handleDeleteClick = (e, id, title) => {
    e.stopPropagation();
    setPopup({ open: true, id, title });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteEvent(popup.id)).unwrap();
      setPopup({ open: false, id: null, title: "" });
      
      if (events.length === 1 && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      } else {
        dispatch(fetchEventsAdmin({ page: currentPage, limit: 12 }));
      }
    } catch (error) {
      alert("Erreur: " + error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Back button */}
      <button className={styles.backBtn} onClick={() => navigate("/admin")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "8px" }}>
          <path d="m15 18-6-6 6-6" />
        </svg>
        Retour au tableau de bord
      </button>

      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.mainTitle}>Registre des Événements</h1>
          <p className={styles.subtitle}>Consultez et gérez tous les événements ({total || 0})</p>
        </div>
      </header>

      {loading ? (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      ) : (
        <>
          <div className={styles.projectGrid}>
            {events.map((event) => (
              <div
                key={event.id}
                className={styles.card}
                onClick={() => navigate(`/admin/evenements/${event.id}/edit`)}
              >
                <div className={styles.imageContainer}>
                  {event.image_principale ? (
                    <img
                      src={`${BASE_BACK_END_URL}${event.image_principale}`}
                      alt={event.titre_fr}
                      className={styles.projectImg}
                    />
                  ) : (
                    <div className={styles.noImage}>Pas d'image</div>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{event.titre_fr}</h3>
                    <div className={styles.actionIcons}>
                      <button
                        className={styles.actionBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/evenements/${event.id}/edit`);
                        }}
                        title="Modifier"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={(e) => handleDeleteClick(e, event.id, event.titre_fr)}
                        title="Supprimer"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}><FaCalendarAlt size={10} /> DATE</span>
                      <span className={styles.metaValue}>
                        {event.date_debut
                          ? new Date(event.date_debut).toLocaleDateString("fr-FR")
                          : "-"}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}><FaMapMarkerAlt size={10} /> LIEU</span>
                      <span className={styles.metaValue}>{event.lieu || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className={styles.emptyState}>
              Aucun événement trouvé.
            </div>
          )}
        </>
      )}

      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* FAB */}
      <button className={styles.fab} onClick={() => navigate("/admin/evenements/create")}>
        <FaPlus /> AJOUTER UN ÉVÉNEMENT
      </button>

      <ConfirmPopup
        isOpen={popup.open}
        onClose={() => setPopup({ open: false, id: null, title: "" })}
        onConfirm={confirmDelete}
        variant="danger"
        title="Supprimer cet événement ?"
        description="Voulez-vous vraiment supprimer cet événement ? Toutes les images associées seront également supprimées."
        detailLabel="Événement ciblé"
        detailValue={popup.title}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}
