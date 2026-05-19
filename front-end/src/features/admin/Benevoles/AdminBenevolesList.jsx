import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBenevolesAdmin, setPage, deleteBenevole } from "./benevolesAdminSlice";
import styles from "./Benevoles.module.css";
import Pagination from "../../../components/common/Pagination";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import BackButton from "../../../components/common/admin/BackButton";
import { FaEye, FaTrash, FaPlus } from "react-icons/fa";
import avatarPlaceholder from "../../../assets/images/admin/avatar_placeholder.png";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminBenevolesList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: benevoles, loading, currentPage, totalPages, total } = useSelector(
    (state) => state.benevolesAdmin
  );

  const [popup, setPopup] = useState({ open: false, id: null, name: "" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchBenevolesAdmin({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const getStatusClass = (status) => {
    return styles[`status-${status}`] || styles.statusBadge;
  };

  const handleDeleteClick = (id, name) => {
    setPopup({ open: true, id, name });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteBenevole(popup.id)).unwrap();
      setPopup({ open: false, id: null, name: "" });
      setMessage({ type: "success", text: "Bénévole supprimé avec succès." });
      setTimeout(() => setMessage(null), 3000);

      if (benevoles.length === 1 && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      } else {
        dispatch(fetchBenevolesAdmin({ page: currentPage, limit: 10 }));
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la suppression: " + error });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className={styles.container}>
      <BackButton />

      <header className={styles.header}>
        <h1 className={styles.title}>Candidatures & Bénévoles ({total ?? 0})</h1>
        <button className={styles.fab} onClick={() => navigate("/admin/benevoles/create")}>
          <FaPlus /> Ajouter un bénévole
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
            <p style={{ color: "var(--paragraph-color)" }}>Chargement des bénévoles...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Date d'adhésion</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {benevoles.map((benevole) => {
                return (
                  <tr key={benevole.id}>
                    <td>
                      <img
                        src={benevole.photo_profile ? `${BASE_BACK_END_URL}${benevole.photo_profile}` : avatarPlaceholder}
                        alt={benevole.nom}
                        className={styles.avatar}
                      />
                    </td>
                    <td>{benevole.nom || "N/A"}</td>
                    <td>{benevole.email || "N/A"}</td>
                    <td>{benevole.telephone || "N/A"}</td>
                    <td>{new Date(benevole.date_adhesion).toLocaleDateString("fr-FR")}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(benevole.status)}`}>
                        {benevole.status?.replace("_", " ") || "en attente"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionIcons}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => navigate(`/admin/benevoles/${benevole.id}`)}
                          title="Voir les détails"
                        >
                          <FaEye />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDeleteClick(benevole.id, benevole.nom)}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {benevoles.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    Aucun bénévole trouvé.
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
        onClose={() => setPopup({ open: false, id: null, name: "" })}
        onConfirm={confirmDelete}
        variant="danger"
        title="Supprimer ce bénévole ?"
        description="Voulez-vous vraiment supprimer ce bénévole ? Cette action est irréversible."
        detailLabel="Bénévole"
        detailValue={popup.name}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}
