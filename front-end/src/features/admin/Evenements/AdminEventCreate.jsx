import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEventComplet } from "./eventsAdminSlice";
import { fetchDomains } from "../../domains/domainsSlice";
import styles from "./Evenements.module.css";
import { FaTrash } from "react-icons/fa";
import { protectedApi } from "../Login/authService";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminEventCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Domain & project data from Redux / API
  const { data: domains } = useSelector((state) => state.domains);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    titre_fr: "", titre_en: "", titre_ar: "",
    description_fr: "", description_en: "", description_ar: "",
    date_debut: "",
    date_fin: "",
    lieu: "",
    domaine_id: "",
    projet_id: ""
  });

  // Image states (same pattern as Projects)
  const [imagePrincipale, setImagePrincipale] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extraImages, setExtraImages] = useState([]);    // File[]
  const [extraPreviews, setExtraPreviews] = useState([]); // string[]

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchDomains());
    // Fetch projects list for selector
    // Use the existing public admin route for project list
    protectedApi.get("/api/fr/projet-admin?limit=200")
      .then(res => setProjects(res.data?.data || []))
      .catch(() => {});
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Principal image
  const handlePrincipalChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePrincipale(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removePrincipal = () => {
    setImagePrincipale(null);
    setImagePreview(null);
  };

  // Gallery images
  const handleExtraImagesChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setExtraImages(prev => [...prev, ...files]);
      setExtraPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeExtraImage = (index) => {
    setExtraImages(prev => prev.filter((_, i) => i !== index));
    setExtraPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    const data = new FormData();
    // Append only non-empty fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
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
      setFormError(typeof error === "string" ? error : "Erreur lors de la création");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate("/admin/evenements")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "8px" }}>
          <path d="m15 18-6-6 6-6" />
        </svg>
        Retour à la liste
      </button>

      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.mainTitle}>Créer un nouvel événement</h1>
          <p className={styles.subtitle}>Remplissez les informations pour créer un événement.</p>
        </div>
      </header>

      {formError && (
        <div className={styles.errorBanner}>{formError}</div>
      )}

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* Domaine & Projet */}
            <div className={styles.formGroup}>
              <label>Domaine d'intervention *</label>
              <select name="domaine_id" value={formData.domaine_id} onChange={handleChange} required>
                <option value="">Sélectionner un domaine</option>
                {domains?.map(d => (
                  <option key={d.id} value={d.id}>{d.nom_fr || d.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Projet associé (optionnel)</label>
              <select name="projet_id" value={formData.projet_id} onChange={handleChange}>
                <option value="">Aucun projet</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.titre_fr || p.titre}</option>
                ))}
              </select>
            </div>

            {/* Titres */}
            <div className={styles.formGroup}>
              <label>Titre (Français) *</label>
              <input type="text" name="titre_fr" value={formData.titre_fr} onChange={handleChange} required placeholder="Ex: Caravane Médicale 2024" />
            </div>
            <div className={styles.formGroup}>
              <label>Titre (Anglais) *</label>
              <input type="text" name="titre_en" value={formData.titre_en} onChange={handleChange} required placeholder="Event Title" />
            </div>
            <div className={styles.formGroup}>
              <label>Titre (Arabe) *</label>
              <input type="text" name="titre_ar" value={formData.titre_ar} onChange={handleChange} required dir="rtl" placeholder="عنوان الحدث" />
            </div>

            {/* Lieu (single field) & Dates */}
            <div className={styles.formGroup}>
              <label>Lieu</label>
              <input type="text" name="lieu" value={formData.lieu} onChange={handleChange} placeholder="Ex: Marrakech, Maroc" />
            </div>
            <div className={styles.formGroup}>
              <label>Date de début *</label>
              <input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Date de fin (optionnel)</label>
              <input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} />
            </div>

            {/* Descriptions */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Français)</label>
              <textarea name="description_fr" value={formData.description_fr} onChange={handleChange} rows="4" placeholder="Description en français..." />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Anglais)</label>
              <textarea name="description_en" value={formData.description_en} onChange={handleChange} rows="4" placeholder="Description in English..." />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Arabe)</label>
              <textarea name="description_ar" value={formData.description_ar} onChange={handleChange} rows="4" dir="rtl" placeholder="...الوصف بالعربية" />
            </div>

            {/* Image Principale */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Image Principale</label>
              <input type="file" accept="image/*" onChange={handlePrincipalChange} />
              <small>Cette image sera affichée en couverture de l'événement.</small>
            </div>

            {imagePreview && (
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <div className={styles.galleryPreview}>
                  <div style={{position: 'relative'}}>
                    <img src={imagePreview} alt="Aperçu principal" />
                    <button type="button" onClick={removePrincipal}>
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Galerie d'images</label>
              <input type="file" accept="image/*" multiple onChange={handleExtraImagesChange} />
              <small>Vous pouvez sélectionner plusieurs images.</small>
            </div>

            {extraPreviews.length > 0 && (
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <div className={styles.galleryPreview}>
                  {extraPreviews.map((preview, i) => (
                    <div key={i} style={{position: 'relative'}}>
                      <img src={preview} alt={`Galerie ${i + 1}`} />
                      <button type="button" onClick={() => removeExtraImage(i)}>
                        <FaTrash size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
