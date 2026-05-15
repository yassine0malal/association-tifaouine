import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonsAdmin, setPage, updateDonStatus, deleteDon } from "./donsAdminSlice";
import styles from "./Dons.module.css";
import Pagination from "../../../components/common/Pagination";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import { FaTrash, FaDownload } from "react-icons/fa";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminDonsList() {
  const dispatch = useDispatch();
  const { data: dons, loading, currentPage, totalPages, total } = useSelector(
    (state) => state.donsAdmin
  );

  const [popup, setPopup] = useState({ open: false, id: null, title: "" });

  useEffect(() => {
    dispatch(fetchDonsAdmin({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateDonStatus({ id, status: newStatus })).unwrap();
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut: " + error);
    }
  };

  const handleDeleteClick = (id, title) => {
    setPopup({ open: true, id, title });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteDon(popup.id)).unwrap();
      setPopup({ open: false, id: null, title: "" });
      
      if (dons.length === 1 && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      } else {
        dispatch(fetchDonsAdmin({ page: currentPage, limit: 10 }));
      }
    } catch (error) {
      alert("Erreur: " + error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dons ({total})</h1>
      </header>

      <div className={styles.tableContainer}>
        {loading ? (
          <p style={{ padding: "20px" }}>Chargement...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Donateur</th>
                <th>Type</th>
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
                    {don.anonyme ? "Anonyme" : (don.nom || "Inconnu")}
                    {!don.anonyme && don.email && <div style={{fontSize: '12px', color: 'var(--color-text-light)'}}>{don.email}</div>}
                  </td>
                  <td>{don.type === 'financier' ? 'Financier' : 'Matériel'}</td>
                  <td>
                    {don.type === 'financier' 
                      ? <span style={{fontWeight: '600', color: 'var(--accent-strong)'}}>{don.montant} MAD</span> 
                      : don.description_materiel}
                  </td>
                  <td>{don.Projet ? don.Projet.titre_fr : "Général"}</td>
                  <td>
                    {don.recu_url ? (
                      <a href={`${BASE_BACK_END_URL}${don.recu_url}`} target="_blank" rel="noreferrer" title="Télécharger le reçu">
                        <FaDownload color="var(--accent)" />
                      </a>
                    ) : "-"}
                  </td>
                  <td>
                    <select 
                      className={`${styles.statusSelect} ${styles[`status-${don.status}`]}`}
                      value={don.status}
                      onChange={(e) => handleStatusChange(don.id, e.target.value)}
                    >
                      <option value="en_attente">En attente</option>
                      <option value="recu">Reçu</option>
                      <option value="annule">Annulé</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDeleteClick(don.id, don.type === 'financier' ? `${don.montant} MAD` : don.description_materiel)}
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
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
        description="Voulez-vous vraiment supprimer ce don ? Cette action est irréversible."
        detailLabel="Détail du don"
        detailValue={popup.title}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}
