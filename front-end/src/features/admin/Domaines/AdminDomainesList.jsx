import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDomainesAdmin, setPage, deleteDomaineAdmin } from "./domainesAdminSlice";
import styles from "./Domaines.module.css";
import Pagination from "../../../components/common/Pagination";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminDomainesList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: domaines, loading, currentPage, totalPages, total } = useSelector(
    (state) => state.domainesAdmin
  );

  const [popup, setPopup] = useState({ open: false, id: null, title: "" });
  const [message, setMessage] = useState(null);

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
      setMessage({ type: "success", text: "Domaine supprimé avec succès." });
      setTimeout(() => setMessage(null), 3000);
      
      if (domaines.length === 1 && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      } else {
        dispatch(fetchDomainesAdmin({ page: currentPage, limit: 10 }));
      }
    } catch (error) {
      // Handle FK constraint violation
      const errorMsg = typeof error === 'string' ? error : error?.message || "Erreur inconnue";
      if (errorMsg.includes("foreign key") || errorMsg.includes("constraint") || errorMsg.includes("projets") || errorMsg.includes("RESTRICT")) {
        setMessage({ type: "error", text: "Impossible de supprimer ce domaine car il contient des projets ou événements liés. Veuillez d'abord supprimer ou réassigner les projets/événements associés." });
      } else {
        setMessage({ type: "error", text: "Erreur: " + errorMsg });
      }
      setPopup({ open: false, id: null, title: "" });
      setTimeout(() => setMessage(null), 8000);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate("/admin")}>
        <FaArrowLeft /> Retour au tableau de bord
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>Domaines d'action ({total ?? 0})</h1>
        <button className={styles.fab} onClick={() => navigate("/admin/domaines/create")}>
          <FaPlus /> Ajouter un domaine
        </button>
      </header>

      {message && (
        <div className={`${styles.message} ${message.type === "success" ? styles.msgSuccess : styles.msgError}`}>
          {message.type === "success" ? "✓" : "✗"} {message.text}
        </div>
      )}

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 20px", flexDirection: "column", gap: "16px" }}>
            <div className={styles.spinner}></div>
            <p style={{ color: "var(--paragraph-color)" }}>Chargement des domaines...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Icône</th>
                <th>Nom (FR)</th>
                <th>Nom (EN)</th>
                <th>Nom (AR)</th>
                <th>Projets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {domaines.map((domaine) => (
                <tr key={domaine.id}>
                  <td>
                    {domaine.icone && (
                      <img 
                        src={`${BASE_BACK_END_URL}${domaine.icone}`} 
                        alt={domaine.nom_fr}
                        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                      />
                    )}
                  </td>
                  <td>{domaine.nom_fr}</td>
                  <td>{domaine.nom_en}</td>
                  <td dir="rtl">{domaine.nom_ar}</td>
                  <td>{domaine.nombre_projets_total ?? 0}</td>
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
                        onClick={() => handleDeleteClick(domaine.id, domaine.nom_fr)}
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
        description="Voulez-vous vraiment supprimer ce domaine ? Cette action est irréversible. La suppression échouera si des projets ou événements sont liés."
        detailLabel="Domaine ciblé"
        detailValue={popup.title}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}
