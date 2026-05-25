import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AdminResourceEdit.module.css";
import { fetchResourceById, updateResource, resetStatus } from "./adminResourceSlice";

// Components
import Loader from "../../../components/common/Loader";
import Info from "../../../components/popup/Info";
import BackButton from "../../../components/common/admin/BackButton";
import {
    FileText,
    Type,
    AlignLeft,
    Loader2,
    Save,
    Upload,
    Image as ImageIcon,
    Edit2
} from "lucide-react";

/**
 * Formats validation errors from the backend for the error banner
 */
const formatValidationError = (error) => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    const data = error?.response?.data || error;
    if (data.details && Array.isArray(data.details)) {
        return `Veuillez corriger les erreurs : ${data.details.map(d => d.message).join(', ')}`;
    }
    return data.message || 'Une erreur est survenue';
};

export default function AdminResourceEdit() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Refs for hidden inputs
    const imageInputRef = useRef(null);
    const documentInputRef = useRef(null);

    // Local states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Files and Previews
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [resourceFile, setResourceFile] = useState(null); // The PDF/DOC file

    const [formData, setFormData] = useState({
        type: "rapport",
        titre_fr: "",
        titre_ar: "",
        titre_en: "",
        description_fr: "",
        description_ar: "",
        description_en: "",
        is_featured: false,
    });

    const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;
    const { currentResource, loading, error, success } = useSelector((state) => state.adminResources);

    // 1. MOUNT & CLEANUP
    useEffect(() => {
        setFormData({
            type: "rapport", titre_fr: "", titre_ar: "", titre_en: "",
            description_fr: "", description_ar: "", description_en: "",
        });
        setPreviewImage(null);
        setResourceFile(null);
        dispatch(resetStatus());

        if (id) {
            dispatch(fetchResourceById(id));
        }

        return () => {
            dispatch(resetStatus());
        };
    }, [id, dispatch]);

    // 2. POPULATE FORM
    useEffect(() => {
        if (currentResource && currentResource.id == id) {
            setFormData({
                type: currentResource.type || "rapport",
                titre_fr: currentResource.titre_fr || "",
                titre_ar: currentResource.titre_ar || "",
                titre_en: currentResource.titre_en || "",
                description_fr: currentResource.description_fr || "",
                description_ar: currentResource.description_ar || "",
                description_en: currentResource.description_en || "",
                is_featured: !!currentResource.is_featured, // Populate from backend data
            });
            if (currentResource.image_couverture) {
                setPreviewImage(`${VITE_BASE_BACK_END_URL}${currentResource.image_couverture}`);
            }
        }
    }, [currentResource, id, VITE_BASE_BACK_END_URL]);

    // 3. SUCCESS HANDLING
    useEffect(() => {
        if (success && isSubmitting) {
            setShowSuccessPopup(true);
            setIsSubmitting(false);
        }
    }, [success, isSubmitting]);

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        dispatch(resetStatus());
        navigate("/admin/ressources");
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Enforce 120‑character limit for all description fields
        let newValue = value;
        if (name.startsWith("description_") && newValue.length > 120) {
            newValue = newValue.slice(0, 120);
        }
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResourceFile(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        if (imageFile) {
            submitData.append("image_couverture", imageFile);
        }

        // CHANGE THIS: 'url' -> 'files'
        if (resourceFile) {
            submitData.append("files", resourceFile);
        }

        dispatch(updateResource({ id, data: submitData }));
    };

    if (loading && !currentResource) {
        return (
            <div className={styles.loaderWrapper}>
                <Loader2 className={styles.spinner} size={40} />
                <Loader />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Info
                isOpen={showSuccessPopup}
                onClose={handleClosePopup}
                onConfirm={handleClosePopup}
                variant="success"
                title="Mise à jour réussie"
                description={`La ressource "${formData.titre_fr}" a été mise à jour.`}
                confirmLabel="Retour à la liste"
            />

            <header className={styles.header}>
            <BackButton />
                <div>
                    <h1>Modifier la Ressource</h1>
                </div>
            </header>

            {error && <div className={styles.errorBanner}>{formatValidationError(error)}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>

                {/* SECTION: IMAGE DE COUVERTURE */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Image de Couverture</h2>
                    <div className={styles.imageContainer}>
                        <img
                            src={previewImage || "/placeholder-doc.png"}
                            alt="Couverture"
                            className={styles.coverImage}
                        />
                        <button
                            type="button"
                            className={styles.changeImageBtn}
                            onClick={() => imageInputRef.current.click()}
                        >
                            <Edit2 size={16} /> Changer l'image
                        </button>
                        <input
                            type="file"
                            ref={imageInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                    </div>
                </section>

                {/* SECTION: INFORMATIONS GÉNÉRALES */}
                <section className={styles.cardSection}>
                    <h2 className={styles.cardTitle}>Informations Générales</h2>
                    <div className={styles.inputGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <input
                            type="checkbox"
                            name="is_featured"
                            id="is_featured"
                            checked={formData.is_featured}
                            onChange={handleCheckboxChange}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="is_featured" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: '600' }}>
                            Mettre cette ressource preferable
                        </label>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Type de ressource</label>
                        <select name="type" value={formData.type} onChange={handleInputChange} className={styles.input}>
                            <option value="rapport">Rapport Annuel</option>
                            <option value="guide">Guide technique</option>
                            <option value="document">Document officiel</option>
                        </select>
                    </div>

                    {/* NEW FILE UPLOAD INPUT */}
                    <div className={styles.inputGroup}>
                        <label>Fichier de la ressource (PDF/DOC)</label>
                        <div
                            className={`${styles.fileUploadZone} ${resourceFile ? styles.hasFile : ""}`}
                            onClick={() => documentInputRef.current.click()}
                        >
                            <div className={styles.fileUploadContent}>
                                {resourceFile ? (
                                    <>
                                        <FileText className={styles.fileIcon} size={24} />
                                        <span className={styles.fileName}>{resourceFile.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className={styles.uploadIcon} size={24} />
                                        <span>Cliquez pour sélectionner un nouveau fichier</span>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={documentInputRef}
                                onChange={handleDocumentChange}
                                accept=".pdf,.doc,.docx"
                                style={{ display: "none" }}
                            />
                        </div>
                        {currentResource?.url && !resourceFile && (
                            <p className={styles.currentFileHint}>
                                Fichier actuel : <a href={`${VITE_BASE_BACK_END_URL}${currentResource.url}`} target="_blank" rel="noreferrer">Voir le document</a>
                            </p>
                        )}
                    </div>
                </section>

                {/* SECTION: TITRES */}
                <section className={styles.transparentSection}>
                    <h2 className={styles.sectionHeader}><Type size={20} /> Titres</h2>
                    <div className={styles.inputGroup}>
                        <label>FRANÇAIS (FR)</label>
                        <input type="text" name="titre_fr" value={formData.titre_fr} onChange={handleInputChange} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>ARABE (AR)</label>
                        <input type="text" dir="rtl" name="titre_ar" value={formData.titre_ar} onChange={handleInputChange} className={`${styles.inputRtl} ${styles.arabic}`} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>ANGLAIS (EN)</label>
                        <input type="text" name="titre_en" value={formData.titre_en} onChange={handleInputChange} className={styles.input} />
                    </div>
                </section>

                {/* SECTION: DESCRIPTIONS */}
                <section className={styles.transparentSection}>
                    <h2 className={styles.sectionHeader}><AlignLeft size={20} /> Descriptions</h2>
                    <div className={styles.inputGroup}>
                        <label>FRANÇAIS (FR) *</label>
                        <textarea
                            name="description_fr"
                            value={formData.description_fr}
                            onChange={handleInputChange}
                            rows="4"
                            className={styles.textarea}
                            maxLength={120}
                            required
                        />
                        <span style={{ fontSize: "0.8rem", color: "#666", display: "block", marginTop: "2px" }}>
                            {formData.description_fr.length}/120
                        </span>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>ARABE (AR) *</label>
                        <textarea
                            dir="rtl"
                            name="description_ar"
                            value={formData.description_ar}
                            onChange={handleInputChange}
                            rows="4"
                            className={`${styles.textareaRtl} ${styles.arabic}`}
                            maxLength={120}
                            required
                        />
                        <span style={{ fontSize: "0.8rem", color: "#666", display: "block", marginTop: "2px" }}>
                            {formData.description_ar.length}/120
                        </span>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>ANGLAIS (EN) *</label>
                        <textarea
                            name="description_en"
                            value={formData.description_en}
                            onChange={handleInputChange}
                            rows="4"
                            className={styles.textarea}
                            maxLength={120}
                            required
                        />
                        <span style={{ fontSize: "0.8rem", color: "#666", display: "block", marginTop: "2px" }}>
                            {formData.description_en.length}/120
                        </span>
                    </div>
                </section>

                {/* FOOTER ACTIONS */}
                <div className={styles.actions}>
                    <button type="submit" className={styles.btnSave} disabled={loading}>
                        {loading ? <Loader2 className={styles.spinnerIcon} size={18} /> : <Save size={18} />}
                        {loading ? "Mise à jour..." : "Enregistrer les modifications"}
                    </button>
                    <button type="button" className={styles.btnCancel} onClick={() => navigate("/admin/ressources")}>
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}