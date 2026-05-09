import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMemberById, updateMemberStatus, clearCurrentDetail } from "./membersAdminSlice";
import styles from "./Members.module.css";
import { FaCheck, FaTimes, FaArrowLeft, FaDownload } from "react-icons/fa";
import avatarPlaceholder from "../../../assets/images/admin/avatar_placeholder.png";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminMemberDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentDetail: member, detailLoading } = useSelector(
    (state) => state.membersAdmin
  );

  useEffect(() => {
    dispatch(fetchMemberById(id));
    return () => {
      dispatch(clearCurrentDetail());
    };
  }, [dispatch, id]);

  const handleStatusChange = async (newStatus) => {
    if (window.confirm(`Voulez-vous vraiment changer le statut à ${newStatus} ?`)) {
      try {
        await dispatch(updateMemberStatus({ id, status: newStatus })).unwrap();
        alert("Statut mis à jour avec succès.");
      } catch (error) {
        alert("Erreur: " + error);
      }
    }
  };

  if (detailLoading || !member) {
    return <div className={styles.container}><p style={{ padding: "20px" }}>Chargement des détails...</p></div>;
  }

  const user = member;

  return (
    <div className={styles.container}>
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <img 
            src={member.photo_profile && member.photo_profile !== 'null' ? `${BASE_BACK_END_URL}${member.photo_profile}` : avatarPlaceholder} 
            alt="Profil" 
            className={styles.detailAvatar} 
          />
          <div className={styles.detailInfo}>
            <h2>{user.nom || "N/A"}</h2>
            <p>{user.email || "N/A"}</p>
            <span className={`${styles.statusBadge} ${styles[`status-${member.status}`]}`}>
              {member.status.replace("_", " ")}
            </span>
            {member.poste && <p style={{ marginTop: '8px', color: 'var(--text)', fontWeight: '600' }}>Poste : {member.poste}</p>}
          </div>
          <button className={styles.backBtn} onClick={() => navigate("/admin/membre")}>
            <FaArrowLeft /> Retour
          </button>
        </div>

        <div className={styles.detailSection}>
          <h3>Informations Personnelles</h3>
          <div className={styles.detailGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Téléphone</span>
              <span className={styles.infoValue}>{member.telephone || "Non renseigné"}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Adresse</span>
              <span className={styles.infoValue}>{member.adresse || "Non renseignée"}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Date d'adhésion</span>
              <span className={styles.infoValue}>{new Date(member.date_adhesion).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailSection}>
          <h3>Détails du Membre</h3>
          <div className={styles.detailGrid}>
            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
              <span className={styles.infoLabel}>Compétences</span>
              <span className={styles.infoValue}>{member.competences || "Aucune compétence spécifique renseignée"}</span>
            </div>
            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
              <span className={styles.infoLabel}>Motivation</span>
              <span className={styles.infoValue}>{member.motivation || "Non renseignée"}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailSection}>
          <h3>Documents Fournis</h3>
          <div className={styles.detailGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Carte d'identité nationale</span>
              {member.carte_identite ? (
                <a 
                  href={`${BASE_BACK_END_URL}${member.carte_identite}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className={styles.infoValue}
                  style={{ color: "var(--accent-strong)", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaDownload /> Télécharger la CIN
                </a>
              ) : (
                <span className={styles.infoValue}>Non fournie</span>
              )}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Curriculum Vitae (CV)</span>
              {member.cv ? (
                <a 
                  href={`${BASE_BACK_END_URL}${member.cv}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className={styles.infoValue}
                  style={{ color: "var(--accent-strong)", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaDownload /> Télécharger le CV
                </a>
              ) : (
                <span className={styles.infoValue}>Non fourni</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.actionsBar}>
          <button 
            className={styles.acceptBtn} 
            onClick={() => handleStatusChange("actif")}
            disabled={member.status === "actif"}
          >
            <FaCheck /> Accepter l'adhésion
          </button>
          <button 
            className={styles.refuseBtn} 
            onClick={() => handleStatusChange("inactif")}
            disabled={member.status === "inactif"}
          >
            <FaTimes /> Refuser / Suspendre
          </button>
        </div>
      </div>
    </div>
  );
}
