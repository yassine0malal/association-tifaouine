import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createDonMateriel } from "./donsAdminSlice";
import { protectedApi } from "../Login/authService";
import styles from "./Dons.module.css";
import { FaArrowLeft } from "react-icons/fa";

export default function AdminDonMaterielCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    nom_complet: "",
    telephone: "",
    type_destination: "general",
    projet_id: "",
    description: "",
    quantite: 1,
    date_decision: ""
  });
  
  const [projets, setProjets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadProjets = async () => {
      try {
        const res = await protectedApi.get("/api/projets?page=1&limit=100");
        setProjets(res.data?.data || res.data?.rows || []);
      } catch (err) {
        console.error("Error loading projets:", err);
      }
    };
    loadProjets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = { 
      ...formData,
      quantite: parseInt(formData.quantite, 10) || 1
    };
    
    // Clean up payload
    if (payload.type_destination === 'general') {
      delete payload.projet_id;
    } else if (payload.projet_id) {
      payload.projet_id = parseInt(payload.projet_id, 10);
    }

    if (!payload.date_decision) {
      delete payload.date_decision;
    }
    
    if (!payload.telephone) delete payload.telephone;

    try {
      await dispatch(createDonMateriel(payload)).unwrap();
      setMessage({ type: "success", text: "Don matériel enregistré avec succès !" });
      setTimeout(() => navigate("/admin/dons"), 1500);
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement : " + error });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      <button className={styles.backBtn} onClick={() => navigate("/admin/dons")}>
        <FaArrowLeft /> Retour aux dons
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>Enregistrer un don matériel</h1>
      </header>

      <div className={styles.formContainer}>
        {message && (
          <div className={`${styles.message} ${message.type === "success" ? styles.msgSuccess : styles.msgError}`}>
            {message.type === "success" ? "✓" : "✗"} {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Email du donateur *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className={styles.formGroup}>
              <label>Nom complet *</label>
              <input type="text" name="nom_complet" value={formData.nom_complet} onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label>Téléphone</label>
              <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Destination du don *</label>
              <select name="type_destination" value={formData.type_destination} onChange={handleChange} required>
                <option value="general">Général (Pour l'association)</option>
                <option value="specifique">Spécifique (Pour un projet)</option>
              </select>
            </div>

            {formData.type_destination === 'specifique' && (
              <div className={styles.formGroup}>
                <label>Projet associé *</label>
                <select name="projet_id" value={formData.projet_id} onChange={handleChange} required>
                  <option value="">-- Sélectionner un projet --</option>
                  {projets.map((p) => (
                    <option key={p.id} value={p.id}>{p.titre_fr}</option>
                  ))}
                </select>
              </div>
            )}

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description du matériel *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required placeholder="Ex: 50 cartables, 2 ordinateurs..." />
            </div>

            <div className={styles.formGroup}>
              <label>Quantité</label>
              <input type="number" name="quantite" min="1" value={formData.quantite} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Date de décision</label>
              <input type="date" name="date_decision" value={formData.date_decision} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/admin/dons")}>
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer le don"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
