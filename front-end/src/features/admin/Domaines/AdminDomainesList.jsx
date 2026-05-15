import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDomainesAdmin, setPage, deleteDomaineAdmin } from "./domainesAdminSlice";
import styles from "./Domaines.module.css";
import Pagination from "../../../components/common/Pagination";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminDomainesList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: domaines, loading, currentPage, totalPages, total } = useSelector(
    (state) => state.domainesAdmin
  );

  const [popup, setPopup] = useState({ open: false, id: null, title: "" });

  useEffect(() => {
    dispatch(fetchDomainesAdmin({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handleDeleteClick = (id, title) => {
    setPopup({ open: true, id, title });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteDomaineAdmin(popup.id)).unwrap();
      setPopup({ open: false, id: null, title: "" });
      
      if (domaines.length === 1 && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      } else {
        dispatch(fetchDomainesAdmin({ page: currentPage, limit: 10 }));
      }
    } catch (error) {
      alert("Erreur: " + error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Domaines d'action ({total})</h1>
        <button className={styles.fab} onClick={() => navigate("/admin/domaines/create")}>
          <FaPlus /> Ajouter un domaine
        </button>
      </header>

      <div className={styles.tableContainer}>
        {loading ? (
          <p style={{ padding: "20px" }}>Chargement...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Icône</th>
                <th>Titre (FR)</th>
                <th>Titre (EN)</th>
                <th>Titre (AR)</th>
                <th>Projets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {domaines.map((domaine) => (
                <tr key={domaine.id}>
                  <td>
                    {domaine.icone && (
                      <img src={`${BASE_BACK_END_URL}${domaine.icone}`} alt={domaine.titre_fr} />
                    )}
                  </td>
                  <td>{domaine.titre_fr}</td>
                  <td>{domaine.titre_en}</td>
                  <td dir="rtl">{domaine.titre_ar}</td>
                  <td>{domaine.projectsCount || 0}</td>
                  <td>
                    <div className={styles.actionIcons}>
                      <button 
                        className={styles.actionBtn} 
                        onClick={() => navigate(`/admin/domaines/${domaine.id}/edit`)}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteClick(domaine.id, domaine.titre_fr)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {domaines.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    Aucun domaine trouvé.
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
        title="Supprimer ce domaine ?"
        description="Voulez-vous vraiment supprimer ce domaine ? Cette action est irréversible."
        detailLabel="Domaine ciblé"
        detailValue={popup.title}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}
