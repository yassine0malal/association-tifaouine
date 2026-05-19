import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaDownload, FaFileAlt, FaCalendarAlt, FaUser, FaTag, FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import styles from "./Dons.module.css";
import { protectedApi } from "../Login/authService";
import BackButton from "../../../components/common/admin/BackButton";

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
        <BackButton />
        <h1 className={styles.title}>Fiche du Don #{don.id}</h1>
      </header>

      <div className={styles.detailGrid}>
        {/* Informations Donateur */}
        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <FaUser /> <h3>Donateur</h3>
          </div>
          <div className={styles.detailBody}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Nom complet</span>
              <span className={styles.detailValue}>{don.nom_complet}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Adresse E-mail</span>
              <span className={styles.detailValue}>{don.email}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Téléphone</span>
              <span className={styles.detailValue}>{don.telephone || "Non renseigné"}</span>
            </div>
          </div>
        </div>

        {/* Détails du Don */}
        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <FaTag /> <h3>Détails du Don</h3>
          </div>
          <div className={styles.detailBody}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Nature du don</span>
              <span className={styles.detailValue}>
                <span className={styles.badge}>{don.type_don === 'financier' ? 'Financier' : 'Matériel'}</span>
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Type de destination</span>
              <span className={styles.detailValue}>{don.type_destination === 'general' ? 'Fonds Général' : 'Projet Spécifique'}</span>
            </div>
            {don.type_destination === 'specifique' && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Projet ciblé</span>
                <span className={styles.detailValue}>{don.Projet?.titre_fr || "Inconnu"}</span>
              </div>
            )}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Date de réception</span>
              <span className={styles.detailValue}>
                <FaCalendarAlt size={12} style={{ marginRight: '6px', color: 'var(--accent)' }} />
                {new Date(don.date_reception).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Don Financier specifics */}
        {don.type_don === 'financier' && don.DonFinancier && (
          <div className={`${styles.detailCard} ${styles.fullWidth}`}>
            <div className={styles.cardHeader}>
              <FaFileAlt /> <h3>Détails Financiers</h3>
            </div>
            <div className={styles.detailBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Montant du don</span>
                  <span className={styles.amountValue}>{don.DonFinancier.montant} {don.DonFinancier.devise || 'MAD'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Référence Transaction</span>
                  <span className={styles.detailValue}>{don.DonFinancier.ref_transaction || "N/A"}</span>
                </div>
              </div>

              <hr className={styles.divider} />

              <div className={styles.receiptSection}>
                <span className={styles.detailLabel} style={{ alignSelf: 'center', marginBottom: '8px' }}>Justificatif / Reçu</span>
                {don.DonFinancier.recu ? (
                  <div className={styles.currentReceipt}>
                    <p style={{ marginBottom: '15px', color: 'var(--paragraph-color)' }}>Un justificatif a été téléversé pour ce don.</p>
                    <a
                      href={`${BASE_BACK_END_URL}${don.DonFinancier.recu}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.downloadBtn}
                    >
                      <FaDownload /> Voir le document
                    </a>
                  </div>
                ) : (
                  <p className={styles.noReceipt}><FaExclamationTriangle /> Aucun justificatif disponible.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Don Materiel specifics */}
        {don.type_don === 'materiel' && don.DonMateriel && (
          <div className={`${styles.detailCard} ${styles.fullWidth}`}>
            <div className={styles.cardHeader}>
              <FaInfoCircle /> <h3>Spécifications du Matériel</h3>
            </div>
            <div className={styles.detailBody}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Description des articles</span>
                <span className={styles.detailValue}>{don.DonMateriel.description}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Quantité estimée</span>
                <span className={styles.detailValue}>{don.DonMateriel.quantite}</span>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        <div className={`${styles.detailCard} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <FaInfoCircle /> <h3>Message du donateur</h3>
          </div>
          <div className={styles.detailBody}>
            <p style={{ fontStyle: don.message ? 'normal' : 'italic', color: don.message ? 'inherit' : 'var(--paragraph-color)' }}>
              {don.message || "Aucun message particulier n'a été laissé."}
            </p>
          </div>
        </div>

        {/* Actions sur le statut */}
        <div className={`${styles.detailCard} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <FaCheckCircle /> <h3>Gestion du Statut</h3>
          </div>
          <div className={styles.detailBody}>
            <p className={styles.detailLabel} style={{ marginBottom: '10px' }}>Statut actuel : <span className={`${styles.statusBadge} ${styles[`status-${don.statut}`]}`}>{don.statut}</span></p>
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
                Remettre en Attente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
