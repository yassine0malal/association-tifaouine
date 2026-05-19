import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMember } from "./membersAdminSlice";
import styles from "./Members.module.css";
import ImageUpload from "../../../components/admin/ImageUpload";
import BackButton from "../../../components/common/admin/BackButton";

export default function AdminMemberCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    poste: "",
    status: "actif"
  });

  const [photo, setPhoto] = useState(null);
  const [carteIdentite, setCarteIdentite] = useState(null);
  const [cv, setCv] = useState(null);
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
    if (cv) {
      data.append("cv", cv);
    }

    try {
      await dispatch(createMember(data)).unwrap();
      setMessage({ type: "success", text: "Membre créé avec succès !" });
      setTimeout(() => navigate("/admin/membres"), 1500);
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

      <BackButton />

      <header className={styles.header}>
        <h1 className={styles.title}>Ajouter un nouveau membre</h1>
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
              <ImageUpload
                label="CV (Curriculum Vitae)"
                accept="image/*,application/pdf,.doc,.docx"
                onChange={(file) => setCv(file)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Nom complet *</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} required placeholder="Ex: Sarah Smith" />
            </div>

            <div className={styles.formGroup}>
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Ex: sarah@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label>Poste / Fonction</label>
              <input type="text" name="poste" value={formData.poste} onChange={handleChange} placeholder="Ex: Responsable communication" />
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
            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/admin/membres")}>
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Ajouter le membre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
