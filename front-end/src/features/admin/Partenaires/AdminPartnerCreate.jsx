import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPartner.module.css";
import { Upload, Save, Loader2 } from "lucide-react";

// Composants communs
import BackButton from "../../../components/common/admin/BackButton";
import Info from "../../../components/popup/Info";

// Import des actions du slice
import { createPartner, resetStatus } from "./adminPartnerSlice";

/**
 * Utilitaire pour formater les erreurs de validation
 */
const formatValidationError = (error) => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    const data = error?.response?.data || error;
    
    if (data.details && Array.isArray(data.details)) {
        const messages = data.details.map(d => d.message).join(', ');
        return `Veuillez corriger les erreurs suivantes : ${messages}`;
    }
    if (data.message) {
        return `${data.message}. Les noms et descriptions doivent contenir entre 2 et 200 caractères.`;
    }
    return 'Une erreur est survenue lors de la création.';
};

export default function AdminPartnerCreate() {
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

    // Récupération de l'état depuis le store
    const { loading, error, success } = useSelector((state) => state.adminPartner);

    // 1. Initialisation et nettoyage
    useEffect(() => {
        dispatch(resetStatus());
        return () => dispatch(resetStatus());
    }, [dispatch]);

    // 2. Surveillance du succès pour afficher le Popup Info
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
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'logo') {
                if (formData.logo) data.append("logo", formData.logo);
            } else {
                data.append(key, formData[key]);
            }
        });

        dispatch(createPartner(data));
    };

    return (
        <div className={styles.container}>
            {/* Fenêtre de confirmation après succès (Remplace l'alert) */}
            <Info
                isOpen={showSuccessPopup}
                onClose={handleClosePopup}
                onConfirm={handleClosePopup}
                variant="success"
                title="Création réussie"
                description={`Le partenaire "${formData.nom_fr}" a été ajouté avec succès à la base de données.`}
                confirmLabel="Voir la liste"
            />

            <BackButton label="Retour aux partenaires" />

            <header className={styles.header}>
                <h1>Ajouter un Partenaire</h1>
                <p>Enregistrez un nouveau collaborateur institutionnel pour l'association Tifaouine.</p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
                {/* SECTION 1: Identité Visuelle */}
                <h2 className={styles.sectionTitle}>Identité Visuelle</h2>
                <div className={styles.card}>
                    <div className={styles.uploadZone}>
                        <div className={`${styles.uploadBox} ${preview ? styles.hasPreview : ""}`}>
                            {preview ? (
                                <img src={preview} alt="Preview logo" className={styles.imagePreview} />
                            ) : (
                                <>
                                    <Upload size={32} strokeWidth={1.5} />
                                    <p><strong>Télécharger le Logo</strong></p>
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

                {/* Bloc Français */}
                <div className={styles.editorialCard}>
                    <div className={styles.langBadgeFr}><span>FR</span> Français</div>
                    <div className={styles.inputGroup}>
                        <label>NOM DU PARTENAIRE</label>
                        <input
                            type="text"
                            name="nom_fr"
                            required
                            placeholder="Entrez le nom en français"
                            value={formData.nom_fr}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>DESCRIPTION</label>
                        <textarea
                            name="description_fr"
                            required
                            placeholder="Description détaillée..."
                            value={formData.description_fr}
                            onChange={handleChange}
                            maxLength={200}
                        />
                        <small className={styles.charCount}>
                            {formData.description_fr.length}/200
                        </small>
                    </div>
                </div>

                {/* Bloc Arabe (RTL) */}
                <div className={`${styles.editorialCard} ${styles.rtl}`}>
                    <div className={styles.langBadgeAr}><span>AR</span> العربية</div>
                    <div className={styles.inputGroup}>
                        <label>اسم الشريك</label>
                        <input
                            type="text"
                            name="nom_ar"
                            required
                            placeholder="أدخل الاسم بالعربية"
                            value={formData.nom_ar}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>الوصف</label>
                        <textarea
                            name="description_ar"
                            required
                            placeholder="وصف مفصل..."
                            value={formData.description_ar}
                            onChange={handleChange}
                            maxLength={200}
                        />
                        <small className={styles.charCount}>
                            {formData.description_ar.length}/200
                        </small>
                    </div>
                </div>

                {/* Bloc Anglais */}
                <div className={styles.editorialCard}>
                    <div className={styles.langBadgeEn}><span>EN</span> English</div>
                    <div className={styles.inputGroup}>
                        <label>PARTNER NAME</label>
                        <input
                            type="text"
                            name="nom_en"
                            required
                            placeholder="Enter name in English"
                            value={formData.nom_en}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>DESCRIPTION</label>
                        <textarea
                            name="description_en"
                            required
                            placeholder="Detailed description..."
                            value={formData.description_en}
                            onChange={handleChange}
                            maxLength={200}
                        />
                        <small className={styles.charCount}>
                            {formData.description_en.length}/200
                        </small>
                    </div>
                </div>

                {error && <div className={styles.errorBanner}>{formatValidationError(error)}</div>}

                {/* Actions */}
                <div className={styles.actions}>
                    <button 
                        type="submit" 
                        className={styles.btnSave} 
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className={styles.spinner} size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        {loading ? "Enregistrement..." : "Enregistrer le Partenaire"}
                    </button>
                    <button 
                        type="button" 
                        className={styles.btnCancel}
                        onClick={() => navigate("/admin/partenaires")}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}