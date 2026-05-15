import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateEventComplet } from "./eventsAdminSlice";
import { protectedApi } from "../Login/authService";
import styles from "./Evenements.module.css";
import { FaTrash } from "react-icons/fa";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminEventEdit() {
  const { id } = useParams();
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
  
  const [currentImagePrincipale, setCurrentImagePrincipale] = useState(null);
  const [currentExtraImages, setCurrentExtraImages] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await protectedApi.get(`/api/evenements/admin/complet/${id}`);
        const data = response.data.data;
        setFormData({
          titre_fr: data.titre_fr || "", titre_en: data.titre_en || "", titre_ar: data.titre_ar || "",
          description_fr: data.description_fr || "", description_en: data.description_en || "", description_ar: data.description_ar || "",
          date_evenement: data.date_evenement ? data.date_evenement.split('T')[0] : "",
          lieu_fr: data.lieu_fr || "", lieu_en: data.lieu_en || "", lieu_ar: data.lieu_ar || "",
          type_fr: data.type_fr || "", type_en: data.type_en || "", type_ar: data.type_ar || "",
          statut: data.statut || "a_venir",
          domaine_id: data.domaine_id || ""
        });
        setCurrentImagePrincipale(data.imagePrincipale);
        setCurrentExtraImages(data.images || []);
        setLoading(false);
      } catch (error) {
        alert("Erreur de chargement: " + error.message);
        navigate("/admin/evenements");
      }
    };
    fetchEvent();
  }, [id, navigate]);

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

  const handleRemoveExistingImage = (imageId) => {
    setCurrentExtraImages(currentExtraImages.filter(img => img.id !== imageId));
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

    // Send existing images IDs that should be kept
    currentExtraImages.forEach(img => {
      data.append("existingExtraImages[]", img.id);
    });

    try {
      await dispatch(updateEventComplet({ id, formData: data })).unwrap();
      navigate("/admin/evenements");
    } catch (error) {
      alert("Erreur lors de la modification : " + error);
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className={styles.container}>Chargement...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Modifier l'événement</h1>
      </header>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Image Principale Actuelle</label>
              {currentImagePrincipale && (
                <img src={`${BASE_BACK_END_URL}${currentImagePrincipale.url}`} alt="Principal" className={styles.imagePreview} />
              )}
              <input type="file" accept="image/*" onChange={handlePrincipalChange} style={{marginTop: '12px'}} />
              <small>Laissez vide pour conserver l'image actuelle.</small>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Galerie d'images (Existantes)</label>
              <div className={styles.galleryPreview}>
                {currentExtraImages.map(img => (
                  <div key={img.id} style={{position: 'relative'}}>
                    <img src={`${BASE_BACK_END_URL}${img.url}`} alt="Galerie" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveExistingImage(img.id)}
                      style={{position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer'}}
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
                {currentExtraImages.length === 0 && <p style={{color: 'var(--color-text-light)'}}>Aucune image dans la galerie.</p>}
              </div>
              <label style={{marginTop: '16px'}}>Ajouter de nouvelles images à la galerie</label>
              <input type="file" accept="image/*" multiple onChange={handleExtraImagesChange} />
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
            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/admin/events")}>
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
