import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBenevolesAdmin, setPage } from "./benevolesAdminSlice";
import styles from "./Benevoles.module.css";
import Pagination from "../../../components/common/Pagination";
import { FaEye } from "react-icons/fa";
import avatarPlaceholder from "../../../assets/images/admin/avatar_placeholder.png";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminBenevolesList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: benevoles, loading, currentPage, totalPages, total } = useSelector(
    (state) => state.benevolesAdmin
  );

  useEffect(() => {
    dispatch(fetchBenevolesAdmin({ page: currentPage, limit: 10 }));
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
        <h1 className={styles.title}>Candidatures Bénévoles ({total})</h1>
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
                <th>Téléphone</th>
                <th>Date d'adhésion</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {benevoles.map((benevole) => {
                const user = benevole;
                return (
                  <tr key={benevole.id}>
                    <td>
                      <img 
                        src={benevole.photo_profile ? `${BASE_BACK_END_URL}${benevole.photo_profile}` : avatarPlaceholder} 
                        alt={user.nom} 
                        className={styles.avatar} 
                      />
                    </td>
                    <td>{user.nom || "N/A"}</td>
                    <td>{user.email || "N/A"}</td>
                    <td>{benevole.telephone || "N/A"}</td>
                    <td>{new Date(benevole.date_adhesion).toLocaleDateString("fr-FR")}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(benevole.status)}`}>
                        {benevole.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={styles.actionBtn} 
                        onClick={() => navigate(`/admin/benevoles/${benevole.id}`)}
                        title="Voir les détails"
                      >
                        <FaEye />
                      </button>
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
    </div>
  );
}
