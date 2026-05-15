// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import styles from "./AdminResourceEdit.module.css";
// import { createResource, resetStatus } from "./adminResourceSlice";

// // Components
// import Info from "../../../components/popup/Info";
// import {
//     ArrowLeft,
//     FileText,
//     Type,
//     AlignLeft,
//     Loader2,
//     Save,
//     Upload,
//     Image as ImageIcon
// } from "lucide-react";

// const formatValidationError = (error) => {
//     if (!error) return null;
//     if (typeof error === 'string') return error;
//     const data = error?.response?.data || error;
//     if (data.details && Array.isArray(data.details)) {
//         return `Veuillez corriger les erreurs : ${data.details.map(d => d.message).join(', ')}`;
//     }
//     return data.message || 'Une erreur est survenue';
// };

// export default function AdminResourceAdd() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const imageInputRef = useRef(null);
//     const documentInputRef = useRef(null);

//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [showSuccessPopup, setShowSuccessPopup] = useState(false);

//     const [previewImage, setPreviewImage] = useState(null);
//     const [imageFile, setImageFile] = useState(null);
//     const [resourceFile, setResourceFile] = useState(null);

//     const [formData, setFormData] = useState({
//         type: "rapport",
//         titre_fr: "",
//         titre_ar: "",
//         titre_en: "",
//         description_fr: "",
//         description_ar: "",
//         description_en: "",
//         isFeatured: false,
//     });

//     // ---------- NEW STATE FOR ERRORS ----------
//     const [errors, setErrors] = useState({});

//     const { loading, error, success } = useSelector((state) => state.adminResources);

//     useEffect(() => {
//         dispatch(resetStatus());
//         return () => dispatch(resetStatus());
//     }, [dispatch]);

//     useEffect(() => {
//         if (success && isSubmitting) {
//             setShowSuccessPopup(true);
//             setIsSubmitting(false);
//         }
//     }, [success, isSubmitting]);

//     const handleClosePopup = () => {
//         setShowSuccessPopup(false);
//         dispatch(resetStatus());
//         navigate("/admin/ressources");
//     };

//     // ---------- UPDATE HANDLERS THAT CLEAR ERRORS ----------
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         // Clear error for this field when user starts typing
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: null }));
//         }
//     };
//     const handleCheckboxChange = (e) => {
//         const { name, checked } = e.target;
//         setFormData(prev => ({ ...prev, [name]: checked }));
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImageFile(file);
//             setPreviewImage(URL.createObjectURL(file));
//             if (errors.imageFile) {
//                 setErrors(prev => ({ ...prev, imageFile: null }));
//             }
//         }
//     };

//     const handleDocumentChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setResourceFile(file);
//             if (errors.resourceFile) {
//                 setErrors(prev => ({ ...prev, resourceFile: null }));
//             }
//         }
//     };

//     // ---------- VALIDATION FUNCTION ----------
//     const validate = () => {
//         const newErrors = {};

//         // Check required files
//         if (!imageFile) {
//             newErrors.imageFile = "L'image de couverture est obligatoire.";
//         }
//         if (!resourceFile) {
//             newErrors.resourceFile = "Le fichier de la ressource (PDF/DOC) est obligatoire.";
//         }

//         // Check required text fields
//         if (!formData.titre_fr.trim()) {
//             newErrors.titre_fr = "Le titre français est obligatoire.";
//         }
//         if (!formData.titre_ar.trim()) {
//             newErrors.titre_ar = "Le titre arabe est obligatoire.";
//         }
//         if (!formData.titre_en.trim()) {
//             newErrors.titre_en = "Le titre anglais est obligatoire.";
//         }
//         if (!formData.description_fr.trim()) {
//             newErrors.description_fr = "La description française est obligatoire.";
//         }
//         if (!formData.description_ar.trim()) {
//             newErrors.description_ar = "La description arabe est obligatoire.";
//         }
//         if (!formData.description_en.trim()) {
//             newErrors.description_en = "La description anglaise est obligatoire.";
//         }

//         return newErrors;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // Run validation
//         const validationErrors = validate();
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return; // Stop submission
//         }

//         // Clear any previous errors
//         setErrors({});

//         setIsSubmitting(true);
//         const submitData = new FormData();

//         Object.keys(formData).forEach(key => {
//             submitData.append(key, formData[key]);
//         });

//         submitData.append("image_couverture", imageFile);
//         submitData.append("files", resourceFile);

//         dispatch(createResource(submitData));
//     };

//     return (
//         <div className={styles.container}>
//             <Info
//                 isOpen={showSuccessPopup}
//                 onClose={handleClosePopup}
//                 onConfirm={handleClosePopup}
//                 variant="success"
//                 title="Ajout réussi"
//                 description={`La ressource "${formData.titre_fr}" a été créée avec succès.`}
//                 confirmLabel="Retour à la liste"
//             />

//             <header className={styles.header}>
//                 <button type="button" className={styles.backBtn} onClick={() => navigate("/admin/ressources")}>
//                     <ArrowLeft size={24} />
//                 </button>
//                 <div>
//                     <h1>Ajouter une Ressource</h1>
//                 </div>
//             </header>

//             {error && <div className={styles.errorBanner}>{formatValidationError(error)}</div>}

//             {/* ---------- NOTE: ADDED noValidate ---------- */}
//             <form onSubmit={handleSubmit} className={styles.form} noValidate>

//                 {/* SECTION: IMAGE DE COUVERTURE */}
//                 <section className={styles.section}>
//                     <h2 className={styles.sectionTitle}>Image de Couverture *</h2>
//                     <div
//                         className={`${styles.imageContainer} ${!previewImage ? styles.emptyImage : ""}`}
//                         onClick={() => imageInputRef.current.click()}
//                         style={{
//                             cursor: 'pointer',
//                             position: 'relative',
//                             overflow: 'hidden',
//                             borderRadius: '12px',
//                             backgroundColor: '#f0f0f0',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             minHeight: '200px'
//                         }}
//                     >
//                         {previewImage ? (
//                             <img
//                                 src={previewImage}
//                                 alt="Aperçu"
//                                 className={styles.coverImage}
//                                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                             />
//                         ) : (
//                             <div style={{ textAlign: 'center', color: '#888' }}>
//                                 <ImageIcon size={48} strokeWidth={1} />
//                                 <p style={{ fontSize: '14px', marginTop: '10px' }}>Aucune image sélectionnée</p>
//                             </div>
//                         )}

//                         <div className={styles.imageOverlay} style={{
//                             position: 'absolute',
//                             inset: 0,
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             background: 'rgba(0,0,0,0.5)',
//                             color: 'white',
//                             opacity: previewImage ? 0 : 1,
//                             transition: 'opacity 0.3s'
//                         }}>
//                             <Upload size={30} />
//                             <span style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>
//                                 {previewImage ? "Changer l'image" : "Cliquez pour uploader *"}
//                             </span>
//                         </div>

//                         <input
//                             type="file"
//                             ref={imageInputRef}
//                             onChange={handleImageChange}
//                             accept="image/*"
//                             style={{ display: "none" }}
//                         />
//                     </div>
//                     {/* ---------- ERROR DISPLAY ---------- */}
//                     {errors.imageFile && <p style={{ color: 'red', marginTop: '8px', fontSize: '0.85rem' }}>{errors.imageFile}</p>}
//                 </section>

//                 {/* SECTION: INFORMATIONS GÉNÉRALES */}
//                 <section className={styles.cardSection}>
//                     <h2 className={styles.cardTitle}>Fichiers & Type</h2>

//                     <div className={styles.inputGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
//                         <input
//                             type="checkbox"
//                             name="isFeatured"
//                             id="isFeatured"
//                             checked={formData.isFeatured}
//                             onChange={handleCheckboxChange}
//                             style={{ width: '20px', height: '20px', cursor: 'pointer' }}
//                         />
//                         <label htmlFor="isFeatured" style={{ marginBottom: 0, cursor: 'pointer' }}>
//                             Mettre cette ressource preferable
//                         </label>
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label>Type de ressource *</label>
//                         <select name="type" value={formData.type} onChange={handleInputChange} className={styles.input}>
//                             <option value="rapport">Rapport Annuel</option>
//                             <option value="guide">Guide technique</option>
//                             <option value="document">Document officiel</option>
//                             <option value="photo">Photographie</option>
//                             <option value="video">Vidéo</option>
//                         </select>
//                     </div>

//                     <div className={styles.inputGroup}>
//                         <label>Fichier de la ressource (PDF/DOC) *</label>
//                         <div
//                             className={`${styles.fileUploadZone} ${resourceFile ? styles.hasFile : ""}`}
//                             onClick={() => documentInputRef.current.click()}
//                         >
//                             <div className={styles.fileUploadContent}>
//                                 {resourceFile ? (
//                                     <>
//                                         <FileText className={styles.fileIcon} size={24} />
//                                         <span className={styles.fileName}>{resourceFile.name}</span>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Upload className={styles.uploadIcon} size={24} />
//                                         <span>Sélectionner le document obligatoire *</span>
//                                     </>
//                                 )}
//                             </div>
//                             <input
//                                 type="file"
//                                 ref={documentInputRef}
//                                 onChange={handleDocumentChange}
//                                 accept=".pdf,.doc,.docx"
//                                 style={{ display: "none" }}
//                             />
//                         </div>
//                         {errors.resourceFile && <p style={{ color: 'red', marginTop: '8px', fontSize: '0.85rem' }}>{errors.resourceFile}</p>}
//                     </div>
//                 </section>

//                 {/* SECTION: TITRES */}
//                 <section className={styles.transparentSection}>
//                     <h2 className={styles.sectionHeader}><Type size={20} /> Titres</h2>
//                     <div className={styles.inputGroup}>
//                         <label>FRANÇAIS (FR) *</label>
//                         <input type="text" name="titre_fr" value={formData.titre_fr} onChange={handleInputChange} className={styles.input} placeholder="Obligatoire" />
//                         {errors.titre_fr && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.titre_fr}</p>}
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label>ARABE (AR) *</label>
//                         <input type="text" dir="rtl" name="titre_ar" value={formData.titre_ar} onChange={handleInputChange} className={`${styles.inputRtl} ${styles.arabic}`} placeholder="إجباري" />
//                         {errors.titre_ar && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.titre_ar}</p>}
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label>ANGLAIS (EN) *</label>
//                         <input type="text" name="titre_en" value={formData.titre_en} onChange={handleInputChange} className={styles.input} placeholder="Required" />
//                         {errors.titre_en && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.titre_en}</p>}
//                     </div>
//                 </section>

//                 {/* SECTION: DESCRIPTIONS */}
//                 <section className={styles.transparentSection}>
//                     <h2 className={styles.sectionHeader}><AlignLeft size={20} /> Descriptions</h2>
//                     <div className={styles.inputGroup}>
//                         <label>FRANÇAIS (FR) *</label>
//                         <textarea name="description_fr" value={formData.description_fr} onChange={handleInputChange} rows="4" className={styles.textarea} placeholder="Description obligatoire" />
//                         {errors.description_fr && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.description_fr}</p>}
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label>ARABE (AR) *</label>
//                         <textarea dir="rtl" name="description_ar" value={formData.description_ar} onChange={handleInputChange} rows="4" className={`${styles.textareaRtl} ${styles.arabic}`} placeholder="الوصف إجباري" />
//                         {errors.description_ar && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.description_ar}</p>}
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label>ANGLAIS (EN) *</label>
//                         <textarea name="description_en" value={formData.description_en} onChange={handleInputChange} rows="4" className={styles.textarea} placeholder="Description required" />
//                         {errors.description_en && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.description_en}</p>}
//                     </div>
//                 </section>

//                 <div className={styles.actions}>
//                     <button type="submit" className={styles.btnSave} disabled={loading}>
//                         {loading ? <Loader2 className={styles.spinnerIcon} size={18} /> : <Save size={18} />}
//                         {loading ? "Création..." : "Créer la ressource"}
//                     </button>
//                     <button type="button" className={styles.btnCancel} onClick={() => navigate("/admin/ressources")}>
//                         Annuler
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }


import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./AdminResourceEdit.module.css";
import { createResource, resetStatus } from "./adminResourceSlice";

// Components
import Info from "../../../components/popup/Info";
import {
    ArrowLeft,
    FileText,
    Type,
    AlignLeft,
    Loader2,
    Save,
    Upload,
    Image as ImageIcon
} from "lucide-react";

const formatValidationError = (error) => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    const data = error?.response?.data || error;
    if (data.details && Array.isArray(data.details)) {
        return `Veuillez corriger les erreurs : ${data.details.map(d => d.message).join(', ')}`;
    }
    return data.message || 'Une erreur est survenue';
};

export default function AdminResourceAdd() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const imageInputRef = useRef(null);
    const documentInputRef = useRef(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [resourceFile, setResourceFile] = useState(null);

    const [formData, setFormData] = useState({
        type: "rapport",
        titre_fr: "",
        titre_ar: "",
        titre_en: "",
        description_fr: "",
        description_ar: "",
        description_en: "",
        isFeatured: false,
    });

    // ---------- NEW STATE FOR ERRORS ----------
    const [errors, setErrors] = useState({});

    const { loading, error, success } = useSelector((state) => state.adminResources);

    useEffect(() => {
        dispatch(resetStatus());
        return () => dispatch(resetStatus());
    }, [dispatch]);

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

    // ---------- UPDATE HANDLERS THAT CLEAR ERRORS ----------
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
            if (errors.imageFile) {
                setErrors(prev => ({ ...prev, imageFile: null }));
            }
        }
    };

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResourceFile(file);
            if (errors.resourceFile) {
                setErrors(prev => ({ ...prev, resourceFile: null }));
            }
        }
    };

    // ---------- VALIDATION FUNCTION WITH 120 CHAR LIMIT ----------
    const validate = () => {
        const newErrors = {};

        // Check required files
        if (!imageFile) {
            newErrors.imageFile = "L'image de couverture est obligatoire.";
        }
        if (!resourceFile) {
            newErrors.resourceFile = "Le fichier de la ressource (PDF/DOC) est obligatoire.";
        }

        // Check required text fields
        if (!formData.titre_fr.trim()) {
            newErrors.titre_fr = "Le titre français est obligatoire.";
        }
        if (!formData.titre_ar.trim()) {
            newErrors.titre_ar = "Le titre arabe est obligatoire.";
        }
        if (!formData.titre_en.trim()) {
            newErrors.titre_en = "Le titre anglais est obligatoire.";
        }

        // Validate descriptions: required & max length fallback
        if (!formData.description_fr.trim()) {
            newErrors.description_fr = "La description française est obligatoire.";
        } else if (formData.description_fr.length > 120) {
            newErrors.description_fr = "La description française ne doit pas dépasser 120 caractères.";
        }

        if (!formData.description_ar.trim()) {
            newErrors.description_ar = "La description arabe est obligatoire.";
        } else if (formData.description_ar.length > 120) {
            newErrors.description_ar = "La description arabe ne doit pas dépasser 120 caractères.";
        }

        if (!formData.description_en.trim()) {
            newErrors.description_en = "La description anglaise est obligatoire.";
        } else if (formData.description_en.length > 120) {
            newErrors.description_en = "La description anglaise ne doit pas dépasser 120 caractères.";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Run validation
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Stop submission
        }

        // Clear any previous errors
        setErrors({});

        setIsSubmitting(true);
        const submitData = new FormData();

        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        submitData.append("image_couverture", imageFile);
        submitData.append("files", resourceFile);

        dispatch(createResource(submitData));
    };

    return (
        <div className={styles.container}>
            <Info
                isOpen={showSuccessPopup}
                onClose={handleClosePopup}
                onConfirm={handleClosePopup}
                variant="success"
                title="Ajout réussi"
                description={`La ressource "${formData.titre_fr}" a été créée avec succès.`}
                confirmLabel="Retour à la liste"
            />

            <header className={styles.header}>
                <button type="button" className={styles.backBtn} onClick={() => navigate("/admin/ressources")}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1>Ajouter une Ressource</h1>
                </div>
            </header>

            {error && <div className={styles.errorBanner}>{formatValidationError(error)}</div>}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>

                {/* SECTION: IMAGE DE COUVERTURE */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Image de Couverture *</h2>
                    <div
                        className={`${styles.imageContainer} ${!previewImage ? styles.emptyImage : ""}`}
                        onClick={() => imageInputRef.current.click()}
                        style={{
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '12px',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '200px'
                        }}
                    >
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Aperçu"
                                className={styles.coverImage}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', color: '#888' }}>
                                <ImageIcon size={48} strokeWidth={1} />
                                <p style={{ fontSize: '14px', marginTop: '10px' }}>Aucune image sélectionnée</p>
                            </div>
                        )}

                        <div className={styles.imageOverlay} style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            opacity: previewImage ? 0 : 1,
                            transition: 'opacity 0.3s'
                        }}>
                            <Upload size={30} />
                            <span style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>
                                {previewImage ? "Changer l'image" : "Cliquez pour uploader *"}
                            </span>
                        </div>

                        <input
                            type="file"
                            ref={imageInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                    </div>
                    {errors.imageFile && <p style={{ color: 'red', marginTop: '8px', fontSize: '0.85rem' }}>{errors.imageFile}</p>}
                </section>

                {/* SECTION: INFORMATIONS GÉNÉRALES */}
                <section className={styles.cardSection}>
                    <h2 className={styles.cardTitle}>Fichiers & Type</h2>

                    <div className={styles.inputGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <input
                            type="checkbox"
                            name="isFeatured"
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleCheckboxChange}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <label htmlFor="isFeatured" style={{ marginBottom: 0, cursor: 'pointer' }}>
                            Mettre cette ressource preferable
                        </label>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Type de ressource *</label>
                        <select name="type" value={formData.type} onChange={handleInputChange} className={styles.input}>
                            <option value="rapport">Rapport Annuel</option>
                            <option value="guide">Guide technique</option>
                            <option value="document">Document officiel</option>
                            <option value="photo">Photographie</option>
                            <option value="video">Vidéo</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Fichier de la ressource (PDF/DOC) *</label>
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
                                        <span>Sélectionner le document obligatoire *</span>
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
                        {errors.resourceFile && <p style={{ color: 'red', marginTop: '8px', fontSize: '0.85rem' }}>{errors.resourceFile}</p>}
                    </div>
                </section>

                {/* SECTION: TITRES */}
                <section className={styles.transparentSection}>
                    <h2 className={styles.sectionHeader}><Type size={20} /> Titres</h2>
                    <div className={styles.inputGroup}>
                        <label>FRANÇAIS (FR) *</label>
                        <input type="text" name="titre_fr" value={formData.titre_fr} onChange={handleInputChange} className={styles.input} placeholder="Obligatoire" />
                        {errors.titre_fr && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.titre_fr}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label>ARABE (AR) *</label>
                        <input type="text" dir="rtl" name="titre_ar" value={formData.titre_ar} onChange={handleInputChange} className={`${styles.inputRtl} ${styles.arabic}`} placeholder="إجباري" />
                        {errors.titre_ar && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.titre_ar}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label>ANGLAIS (EN) *</label>
                        <input type="text" name="titre_en" value={formData.titre_en} onChange={handleInputChange} className={styles.input} placeholder="Required" />
                        {errors.titre_en && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.titre_en}</p>}
                    </div>
                </section>

                {/* SECTION: DESCRIPTIONS */}
                <section className={styles.transparentSection}>
                    <h2 className={styles.sectionHeader}><AlignLeft size={20} /> Descriptions</h2>
                    
                    {/* Description FR */}
                    <div className={styles.inputGroup}>
                        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                            <label>FRANÇAIS (FR) *</label>
                            <span style={{ fontSize: '0.75rem', color: '#666', marginLeft: 'auto' }}>
                                {formData.description_fr.length}/120
                            </span>
                        </div>
                        <textarea 
                            name="description_fr" 
                            value={formData.description_fr} 
                            onChange={handleInputChange} 
                            rows="4" 
                            maxLength="120" 
                            className={styles.textarea} 
                            placeholder="Description obligatoire (Max 120 caractères)" 
                        />
                        {errors.description_fr && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.description_fr}</p>}
                    </div>

                    {/* Description AR */}
                    <div className={styles.inputGroup}>
                        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                            <label>ARABE (AR) *</label>
                            <span style={{ fontSize: '0.75rem', color: '#666', marginLeft: 'auto' }}>
                                {formData.description_ar.length}/120
                            </span>
                        </div>
                        <textarea 
                            dir="rtl" 
                            name="description_ar" 
                            value={formData.description_ar} 
                            onChange={handleInputChange} 
                            rows="4" 
                            maxLength="120" 
                            className={`${styles.textareaRtl} ${styles.arabic}`} 
                            placeholder="الوصف إجباري (الحد الأقصى 120 حرفًا)" 
                        />
                        {errors.description_ar && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.description_ar}</p>}
                    </div>

                    {/* Description EN */}
                    <div className={styles.inputGroup}>
                        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                            <label>ANGLAIS (EN) *</label>
                            <span style={{ fontSize: '0.75rem', color: '#666', marginLeft: 'auto' }}>
                                {formData.description_en.length}/120
                            </span>
                        </div>
                        <textarea 
                            name="description_en" 
                            value={formData.description_en} 
                            onChange={handleInputChange} 
                            rows="4" 
                            maxLength="120" 
                            className={styles.textarea} 
                            placeholder="Description required (Max 120 characters)" 
                        />
                        {errors.description_en && <p style={{ color: 'red', marginTop: '4px', fontSize: '0.8rem' }}>{errors.description_en}</p>}
                    </div>
                </section>

                <div className={styles.actions}>
                    <button type="submit" className={styles.btnSave} disabled={loading}>
                        {loading ? <Loader2 className={styles.spinnerIcon} size={18} /> : <Save size={18} />}
                        {loading ? "Création..." : "Créer la ressource"}
                    </button>
                    <button type="button" className={styles.btnCancel} onClick={() => navigate("/admin/ressources")}>
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}