import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMembersAdmin, setPage, deleteMember } from "./membersAdminSlice";
import styles from "./Members.module.css";
import Pagination from "../../../components/common/Pagination";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import { FaEye, FaTrash, FaArrowLeft, FaPlus } from "react-icons/fa";
import avatarPlaceholder from "../../../assets/images/admin/avatar_placeholder.png";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminMembersList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: members, loading, currentPage, totalPages, total } = useSelector(
    (state) => state.membersAdmin
  );

  const [popup, setPopup] = useState({ open: false, id: null, name: "" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchMembersAdmin({ page: currentPage, limit: 10 }));
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
      await dispatch(deleteMember(popup.id)).unwrap();
      setPopup({ open: false, id: null, name: "" });
      setMessage({ type: "success", text: "Membre supprimé avec succès." });
      setTimeout(() => setMessage(null), 3000);
      
      if (members.length === 1 && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      } else {
        dispatch(fetchMembersAdmin({ page: currentPage, limit: 10 }));
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la suppression: " + error });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate("/admin")}>
        <FaArrowLeft /> Retour au tableau de bord
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>Candidatures & Membres ({total ?? 0})</h1>
        <button className={styles.fab} onClick={() => navigate("/admin/membres/create")}>
          <FaPlus /> Ajouter un membre
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
            <p style={{ color: "var(--paragraph-color)" }}>Chargement des membres...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Poste</th>
                <th>Date d'adhésion</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                return (
                  <tr key={member.id}>
                    <td>
                      <img 
                        src={member.photo_profile ? `${BASE_BACK_END_URL}${member.photo_profile}` : avatarPlaceholder} 
                        alt={member.nom} 
                        className={styles.avatar} 
                      />
                    </td>
                    <td>{member.nom || "N/A"}</td>
                    <td>{member.email || "N/A"}</td>
                    <td>{member.poste || "N/A"}</td>
                    <td>{new Date(member.date_adhesion).toLocaleDateString("fr-FR")}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(member.status)}`}>
                        {member.status?.replace("_", " ") || "en attente"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionIcons}>
                        <button 
                          className={styles.actionBtn} 
                          onClick={() => navigate(`/admin/membres/${member.id}`)}
                          title="Voir les détails"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDeleteClick(member.id, member.nom)}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {members.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    Aucun membre trouvé.
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
        title="Supprimer ce membre ?"
        description="Voulez-vous vraiment supprimer ce membre ? Cette action est irréversible."
        detailLabel="Membre"
        detailValue={popup.name}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}