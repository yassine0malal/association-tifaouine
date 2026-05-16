import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDonsAdmin, setPage, updateDonStatus, deleteDon } from "./donsAdminSlice";
import styles from "./Dons.module.css";
import Pagination from "../../../components/common/Pagination";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import BackButton from "../../../components/common/admin/BackButton";
import { FaTrash, FaDownload, FaEye, FaPlus } from "react-icons/fa";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminDonsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: dons, loading, currentPage, totalPages, total } = useSelector(
    (state) => state.donsAdmin
  );

  const [popup, setPopup] = useState({ open: false, id: null, title: "" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchDonsAdmin({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handleStatusChange = async (id, newStatut) => {
    try {
      await dispatch(updateDonStatus({ id, statut: newStatut })).unwrap();
      setMessage({ type: "success", text: "Statut mis à jour avec succès." });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour du statut: " + error });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleDeleteClick = (id, title) => {
    setPopup({ open: true, id, title });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteDon(popup.id)).unwrap();
      setPopup({ open: false, id: null, title: "" });
      setMessage({ type: "success", text: "Don supprimé avec succès." });
      setTimeout(() => setMessage(null), 3000);

      if (dons.length === 1 && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      } else {
        dispatch(fetchDonsAdmin({ page: currentPage, limit: 10 }));
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur: " + error });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className={styles.container}>
      <BackButton />

      <header className={styles.header}>
        <h1 className={styles.title}>Dons ({total ?? 0})</h1>
        <button className={styles.fab} onClick={() => navigate("/admin/dons/create-materiel")}>
          <FaPlus /> Ajouter don matériel
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
            <p style={{ color: "var(--paragraph-color)" }}>Chargement des dons...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Donateur</th>
                <th>Type</th>
                <th>Date</th>
                <th>Montant / Description</th>
                <th>Projet Associé</th>
                <th>Reçu</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dons.map((don) => (
                <tr key={don.id}>
                  <td>
                    {don.nom_complet || "Inconnu"}
                    {don.email && <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{don.email}</div>}
                  </td>
                  <td>{don.type_don === 'financier' ? 'Financier' : 'Matériel'}</td>
                  <td>{new Date(don.date_reception).toLocaleDateString("fr-FR")}</td>
                  <td>
                    {don.type_don === 'financier'
                      ? <span style={{ fontWeight: '600', color: 'var(--accent-strong)' }}>{don.DonFinancier?.montant} {don.DonFinancier?.devise || 'MAD'}</span>
                      : don.DonMateriel?.description || "-"}
                  </td>
                  <td>{don.Projet ? don.Projet.titre_fr : "Général"}</td>
                  <td>
                    {don.DonFinancier?.recu ? (
                      <a href={`${BASE_BACK_END_URL}${don.DonFinancier.recu}`} target="_blank" rel="noreferrer" title="Télécharger le reçu">
                        <FaDownload color="var(--accent)" />
                      </a>
                    ) : "-"}
                  </td>
                  <td>
                    <select
                      className={`${styles.statusSelect} ${styles[`status-${don.statut}`]}`}
                      value={don.statut}
                      onChange={(e) => handleStatusChange(don.id, e.target.value)}
                    >
                      <option value="en_attente">En attente</option>
                      <option value="recu">Reçu</option>
                      <option value="traite">Traité</option>
                    </select>
                  </td>
                  <td>
                    <div className={styles.actionIcons}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => navigate(`/admin/dons/${don.id}`)}
                        title="Voir les détails"
                      >
                        <FaEye />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteClick(don.id, don.type_don === 'financier' ? `${don.DonFinancier?.montant} MAD` : don.DonMateriel?.description)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {dons.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    Aucun don trouvé.
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
        title="Supprimer ce don ?"
        description="Voulez-vous vraiment supprimer ce don ? Cette action est irréversible et supprimera également les données liées (reçus, etc.)."
        detailLabel="Détail du don"
        detailValue={popup.title}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}
