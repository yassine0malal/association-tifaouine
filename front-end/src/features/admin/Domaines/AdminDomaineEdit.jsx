import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateDomaineAdmin } from "./domainesAdminSlice";
import { protectedApi } from "../Login/authService";
import styles from "./Domaines.module.css";
import ImageUpload from "../../../components/admin/ImageUpload";
import BackButton from "../../../components/common/admin/BackButton";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminDomaineEdit() {
  const { id } = useParams();
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
  const [currentIcone, setCurrentIcone] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchDomaine = async () => {
      try {
        const response = await protectedApi.get(`/api/domaines/admin/${id}`);
        const data = response.data.data;

        setFormData({
          nom_fr: data.nom_fr || "",
          nom_en: data.nom_en || "",
          nom_ar: data.nom_ar || "",
          desc_fr: data.desc_fr || "",
          desc_en: data.desc_en || "",
          desc_ar: data.desc_ar || "",
        });
        setCurrentIcone(data.icone || null);
        setLoading(false);
      } catch (error) {
        setMessage({ type: "error", text: "Erreur de chargement: " + error.message });
        setLoading(false);
      }
    };
    fetchDomaine();
  }, [id]);

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
    } else if (currentIcone) {
      data.append("icone", currentIcone);
    }

    try {
      await dispatch(updateDomaineAdmin({ id, formData: data })).unwrap();
      setMessage({ type: "success", text: "Domaine mis à jour avec succès !" });
      setTimeout(() => navigate("/admin/domaines"), 1500);
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la modification : " + error });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 20px", flexDirection: "column", gap: "16px" }}>
          <div className={styles.spinner}></div>
          <p style={{ color: "var(--paragraph-color)" }}>Chargement du domaine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      <BackButton />

      <header className={styles.header}>
        <h1 className={styles.title}>Modifier le domaine</h1>
      </header>

      <div className={styles.formContainer}>
        {message && (
          <div className={`${styles.message} ${message.type === "success" ? styles.msgSuccess : styles.msgError}`}>
            {message.type === "success" ? "✓" : "✗"} {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.fullWidth}>
              <ImageUpload
                label="Icône (Image)"
                onChange={(file) => setIcone(file)}
                existingImages={currentIcone ? [{
                  id: 'icone',
                  url: currentIcone.startsWith('http') ? currentIcone : `${BASE_BACK_END_URL}${currentIcone}`
                }] : []}
                onRemoveExisting={() => setCurrentIcone(null)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Nom (Français) *</label>
              <input type="text" name="nom_fr" value={formData.nom_fr} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Nom (Anglais) *</label>
              <input type="text" name="nom_en" value={formData.nom_en} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Nom (Arabe) *</label>
              <input type="text" name="nom_ar" value={formData.nom_ar} onChange={handleChange} required dir="rtl" />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Français)</label>
              <textarea name="desc_fr" value={formData.desc_fr} onChange={handleChange} rows="3" />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Anglais)</label>
              <textarea name="desc_en" value={formData.desc_en} onChange={handleChange} rows="3" />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Arabe)</label>
              <textarea name="desc_ar" value={formData.desc_ar} onChange={handleChange} rows="3" dir="rtl" />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/admin/domaines")}>
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
