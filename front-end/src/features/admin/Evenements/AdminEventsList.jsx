import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEventsAdmin, setPage, deleteEvent } from "./eventsAdminSlice";
import styles from "./Evenements.module.css";
import Pagination from "../../../components/common/Pagination";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminEventsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: events, loading, currentPage, totalPages, total } = useSelector(
    (state) => state.eventsAdmin
  );

  const [popup, setPopup] = useState({ open: false, id: null, title: "" });

  useEffect(() => {
    dispatch(fetchEventsAdmin({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handleDeleteClick = (id, title) => {
    setPopup({ open: true, id, title });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteEvent(popup.id)).unwrap();
      setPopup({ open: false, id: null, title: "" });
      
      if (events.length === 1 && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      } else {
        dispatch(fetchEventsAdmin({ page: currentPage, limit: 10 }));
      }
    } catch (error) {
      alert("Erreur: " + error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Événements ({total})</h1>
        <button className={styles.fab} onClick={() => navigate("/admin/evenements/create")}>
          <FaPlus /> Ajouter un événement
        </button>
      </header>

      <div className={styles.tableContainer}>
        {loading ? (
          <p style={{ padding: "20px" }}>Chargement...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image principale</th>
                <th>Titre (FR)</th>
                <th>Date</th>
                <th>Lieu</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>
                    {event.imagePrincipale && (
                      <img src={`${BASE_BACK_END_URL}${event.imagePrincipale.url}`} alt={event.titre_fr} />
                    )}
                  </td>
                  <td>{event.titre_fr}</td>
                  <td>{new Date(event.date_evenement).toLocaleDateString("fr-FR")}</td>
                  <td>{event.lieu_fr || "-"}</td>
                  <td>
                    <div className={styles.actionIcons}>
                      <button 
                        className={styles.actionBtn} 
                        onClick={() => navigate(`/admin/evenements/${event.id}/edit`)}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteClick(event.id, event.titre_fr)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    Aucun événement trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

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
