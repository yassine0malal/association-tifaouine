import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createDomaineAdmin } from "./domainesAdminSlice";
import styles from "./Domaines.module.css";
import ImageUpload from "../../../components/admin/ImageUpload";
import BackButton from "../../../components/common/admin/BackButton";

export default function AdminDomaineCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom_fr: "",
    nom_en: "",
    nom_ar: "",
    desc_fr: "",
    desc_en: "",
    desc_ar: "",
  });
  const [icone, setIcone] = useState(null);
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
    // Build payload with trimmed values
    Object.keys(formData).forEach((key) => {
      const val = formData[key] ? formData[key].toString().trim() : "";
      data.append(key, val);
    });

    if (icone) {
      data.append("icone", icone);
    }

    try {
      await dispatch(createDomaineAdmin(data)).unwrap();
      setMessage({ type: "success", text: "Domaine créé avec succès !" });
      setTimeout(() => navigate("/admin/domaines"), 1500);
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
        <h1 className={styles.title}>Créer un nouveau domaine</h1>
      </header>

      <div className={styles.formContainer}>
        {message && (
          <div className={`${styles.message} ${message.type === "success" ? styles.msgSuccess : styles.msgError}`}>
            {message.type === "success" ? "✓" : "✗"} {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <ImageUpload
            label="Icône (Image)"
            onChange={(file) => setIcone(file)}
          />

          <div className={styles.formGroup}>
            <label>Nom (Français) *</label>
            <input type="text" name="nom_fr" value={formData.nom_fr} onChange={handleChange} required placeholder="Entrez le nom en français" />
          </div>
          <div className={styles.formGroup}>
            <label>Nom (Anglais) *</label>
            <input type="text" name="nom_en" value={formData.nom_en} onChange={handleChange} required placeholder="Enter the name in English" />
          </div>
          <div className={styles.formGroup}>
            <label>Nom (Arabe) *</label>
            <input type="text" name="nom_ar" value={formData.nom_ar} onChange={handleChange} required dir="rtl" placeholder="أدخل الاسم بالعربية" />
          </div>

          <div className={styles.formGroup}>
            <label>Description (Français)</label>
            <textarea name="desc_fr" value={formData.desc_fr} onChange={handleChange} rows="4" placeholder="Description du domaine en français..." />
          </div>
          <div className={styles.formGroup}>
            <label>Description (Anglais)</label>
            <textarea name="desc_en" value={formData.desc_en} onChange={handleChange} rows="4" placeholder="Domain description in English..." />
          </div>
          <div className={styles.formGroup}>
            <label>Description (Arabe)</label>
            <textarea name="desc_ar" value={formData.desc_ar} onChange={handleChange} rows="4" dir="rtl" placeholder="...وصف المجال بالعربية" />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/admin/domaines")}>
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer le domaine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
