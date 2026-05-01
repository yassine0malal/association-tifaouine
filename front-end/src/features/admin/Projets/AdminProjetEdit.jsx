import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AdminProjetCreate.module.css"; // On réutilise les mêmes styles

const DOMAINES_DISPO = [
    { id: "education", nom: "Éducation" },
    { id: "sante", nom: "Santé" },
    { id: "environnement", nom: "Environnement" },
    { id: "culture", nom: "Culture" },
    { id: "sport", nom: "Sport" },
];

const PARTENAIRES_DISPO = [
    { id: 1, nom: "INDH" },
    { id: 2, nom: "Ministère de l'Éducation" },
    { id: 3, nom: "OCP Foundation" },
    { id: 4, nom: "Région Casablanca-Settat" },
    { id: 5, nom: "Agence du Nord" },
];

// MOCK : Simulation de votre base de données pour pré-remplir le formulaire
const MOCK_PROJECTS = [
    {
        id: 1,
        domaine: "culture",
        titre_fr: "Restauration des Kasbahs",
        titre_ar: "ترميم القصبات",
        titre_en: "Kasbahs Restoration",
        description_fr: "Projet de restauration dans la région de Ouarzazate.",
        description_ar: "",
        description_en: "",
        statut: "En cours",
        localisation: "Ouarzazate, MA",
        beneficiaires: 1500,
        budget: "245000",
        date_debut: "2026-01-15",
        date_fin: "2026-12-30",
        partenariat_ids: [1, 3],
    }
];

export default function AdminProjetEdit() {
    const { id } = useParams(); // Récupère l'ID depuis l'URL (ex: /edit/1)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        domaine: "",
        titre_fr: "",
        titre_ar: "",
        titre_en: "",
        description_fr: "",
        description_ar: "",
        description_en: "",
        statut: "Planifié",
        localisation: "",
        beneficiaires: 0,
        budget: "",
        date_debut: "",
        date_fin: "",
        partenariat_ids: [],
    });

    const [mainImage, setMainImage] = useState(null);
    const [extraImages, setExtraImages] = useState([]);
    const [isImageValid, setIsImageValid] = useState(true);
    const [sizeWarning, setSizeWarning] = useState(null);

    const mainFileRef = useRef();
    const extraFileRef = useRef();

    // --- CHARGEMENT DES DONNÉES DU PROJET ---
    useEffect(() => {
        // Plus tard, remplacez ceci par un vrai fetch() vers votre API
        const projectToEdit = MOCK_PROJECTS.find(p => p.id === parseInt(id));
        
        if (projectToEdit) {
            setFormData(prev => ({
                ...prev,
                ...projectToEdit // Pré-remplit tous les champs trouvés
            }));
        } else {
            console.error("Projet introuvable !");
        }
    }, [id]);

    // --- Handlers de saisie ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePartnerChange = (e) => {
        const value = parseInt(e.target.value);
        if (!value) return;

        setFormData(prev => {
            if (prev.partenariat_ids.includes(value)) return prev;
            return {
                ...prev,
                partenariat_ids: [...prev.partenariat_ids, value]
            };
        });
        e.target.value = "";
    };

    const removePartner = (partnerId) => {
        setFormData(prev => ({
            ...prev,
            partenariat_ids: prev.partenariat_ids.filter(pId => pId !== partnerId)
        }));
    };

    // --- Logique Image Principale ---
    const processMainImage = (file) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            if (img.width < 300 || img.height < 200) {
                setSizeWarning(`Image trop petite (${img.width}×${img.height}px). Minimum : 300×200px`);
                setIsImageValid(false);
            } else {
                setSizeWarning(null);
                setIsImageValid(true);
            }
            setMainImage({ file, url });
        };
        img.src = url;
    };

    const handleMainFileSelect = (e) => {
        processMainImage(e.target.files[0]);
        e.target.value = '';
    };

    const handleMainDrop = (e) => {
        e.preventDefault();
        processMainImage(e.dataTransfer.files[0]);
    };

    // --- Logique Galerie ---
    const handleExtraImages = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
        setExtraImages(prev => [...prev, ...newImages]);
        e.target.value = '';
    };

    const removeExtra = (index) => {
        setExtraImages(prev => prev.filter((_, i) => i !== index));
    };

    // --- Soumission ---
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Mise à jour du projet ${id} avec :`, { ...formData, mainImage, extraImages });
        // Redirection après succès
        navigate("/admin/projects"); 
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                {/* Textes adaptés pour la modification */}
                <h1 className={styles.pageTitle}>Modifier le Projet #{id}</h1>
                <p className={styles.pageSub}>
                    Mettez à jour les informations de l'initiative <strong>{formData.titre_fr || "en cours"}</strong>.
                </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>

                {/* Section : Domaine */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Domaine d'intervention</label>
                    <div className={styles.selectWrap}>
                        <select
                            className={styles.select}
                            name="domaine"
                            value={formData.domaine}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Sélectionner un domaine</option>
                            {DOMAINES_DISPO.map((dom) => (
                                <option key={dom.id} value={dom.id}>{dom.nom}</option>
                            ))}
                        </select>
                        <span className={styles.chevron}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                        </span>
                    </div>
                </div>

                {/* Section : Partenaires */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Partenaires du projet</label>
                    <div className={styles.selectWrap}>
                        <select
                            className={styles.select}
                            onChange={handlePartnerChange}
                            value=""
                        >
                            <option value="">Ajouter un partenaire...</option>
                            {PARTENAIRES_DISPO.filter(p => !formData.partenariat_ids.includes(p.id)).map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nom}
                                </option>
                            ))}
                        </select>
                        <span className={styles.chevron}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                        </span>
                    </div>

                    {formData.partenariat_ids.length > 0 && (
                        <div className={styles.tagContainer}>
                            {formData.partenariat_ids.map(pId => {
                                const partenaire = PARTENAIRES_DISPO.find(p => p.id === pId);
                                return (
                                    <div key={pId} className={styles.tag}>
                                        <span>{partenaire?.nom}</span>
                                        <button
                                            type="button"
                                            onClick={() => removePartner(pId)}
                                            className={styles.removeTag}
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Section : Upload Image Principale */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Image principale</label>
                    <p className={styles.imageHint}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                        Taille recommandée : <strong>300 × 200 px</strong>
                    </p>

                    <div
                        className={`${styles.uploadZone} ${mainImage ? styles.uploadZoneCompact : ""} ${!isImageValid ? styles.uploadZoneError : ""}`}
                        onDrop={handleMainDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => mainFileRef.current.click()}
                    >
                        {mainImage ? (
                            <div className={styles.mainImageWrapper}>
                                <img src={mainImage.url} alt="principale" className={styles.mainPreviewInside} />
                                <div className={styles.changeOverlay}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                    <span>Changer l'image principale</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.uploadPlaceholder}>
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                <p>Déposez l'image ou cliquez pour parcourir</p>
                            </div>
                        )}
                        <input
                            ref={mainFileRef}
                            type="file"
                            accept="image/*"
                            className={styles.hiddenInput}
                            onChange={handleMainFileSelect}
                        />
                    </div>
                    {sizeWarning && (
                        <p className={styles.sizeWarning}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            {sizeWarning}
                        </p>
                    )}

                    {/* Galerie photo */}
                    {(mainImage || extraImages.length > 0) && (
                        <div className={styles.galleryGrid}>
                            {mainImage && (
                                <div className={styles.galleryItem}>
                                    <img src={mainImage.url} alt="miniature-principale" />
                                    <span className={styles.mainBadge}>Principale</span>
                                </div>
                            )}
                            {extraImages.map((img, i) => (
                                <div key={i} className={styles.galleryItem}>
                                    <img src={img.url} alt={`extra-${i}`} />
                                    <button type="button" className={styles.removeBtn} onClick={() => removeExtra(i)}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                            <div className={styles.addMoreBtn} onClick={() => extraFileRef.current.click()}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>
                                <span>AJOUTER</span>
                                <input
                                    ref={extraFileRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className={styles.hiddenInput}
                                    onChange={handleExtraImages}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Section : Titres Multilingues */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                        <span>Titres du projet</span>
                    </div>
                    <div className={styles.sectionBody}>
                        <div className={styles.inputWrap}>
                            <input type="text" className={styles.input} name="titre_fr" placeholder="Titre en Français" value={formData.titre_fr} onChange={handleChange} />
                            <span className={styles.langBadge}>FR</span>
                        </div>
                        <div className={styles.inputWrap}>
                            <input type="text" className={`${styles.input} ${styles.rtl}`} name="titre_ar" placeholder="عنوان المشروع" value={formData.titre_ar} onChange={handleChange} dir="rtl" />
                            <span className={`${styles.langBadge} ${styles.langLeft}`}>AR</span>
                        </div>
                        <div className={styles.inputWrap}>
                            <input type="text" className={styles.input} name="titre_en" placeholder="Title in English" value={formData.titre_en} onChange={handleChange} />
                            <span className={styles.langBadge}>EN</span>
                        </div>
                    </div>
                </div>

                {/* Section : Descriptions */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
                        <span>Descriptions</span>
                    </div>
                    <div className={styles.sectionBody}>
                        <textarea className={styles.textarea} name="description_fr" placeholder="Description détaillée (Français)" value={formData.description_fr} onChange={handleChange} />
                        <textarea className={`${styles.textarea} ${styles.rtl}`} name="description_ar" placeholder="وصف مفصل للمشروع" value={formData.description_ar} onChange={handleChange} dir="rtl" />
                        <textarea className={styles.textarea} name="description_en" placeholder="Detailed description (English)" value={formData.description_en} onChange={handleChange} />
                    </div>
                </div>

                {/* Grid : Meta Informations */}
                <div className={styles.metaGrid}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Statut actuel</label>
                        <div className={styles.iconSelect}>
                            <span className={styles.leftIcon}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                            </span>
                            <select className={styles.select} name="statut" value={formData.statut} onChange={handleChange}>
                                <option value="Planifié">Planifié</option>
                                <option value="En cours">En cours</option>
                                <option value="Terminé">Terminé</option>
                                <option value="Suspendu">Suspendu</option>
                            </select>
                            <span className={styles.rightIcon}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                            </span>
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Localisation</label>
                        <div className={styles.iconInput}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            <input type="text" className={styles.input} name="localisation" placeholder="Région, Ville" value={formData.localisation} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Bénéficiaires</label>
                        <div className={styles.iconInput}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            <input type="number" className={styles.input} name="beneficiaires" placeholder="0" value={formData.beneficiaires} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Budget total (DH)</label>
                        <div className={styles.iconInput}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>
                            <input type="text" className={styles.input} name="budget" placeholder="Montant" value={formData.budget} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Date de début</label>
                        <input type="date" className={styles.input} name="date_debut" value={formData.date_debut} onChange={handleChange} />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Date de fin</label>
                        <input type="date" className={styles.input} name="date_fin" value={formData.date_fin} onChange={handleChange} />
                    </div>
                </div>

                {/* Boutons d'action */}
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button type="submit" className={styles.submitBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /></svg>
                        Enregistrer les modifications
                    </button>
                    
                    {/* Bouton Annuler qui ramène à la page précédente */}
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)} 
                        className={styles.submitBtn} 
                        style={{ background: 'transparent', color: '#c4a050', border: '1px solid #c4a050' }}
                    >
                        Annuler
                    </button>
                </div>

            </form>
        </div>
    );
}