import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMembersAdmin, setPage } from "./membersAdminSlice";
import styles from "./Members.module.css";
import Pagination from "../../../components/common/Pagination";
import { FaEye } from "react-icons/fa";
import avatarPlaceholder from "../../../assets/images/admin/avatar_placeholder.png";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminMembersList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: members, loading, currentPage, totalPages, total } = useSelector(
    (state) => state.membersAdmin
  );

  useEffect(() => {
    dispatch(fetchMembersAdmin({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const getStatusClass = (status) => {
    return styles[`status-${status}`] || styles.statusBadge;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Candidatures & Membres ({total})</h1>
      </header>

      <div className={styles.tableContainer}>
        {loading ? (
          <p style={{ padding: "20px" }}>Chargement...</p>
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
                const user = member;
                return (
                  <tr key={member.id}>
                    <td>
                      <img 
                        src={member.photo_profile ? `${BASE_BACK_END_URL}${member.photo_profile}` : avatarPlaceholder} 
                        alt={user.nom} 
                        className={styles.avatar} 
                      />
                    </td>
                    <td>{user.nom || "N/A"}</td>
                    <td>{user.email || "N/A"}</td>
                    <td>{member.poste || "N/A"}</td>
                    <td>{new Date(member.date_adhesion).toLocaleDateString("fr-FR")}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(member.status)}`}>
                        {member.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={styles.actionBtn} 
                        onClick={() => navigate(`/admin/membre/${member.id}`)}
                        title="Voir les détails"
                      >
                        <FaEye />
                      </button>
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
    </div>
  );
}