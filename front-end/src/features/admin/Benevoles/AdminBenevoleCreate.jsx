import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBenevole } from "./benevolesAdminSlice";
import styles from "./Benevoles.module.css";
import ImageUpload from "../../../components/admin/ImageUpload";
import { FaArrowLeft } from "react-icons/fa";

export default function AdminBenevoleCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mession: "",
    disponibilite: "",
    status: "actif"
  });

  const [photo, setPhoto] = useState(null);
  const [carteIdentite, setCarteIdentite] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (photo) {
      data.append("photo_profile", photo);
    }
    if (carteIdentite) {
      data.append("carte_identite", carteIdentite);
    }

    try {
      await dispatch(createBenevole(data)).unwrap();
      setMessage({ type: "success", text: "Bénévole créé avec succès !" });
      setTimeout(() => navigate("/admin/benevoles"), 1500);
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la création : " + error });
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

      <button className={styles.backBtn} onClick={() => navigate("/admin/benevoles")}>
        <FaArrowLeft /> Retour aux bénévoles
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>Ajouter un nouveau bénévole</h1>
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
              <ImageUpload
                label="Photo de profil"
                onChange={(file) => setPhoto(file)}
              />
            </div>

            <div className={styles.formGroup}>
              <ImageUpload
                label="Carte d'identité"
                accept="image/*,application/pdf"
                onChange={(file) => setCarteIdentite(file)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Nom complet *</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} required placeholder="Ex: Jean Dupont" />
            </div>

            <div className={styles.formGroup}>
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Ex: jean@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label>Mission souhaitée</label>
              <input type="text" name="mession" value={formData.mession} onChange={handleChange} placeholder="Ex: Soutien scolaire" />
            </div>

            <div className={styles.formGroup}>
              <label>Disponibilité</label>
              <input type="text" name="disponibilite" value={formData.disponibilite} onChange={handleChange} placeholder="Ex: Week-ends" />
            </div>

            <div className={styles.formGroup}>
              <label>Statut *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="suspendu">Suspendu</option>
              </select>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/admin/benevoles")}>
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Ajouter le bénévole"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
