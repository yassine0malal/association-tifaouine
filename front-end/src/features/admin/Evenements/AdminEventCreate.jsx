import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEventComplet } from "./eventsAdminSlice";
import styles from "./Evenements.module.css";

export default function AdminEventCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titre_fr: "", titre_en: "", titre_ar: "",
    description_fr: "", description_en: "", description_ar: "",
    date_evenement: "",
    lieu_fr: "", lieu_en: "", lieu_ar: "",
    type_fr: "", type_en: "", type_ar: "",
    statut: "a_venir",
    domaine_id: ""
  });
  const [imagePrincipale, setImagePrincipale] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrincipalChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagePrincipale(e.target.files[0]);
    }
  };

  const handleExtraImagesChange = (e) => {
    if (e.target.files) {
      setExtraImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });
    
    if (imagePrincipale) {
      data.append("imagePrincipale", imagePrincipale);
    }
    
    extraImages.forEach((img) => {
      data.append("extraImages", img);
    });

    try {
      await dispatch(createEventComplet(data)).unwrap();
      navigate("/admin/evenements");
    } catch (error) {
      alert("Erreur lors de la création : " + error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Créer un nouvel événement</h1>
      </header>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Image Principale</label>
              <input type="file" accept="image/*" onChange={handlePrincipalChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Images Supplémentaires (Galerie)</label>
              <input type="file" accept="image/*" multiple onChange={handleExtraImagesChange} />
              <small style={{color: 'var(--color-text-light)'}}>Vous pouvez sélectionner plusieurs images</small>
            </div>

            <div className={styles.formGroup}>
              <label>Titre (Français)</label>
              <input type="text" name="titre_fr" value={formData.titre_fr} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Titre (Anglais)</label>
              <input type="text" name="titre_en" value={formData.titre_en} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Titre (Arabe)</label>
              <input type="text" name="titre_ar" value={formData.titre_ar} onChange={handleChange} required dir="rtl" />
            </div>

            <div className={styles.formGroup}>
              <label>Date de l'événement</label>
              <input type="date" name="date_evenement" value={formData.date_evenement} onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label>Lieu (Français)</label>
              <input type="text" name="lieu_fr" value={formData.lieu_fr} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Lieu (Anglais)</label>
              <input type="text" name="lieu_en" value={formData.lieu_en} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Lieu (Arabe)</label>
              <input type="text" name="lieu_ar" value={formData.lieu_ar} onChange={handleChange} required dir="rtl" />
            </div>

            <div className={styles.formGroup}>
              <label>Statut</label>
              <select name="statut" value={formData.statut} onChange={handleChange} required>
                <option value="a_venir">À venir</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="annule">Annulé</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Français)</label>
              <textarea name="description_fr" value={formData.description_fr} onChange={handleChange} rows="4" required />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Anglais)</label>
              <textarea name="description_en" value={formData.description_en} onChange={handleChange} rows="4" required />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Arabe)</label>
              <textarea name="description_ar" value={formData.description_ar} onChange={handleChange} rows="4" required dir="rtl" />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/admin/evenements")}>
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer l'événement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
