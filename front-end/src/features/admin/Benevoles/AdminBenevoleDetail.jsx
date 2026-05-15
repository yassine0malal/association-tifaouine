import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBenevoleById, updateBenevoleStatus, clearCurrentDetail } from "./benevolesAdminSlice";
import styles from "./Benevoles.module.css";
import { FaCheck, FaTimes, FaArrowLeft, FaDownload } from "react-icons/fa";
import avatarPlaceholder from "../../../assets/images/admin/avatar_placeholder.png";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminBenevoleDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentDetail: benevole, detailLoading } = useSelector(
    (state) => state.benevolesAdmin
  );

  useEffect(() => {
    dispatch(fetchBenevoleById(id));
    return () => {
      dispatch(clearCurrentDetail());
    };
  }, [dispatch, id]);

  const handleStatusChange = async (newStatus) => {
    if (window.confirm(`Voulez-vous vraiment changer le statut à ${newStatus} ?`)) {
      try {
        await dispatch(updateBenevoleStatus({ id, status: newStatus })).unwrap();
        alert("Statut mis à jour avec succès.");
      } catch (error) {
        alert("Erreur: " + error);
      }
    }
  };

  if (detailLoading || !benevole) {
    return <div className={styles.container}><p style={{ padding: "20px" }}>Chargement des détails...</p></div>;
  }

  const user = benevole;

  return (
    <div className={styles.container}>
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <img 
            src={benevole.photo_profile ? `${BASE_BACK_END_URL}${benevole.photo_profile}` : avatarPlaceholder} 
            alt="Profil" 
            className={styles.detailAvatar} 
          />
          <div className={styles.detailInfo}>
            <h2>{user.nom || "N/A"}</h2>
            <p>{user.email || "N/A"}</p>
            <span className={`${styles.statusBadge} ${styles[`status-${benevole.status}`]}`}>
              {benevole.status.replace("_", " ")}
            </span>
          </div>
          <button className={styles.backBtn} onClick={() => navigate("/admin/benevoles")}>
            <FaArrowLeft /> Retour
          </button>
        </div>

        <div className={styles.detailSection}>
          <h3>Informations Personnelles</h3>
          <div className={styles.detailGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Téléphone</span>
              <span className={styles.infoValue}>{benevole.telephone || "Non renseigné"}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Adresse</span>
              <span className={styles.infoValue}>{benevole.adresse || "Non renseignée"}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Date d'adhésion</span>
              <span className={styles.infoValue}>{new Date(benevole.date_adhesion).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailSection}>
          <h3>Détails du Bénévolat</h3>
          <div className={styles.detailGrid}>
            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
              <span className={styles.infoLabel}>Compétences</span>
              <span className={styles.infoValue}>{benevole.competences || "Aucune compétence spécifique renseignée"}</span>
            </div>
            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
              <span className={styles.infoLabel}>Motivation</span>
              <span className={styles.infoValue}>{benevole.motivation || "Non renseignée"}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Disponibilité</span>
              <span className={styles.infoValue}>{benevole.disponibilite !== 'null' ? benevole.disponibilite : "Non renseignée"}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailSection}>
          <h3>Documents Fournis</h3>
          <div className={styles.detailGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Carte d'identité nationale</span>
              {benevole.carte_identite ? (
                <a 
                  href={`${BASE_BACK_END_URL}${benevole.carte_identite}`} 
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
          </div>
        </div>

        <div className={styles.actionsBar}>
          <button 
            className={styles.acceptBtn} 
            onClick={() => handleStatusChange("actif")}
            disabled={benevole.status === "actif"}
          >
            <FaCheck /> Accepter la candidature
          </button>
          <button 
            className={styles.refuseBtn} 
            onClick={() => handleStatusChange("inactif")}
            disabled={benevole.status === "inactif"}
          >
            <FaTimes /> Refuser la candidature
          </button>
        </div>
      </div>
    </div>
  );
}
