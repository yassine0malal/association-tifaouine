import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventComplet, updateEventComplet, clearCurrentDetail } from "./eventsAdminSlice";
import { fetchDomains } from "../../domains/domainsSlice";
import { protectedApi } from "../Login/authService";
import styles from "./Evenements.module.css";
import Loader from "../../../components/common/Loader";
import { FaTrash } from "react-icons/fa";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminEventEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentDetail: event, detailLoading } = useSelector((state) => state.eventsAdmin);
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

  // Image principale: preview URL for display
  const [newPrincipalFile, setNewPrincipalFile] = useState(null);
  const [principalPreview, setPrincipalPreview] = useState(null); // URL string to display

  // Gallery: existing images from server + new uploads
  const [existingGallery, setExistingGallery] = useState([]); // [{id, url}]
  const [newExtraFiles, setNewExtraFiles] = useState([]); // File[]
  const [newExtraPreviews, setNewExtraPreviews] = useState([]); // string[]

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchEventComplet(id));
    dispatch(fetchDomains());
    // Use the existing public admin route for project list
    protectedApi.get("/api/fr/projet-admin?limit=200")
      .then(res => setProjects(res.data?.data || []))
      .catch(() => {});

    return () => {
      dispatch(clearCurrentDetail());
    };
  }, [dispatch, id]);

  // Prefill form when event data arrives
  useEffect(() => {
    if (event) {
      setFormData({
        titre_fr: event.titre_fr || "",
        titre_en: event.titre_en || "",
        titre_ar: event.titre_ar || "",
        description_fr: event.description_fr || "",
        description_en: event.description_en || "",
        description_ar: event.description_ar || "",
        date_debut: event.date_debut ? event.date_debut.split("T")[0] : "",
        date_fin: event.date_fin ? event.date_fin.split("T")[0] : "",
        lieu: event.lieu || "",
        domaine_id: event.domaine_id || "",
        projet_id: event.projet_id || ""
      });

      // image_principale is a direct string URL on the evenement row
      if (event.image_principale) {
        setPrincipalPreview(`${BASE_BACK_END_URL}${event.image_principale}`);
      } else {
        setPrincipalPreview(null);
      }

      // Gallery images from ressource table (via DTO)
      if (event.images && event.images.length > 0) {
        setExistingGallery(event.images.map(img => ({
          id: img.id,
          url: img.url
        })));
      } else {
        setExistingGallery([]);
      }

      // Reset new uploads
      setNewPrincipalFile(null);
      setNewExtraFiles([]);
      setNewExtraPreviews([]);
    }
  }, [event]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Principal image handlers ---
  const handlePrincipalChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPrincipalFile(file);
      setPrincipalPreview(URL.createObjectURL(file));
    }
  };

  // --- Gallery handlers ---
  const handleExtraImagesChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewExtraFiles(prev => [...prev, ...files]);
      setNewExtraPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeExistingImage = (imageUrl) => {
    setExistingGallery(prev => prev.filter(img => img.url !== imageUrl));
  };

  const removeNewExtraImage = (index) => {
    setNewExtraFiles(prev => prev.filter((_, i) => i !== index));
    setNewExtraPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    const data = new FormData();

    // Append form fields
    Object.keys(formData).forEach((key) => {
      const val = formData[key];
      if (val !== "" && val !== null && val !== undefined) {
        data.append(key, val);
      }
    });
    
    // New principal image (if user selected a new one)
    if (newPrincipalFile) {
      data.append("imagePrincipale", newPrincipalFile);
    }

    // Signal to backend to keep existing image_principale if no new upload
    // The backend checks if principalFile exists; if not, it keeps the current one.
    // We also send existingImagePrincipale so the backend knows we want to keep it.
    if (!newPrincipalFile && event?.image_principale) {
      data.append("existingImagePrincipale", event.image_principale);
    }
    
    // New gallery images
    newExtraFiles.forEach((img) => {
      data.append("extraImages", img);
    });

    // CRITICAL: Send existing gallery image URLs to keep them.
    // The backend _manageExistingResources() compares URLs, NOT IDs.
    existingGallery.forEach(img => {
      data.append("existingExtraImages[]", img.url);
    });

    try {
      await dispatch(updateEventComplet({ id, formData: data })).unwrap();
      navigate("/admin/evenements");
    } catch (error) {
      setFormError(typeof error === "string" ? error : "Erreur lors de la mise à jour");
      setIsSubmitting(false);
    }
  };

  if (detailLoading || !event) {
    return (
      <div className={styles.container}>
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      </div>
    );
  }

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
          <h1 className={styles.mainTitle}>Modifier l'événement</h1>
          <p className={styles.subtitle}>ID: {id} — {formData.titre_fr || "..."}</p>
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
              <input type="text" name="titre_fr" value={formData.titre_fr} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Titre (Anglais) *</label>
              <input type="text" name="titre_en" value={formData.titre_en} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Titre (Arabe) *</label>
              <input type="text" name="titre_ar" value={formData.titre_ar} onChange={handleChange} required dir="rtl" />
            </div>

            {/* Lieu & Dates */}
            <div className={styles.formGroup}>
              <label>Lieu</label>
              <input type="text" name="lieu" value={formData.lieu} onChange={handleChange} />
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
              <textarea name="description_fr" value={formData.description_fr} onChange={handleChange} rows="4" />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Anglais)</label>
              <textarea name="description_en" value={formData.description_en} onChange={handleChange} rows="4" />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description (Arabe)</label>
              <textarea name="description_ar" value={formData.description_ar} onChange={handleChange} rows="4" dir="rtl" />
            </div>

            {/* Image Principale */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Image Principale Actuelle</label>
              {principalPreview && (
                <img src={principalPreview} alt="Principal" className={styles.imagePreview} />
              )}
              <input type="file" accept="image/*" onChange={handlePrincipalChange} style={{marginTop: '12px'}} />
              <small>Laissez vide pour conserver l'image actuelle.</small>
            </div>

            {/* Gallery */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Galerie d'images ({existingGallery.length + newExtraFiles.length} image{existingGallery.length + newExtraFiles.length !== 1 ? "s" : ""})</label>
              <div className={styles.galleryPreview}>
                {/* Existing server images */}
                {existingGallery.map(img => (
                  <div key={img.id} style={{position: 'relative'}}>
                    <img src={`${BASE_BACK_END_URL}${img.url}`} alt="Galerie" />
                    <button type="button" onClick={() => removeExistingImage(img.url)}>
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
                {/* New upload previews */}
                {newExtraPreviews.map((preview, i) => (
                  <div key={`new-${i}`} style={{position: 'relative'}}>
                    <img src={preview} alt={`Nouveau ${i + 1}`} style={{border: '2px solid var(--accent)'}} />
                    <button type="button" onClick={() => removeNewExtraImage(i)}>
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
                {existingGallery.length === 0 && newExtraPreviews.length === 0 && (
                  <p style={{color: 'var(--color-text-light)', margin: 0}}>Aucune image dans la galerie.</p>
                )}
              </div>
              <label style={{marginTop: '16px'}}>Ajouter de nouvelles images</label>
              <input type="file" accept="image/*" multiple onChange={handleExtraImagesChange} />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/admin/evenements")}>
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
