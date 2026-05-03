import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AdminPartner.module.css";
import { Upload, Save, Loader2 } from "lucide-react";

// Composants communs
import BackButton from "../../../components/common/admin/BackButton";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";

// Redux Actions
import { fetchPartnerById, updatePartner, resetStatus } from "./adminPartnerSlice";
import Info from "../../../components/popup/Info";

/**
 * Utilitaire pour formater les erreurs de validation venant du backend
 */
const formatValidationError = (error) => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    const data = error?.response?.data || error;
    if (data.details && Array.isArray(data.details)) {
        const messages = data.details.map(d => d.message).join(', ');
        return `Veuillez corriger les erreurs : ${messages}`;
    }
    if (data.message) return data.message;
    return 'Une erreur est survenue';
};

export default function AdminPartnerEdit() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // États locaux
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        nom_fr: "", nom_ar: "", nom_en: "",
        description_fr: "", description_ar: "", description_en: "",
        site_web: "",
        logo: null
    });

    const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

    // Sélecteurs Redux
    const { currentPartner, loading, error, success } = useSelector((state) => state.adminPartner);

    // 1. Montage : Charger les données et réinitialiser les status
    useEffect(() => {
        dispatch(resetStatus());
        if (id) {
            dispatch(fetchPartnerById(id));
        }
        return () => dispatch(resetStatus()); // Nettoyage au démontage
    }, [id, dispatch]);

    // 2. Remplissage du formulaire dès que les données sont reçues
    useEffect(() => {
        if (currentPartner) {
            setFormData({
                nom_fr: currentPartner.nom_fr || "",
                nom_ar: currentPartner.nom_ar || "",
                nom_en: currentPartner.nom_en || "",
                description_fr: currentPartner.description_fr || "",
                description_ar: currentPartner.description_ar || "",
                description_en: currentPartner.description_en || "",
                site_web: currentPartner.site_web || "",
                logo: null
            });
            if (currentPartner.logo) {
                setPreview(currentPartner.logo);
            }
        }
    }, [currentPartner]);

    // 3. Surveillance du succès pour afficher le Popup
    useEffect(() => {
        if (success && isSubmitting) {
            setShowSuccessPopup(true);
            setIsSubmitting(false);
        }
    }, [success, isSubmitting]);

    // Handlers
    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        dispatch(resetStatus());
        navigate("/admin/partenaires");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, logo: file }));
            setPreview(URL.createObjectURL(file)); // Crée une URL temporaire locale (blob:)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        // On construit le FormData dynamiquement
        Object.keys(formData).forEach(key => {
            if (key === 'logo') {
                if (formData.logo) data.append("logo", formData.logo);
            } else {
                data.append(key, formData[key]);
            }
        });

        dispatch(updatePartner({ id, data }));
    };

    return (
        <div className={styles.container}>
            {/* Fenêtre de confirmation après succès */}
            <Info
                isOpen={showSuccessPopup}
                onClose={handleClosePopup}
                onConfirm={handleClosePopup}
                variant="success"
                title="Mise à jour réussie"
                description={`Le partenaire "${formData.nom_fr}" a été mis à jour avec succès.`}
                confirmLabel="Retour à la liste"
            />

            <BackButton label="Retour aux partenaires" />

            <header className={styles.header}>
                <h1>Modifier le Partenaire</h1>
                <p>Mettez à jour les informations du collaborateur institutionnel #{id}.</p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>

                {/* SECTION 1: Identité Visuelle */}
                <h2 className={styles.sectionTitle}>Identité Visuelle</h2>
                <div className={styles.card}>
                    <div className={styles.uploadZone}>
                        <div className={`${styles.uploadBox} ${preview ? styles.hasPreview : ""}`}>
                            {preview ? (
                                <div className={styles.imagePreviewContainer}>
                                    <img
                                        src={preview.startsWith('blob:') ? preview : `${VITE_BASE_BACK_END_URL}${preview}`}
                                        alt="Logo Preview"
                                        className={styles.imagePreview}
                                    />
                                    <div className={styles.imageOverlay}>
                                        <Upload size={24} />
                                        <span>Choisir un autre logo</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload size={32} strokeWidth={1.5} />
                                    <p><strong>Changer le Logo</strong></p>
                                    <span>PNG, JPG ou SVG (max. 2Mo)</span>
                                </>
                            )}
                            <input
                                type="file"
                                className={styles.fileInput}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>SITE WEB (URL)</label>
                        <input
                            type="url"
                            name="site_web"
                            placeholder="https://www.exemple.com"
                            value={formData.site_web}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* SECTION 2: Contenu Éditorial */}
                <h2 className={styles.sectionTitle}>Contenu Éditorial</h2>

                {/* Français */}
                <div className={styles.editorialCard}>
                    <div className={styles.langBadgeFr}><span>FR</span> Français</div>
                    <div className={styles.inputGroup}>
                        <label>NOM DU PARTENAIRE</label>
                        <input type="text" name="nom_fr" required value={formData.nom_fr} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>DESCRIPTION</label>
                        <textarea name="description_fr" required value={formData.description_fr} onChange={handleChange} maxLength={100} />
                        <small className={styles.charCount}>{formData.description_fr.length}/100</small>
                    </div>
                </div>

                {/* Arabe */}
                <div className={`${styles.editorialCard} ${styles.rtl}`}>
                    <div className={styles.langBadgeAr}><span>AR</span> العربية</div>
                    <div className={styles.inputGroup}>
                        <label>اسم الشريك</label>
                        <input type="text" name="nom_ar" required value={formData.nom_ar} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>الوصف</label>
                        <textarea name="description_ar" required value={formData.description_ar} onChange={handleChange} maxLength={100} />
                        <small className={styles.charCount}>{formData.description_ar.length}/100</small>
                    </div>
                </div>

                {/* Anglais */}
                <div className={styles.editorialCard}>
                    <div className={styles.langBadgeEn}><span>EN</span> English</div>
                    <div className={styles.inputGroup}>
                        <label>PARTNER NAME</label>
                        <input type="text" name="nom_en" required value={formData.nom_en} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>DESCRIPTION</label>
                        <textarea name="description_en" required value={formData.description_en} onChange={handleChange} maxLength={100} />
                        <small className={styles.charCount}>{formData.description_en.length}/100</small>
                    </div>
                </div>

                {error && <div className={styles.errorBanner}>{formatValidationError(error)}</div>}

                <div className={styles.actions}>
                    <button type="submit" className={styles.btnSave} disabled={loading}>
                        {loading ? <Loader2 className={styles.spinner} size={18} /> : <Save size={18} />}
                        {loading ? "Mise à jour..." : "Enregistrer les modifications"}
                    </button>
                    <button type="button" className={styles.btnCancel} onClick={() => navigate("/admin/partenaires")}>
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}