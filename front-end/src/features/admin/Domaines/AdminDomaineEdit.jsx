import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateDomaineAdmin } from "./domainesAdminSlice";
import { protectedApi } from "../Login/authService";
import styles from "./Domaines.module.css";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminDomaineEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titre_fr: "",
    titre_en: "",
    titre_ar: "",
    description_fr: "",
    description_en: "",
    description_ar: "",
  });
  const [icone, setIcone] = useState(null);
  const [currentIcone, setCurrentIcone] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomaine = async () => {
      try {
        const response = await protectedApi.get(`/api/domaines/admin/${id}`);
        const data = response.data.data;
        setFormData({
          titre_fr: data.titre_fr || "",
          titre_en: data.titre_en || "",
          titre_ar: data.titre_ar || "",
          description_fr: data.description_fr || "",
          description_en: data.description_en || "",
          description_ar: data.description_ar || "",
        });
        setCurrentIcone(data.icone);
        setLoading(false);
      } catch (error) {
        alert("Erreur de chargement: " + error.message);
        navigate("/admin/domaines");
      }
    };
    fetchDomaine();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIcone(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (icone) {
      data.append("icone", icone);
    }

    try {
      await dispatch(updateDomaineAdmin({ id, formData: data })).unwrap();
      navigate("/admin/domaines");
    } catch (error) {
      alert("Erreur lors de la modification : " + error);
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className={styles.container}>Chargement...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Modifier le domaine</h1>
      </header>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Icône Actuelle</label>
            {currentIcone && (
              <img src={`${BASE_BACK_END_URL}${currentIcone}`} alt="current" className={styles.imagePreview} />
            )}
          </div>
          <div className={styles.formGroup}>
            <label>Nouvelle Icône (Optionnel)</label>
            <input type="file" name="icone" accept="image/*" onChange={handleFileChange} />
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
            <label>Description (Français)</label>
            <textarea name="description_fr" value={formData.description_fr} onChange={handleChange} rows="4" />
          </div>
          <div className={styles.formGroup}>
            <label>Description (Anglais)</label>
            <textarea name="description_en" value={formData.description_en} onChange={handleChange} rows="4" />
          </div>
          <div className={styles.formGroup}>
            <label>Description (Arabe)</label>
            <textarea name="description_ar" value={formData.description_ar} onChange={handleChange} rows="4" dir="rtl" />
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
