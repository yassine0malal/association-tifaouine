import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaFileAlt, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaTag, FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import styles from "./Dons.module.css";
import { protectedApi } from "../Login/authService";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminDonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [don, setDon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchDon();
  }, [id]);

  const fetchDon = async () => {
    try {
      const response = await protectedApi.get(`/api/dons/${id}`);
      setDon(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération du don:", error);
      setMessage({ type: "error", text: "Erreur lors de la récupération du don." });
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatut) => {
    try {
      await protectedApi.patch(`/api/dons/${id}/statut`, { statut: newStatut });
      setMessage({ type: "success", text: "Statut mis à jour avec succès." });
      fetchDon();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour du statut." });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 20px", flexDirection: "column", gap: "16px" }}>
          <div className={styles.spinner}></div>
          <p style={{ color: "var(--paragraph-color)" }}>Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!don) return <div className={styles.container}><p>Don non trouvé.</p></div>;

  return (
    <div className={styles.container}>
      {message && (
        <div className={`${styles.message} ${message.type === "success" ? styles.msgSuccess : styles.msgError}`}>
          {message.type === "success" ? "✓" : "✗"} {message.text}
        </div>
      )}

      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/admin/dons")}>
          <FaArrowLeft /> Retour aux dons
        </button>
        <h1 className={styles.title}>Détails du Don #{don.id}</h1>
      </header>

      <div className={styles.detailGrid}>
        {/* Informations Donateur */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FaUser /> <h3>Donateur</h3>
          </div>
          <div className={styles.cardBody}>
            <p><strong><FaUser /> Nom:</strong> {don.nom_complet}</p>
            <p><strong><FaEnvelope /> Email:</strong> {don.email}</p>
            <p><strong><FaPhone /> Téléphone:</strong> {don.telephone || "N/A"}</p>
          </div>
        </div>

        {/* Détails du Don */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FaTag /> <h3>Informations du Don</h3>
          </div>
          <div className={styles.cardBody}>
            <p><strong>Type:</strong> <span className={styles.badge}>{don.type_don === 'financier' ? 'Financier' : 'Matériel'}</span></p>
            <p><strong>Destination:</strong> {don.type_destination === 'general' ? 'Général' : 'Spécifique'}</p>
            {don.type_destination === 'specifique' && (
              <p><strong>Projet:</strong> {don.Projet?.titre_fr || "Inconnu"}</p>
            )}
            <p><strong><FaCalendarAlt /> Date:</strong> {new Date(don.date_reception).toLocaleDateString()}</p>
            <p><strong>Statut:</strong> 
              <span className={`${styles.statusBadge} ${styles[`status-${don.statut}`]}`}>
                {don.statut}
              </span>
            </p>
          </div>
        </div>

        {/* Don Financier specifics */}
        {don.type_don === 'financier' && don.DonFinancier && (
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <div className={styles.cardHeader}>
              <FaFileAlt /> <h3>Détails Financiers & Reçu</h3>
            </div>
            <div className={styles.cardBody}>
              <p><strong>Montant:</strong> <span style={{fontWeight: '600', color: 'var(--accent-strong)', fontSize: '18px'}}>{don.DonFinancier.montant} {don.DonFinancier.devise || 'MAD'}</span></p>
              <p><strong>Référence transaction:</strong> {don.DonFinancier.ref_transaction || "N/A"}</p>
              
              <hr className={styles.divider} />
              
              <div className={styles.receiptSection}>
                {don.DonFinancier.recu ? (
                  <div className={styles.currentReceipt}>
                    <p>Un reçu est associé à ce don.</p>
                    <a 
                      href={`${BASE_BACK_END_URL}${don.DonFinancier.recu}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className={styles.downloadBtn}
                    >
                      <FaDownload /> Télécharger le reçu
                    </a>
                  </div>
                ) : (
                  <p className={styles.noReceipt}><FaExclamationTriangle /> Aucun reçu disponible pour ce don.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Don Materiel specifics */}
        {don.type_don === 'materiel' && don.DonMateriel && (
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <div className={styles.cardHeader}>
              <FaInfoCircle /> <h3>Détails du Matériel</h3>
            </div>
            <div className={styles.cardBody}>
              <p><strong>Description:</strong> {don.DonMateriel.description}</p>
              <p><strong>Quantité:</strong> {don.DonMateriel.quantite}</p>
              <p><strong>Date de décision:</strong> {don.DonMateriel.date_decision ? new Date(don.DonMateriel.date_decision).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        )}

        {/* Message */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <FaInfoCircle /> <h3>Message / Commentaire</h3>
          </div>
          <div className={styles.cardBody}>
            <p>{don.message || "Aucun message laissé par le donateur."}</p>
          </div>
        </div>

        {/* Actions sur le statut */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <FaCheckCircle /> <h3>Actions sur le Statut</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.actionButtons}>
              <button 
                onClick={() => handleStatusChange("traite")} 
                className={`${styles.statusBtn} ${styles.btnTraite}`}
                disabled={don.statut === "traite"}
              >
                Marquer comme Traité
              </button>
              <button 
                onClick={() => handleStatusChange("recu")} 
                className={`${styles.statusBtn} ${styles.btnRecu}`}
                disabled={don.statut === "recu"}
              >
                Marquer comme Reçu
              </button>
              <button 
                onClick={() => handleStatusChange("en_attente")} 
                className={`${styles.statusBtn} ${styles.btnAttente}`}
                disabled={don.statut === "en_attente"}
              >
                Mettre en Attente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
