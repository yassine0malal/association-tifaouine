import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProject } from "./projectSliceAdmin";
import { fetchDomains } from "../../../domains/domainsSlice";
import { fetchPartenaires } from "../../../public/about/partnerSlice";
import { protectedApi } from "../../Login/authService";
import styles from "../AdminProjetCreate.module.css";
import ConfirmPopup from "../../../../components/popup/ConfirmPopup";
import BackButton from "../../../../components/common/admin/BackButton";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminProjetEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [savePopup, setSavePopup] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    // Redux
    const { data: projectData, loading } = useSelector((state) => state.singleProject || {});
    const { partenaires: partners } = useSelector((state) => state.partenaires || {});
    const { data: domains } = useSelector((state) => state.domains || {});

    // Form state
    const [formData, setFormData] = useState({
        domaine_id: "",
        titre_fr: "",
        titre_ar: "",
        titre_en: "",
        description_fr: "",
        description_ar: "",
        description_en: "",
        statut: "Planifié",
        localisation: "",
        nb_beneficiaires: 0,
        budget: "",
        date_debut: "",
        date_fin: "",
        partenariat_ids: [],
    });

    const [imagePrincipale, setImagePrincipale] = useState(null); // { file, url }
    const [extraImages, setExtraImages] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);
    const [isImageValid, setIsImageValid] = useState(true);
    const [sizeWarning, setSizeWarning] = useState(null);
    const [formError, setFormError] = useState("");

    const mainFileRef = useRef();
    const extraFileRef = useRef();
    const videoFileRef = useRef();

    // Chargement initial
    useEffect(() => {
        dispatch(fetchDomains());
        dispatch(fetchPartenaires({ lang: "fr" }));
        if (id) {
            dispatch(fetchProject({ id, lang: "fr" }));
        }
    }, [dispatch, id]);

    // Pré-remplissage
    useEffect(() => {
        if (!projectData || Object.keys(projectData).length === 0) return;
        const p = projectData.data || projectData;

        setFormData({
            domaine_id: p.domaine_id || "",
            titre_fr: p.titre_fr || "",
            titre_ar: p.titre_ar || "",
            titre_en: p.titre_en || "",
            description_fr: p.description_fr || "",
            description_ar: p.description_ar || "",
            description_en: p.description_en || "",
            statut: p.statut || "Planifié",
            localisation: p.localisation || "",
            nb_beneficiaires: p.nb_beneficiaires || 0,
            budget: p.budget || "",
            date_debut: p.date_debut ? p.date_debut.slice(0, 10) : "",
            date_fin: p.date_fin ? p.date_fin.slice(0, 10) : "",
            partenariat_ids: p.partenariat_ids || [],
        });

        if (p.image_principale) {
            setImagePrincipale({
                file: null,
                url: `${BASE_BACK_END_URL}${p.image_principale}`,
            });
        }

        if (p.images && Array.isArray(p.images)) {
            setExtraImages(
                p.images.map(imgObj => ({
                    file: null,
                    url: imgObj.url.startsWith('http') ? imgObj.url : `${BASE_BACK_END_URL}${imgObj.url}`,
                }))
            );
        }

        if (p.videos && Array.isArray(p.videos)) {
            setVideoFiles(
                p.videos.map(v => ({
                    file: null,
                    url: typeof v === 'string' ? (v.startsWith('http') ? v : `${BASE_BACK_END_URL}${v}`) : `${BASE_BACK_END_URL}${v.url}`,
                }))
            );
        }
    }, [projectData]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePartnerChange = (e) => {
        const value = parseInt(e.target.value);
        if (!value) return;
        setFormData(prev => {
            if (prev.partenariat_ids.includes(value)) return prev;
            return { ...prev, partenariat_ids: [...prev.partenariat_ids, value] };
        });
        e.target.value = "";
    };

    const removePartner = (pId) => {
        setFormData(prev => ({
            ...prev,
            partenariat_ids: prev.partenariat_ids.filter(id => id !== pId),
        }));
    };

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
            setImagePrincipale({ file, url });
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

    const handleExtraImages = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
        setExtraImages(prev => [...prev, ...newImages]);
        e.target.value = '';
    };

    const removeExtra = (index) => setExtraImages(prev => prev.filter((_, i) => i !== index));

    const handleVideoSelect = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
        setVideoFiles(prev => [...prev, ...newVideos]);
        e.target.value = '';
    };

    const removeVideo = (index) => setVideoFiles(prev => prev.filter((_, i) => i !== index));

    






    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        // Construire le FormData
        const dataToSend = new FormData();

        Object.keys(formData).forEach(key => {
            if (key === "partenariat_ids") {
                formData.partenariat_ids.forEach(id => dataToSend.append("partenariat_ids[]", id));
            } else {
                dataToSend.append(key, formData[key]);
            }
        });

        if (imagePrincipale?.file) {
            dataToSend.append("imagePrincipale", imagePrincipale.file);
        } else if (imagePrincipale?.url) {
            dataToSend.append("existingImagePrincipale", imagePrincipale.url.replace(BASE_BACK_END_URL, ""));
        }

        extraImages.forEach(img => {
            if (img.file) dataToSend.append("extraImages", img.file);
            else if (img.url) dataToSend.append("existingExtraImages[]", img.url.replace(BASE_BACK_END_URL, ""));
        });

        videoFiles.forEach(v => {
            if (v.file) dataToSend.append("extraVideos", v.file);
            else if (v.url) dataToSend.append("existingVideos[]", v.url.replace(BASE_BACK_END_URL, ""));
        });
        setPendingData(dataToSend);
        setSavePopup(true);
        console.log("--- FormData Debug ---");
        for (let [key, value] of dataToSend.entries()) {
            console.log(`${key}:`, value);
        }
        debugger;
    };

    // ✅ Envoi réel après confirmation
    const confirmSave = async () => {
        try {
            const response = await protectedApi.put(`/api/projets/complet/${id}`, pendingData);
            if (response.data.success) {
                setSavePopup(false);
                navigate("/admin/projets");
            }
        } catch (error) {
            setSavePopup(false);
            setFormError(error.response?.data?.message || "Une erreur est survenue.");
        }
    };






    if (loading) return <p style={{ padding: "40px" }}>Chargement du projet #{id}...</p>;

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <BackButton label="Retour aux projets" />
                <h1 className={styles.pageTitle}>Modifier le Projet #{id}</h1>
                <p className={styles.pageSub}>
                    Mettez à jour les informations de <strong>{formData.titre_fr || "ce projet"}</strong>.
                </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>

                {/* Domaine */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Domaine d'intervention</label>
                    <div className={styles.selectWrap}>
                        <select
                            className={styles.select}
                            name="domaine_id"
                            value={formData.domaine_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Sélectionner un domaine</option>
                            {domains?.map((dom) => (
                                <option key={dom.id} value={dom.id}>
                                    {dom.label}
                                </option>
                            ))}
                        </select>
                        <span className={styles.chevron}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                        </span>
                    </div>
                </div>

                {/* Partenaires */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Partenaires du projet</label>
                    <div className={styles.selectWrap}>
                        <select
                            className={styles.select}
                            onChange={handlePartnerChange}
                            value=""
                        >
                            <option value="">Ajouter un partenaire...</option>
                            {partners?.filter(p => !formData.partenariat_ids.includes(p.id)).map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nom || p.name}
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
                                const partenaire = partners?.find(p => p.id === pId);
                                return (
                                    <div key={pId} className={styles.tag}>
                                        <span>{partenaire?.nom || partenaire?.name || "Partenaire inconnu"}</span>
                                        <button type="button" onClick={() => removePartner(pId)} className={styles.removeTag}>×</button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Image principale */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Image principale</label>
                    <p className={styles.imageHint}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                        Taille recommandée : <strong>300 × 200 px</strong>
                    </p>

                    <div
                        className={`${styles.uploadZone} ${imagePrincipale ? styles.uploadZoneCompact : ""} ${!isImageValid ? styles.uploadZoneError : ""}`}
                        onDrop={handleMainDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => mainFileRef.current.click()}
                    >
                        {imagePrincipale ? (
                            <div className={styles.mainImageWrapper}>
                                <img src={imagePrincipale.url} alt="principale" className={styles.mainPreviewInside} />
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

                    {/* Galerie photos */}
                    {(imagePrincipale || extraImages.length > 0) && (
                        <div className={styles.galleryGrid}>
                            {imagePrincipale && (
                                <div className={styles.galleryItem}>
                                    <img src={imagePrincipale.url} alt="miniature-principale" />
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

                {/* Vidéos */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Vidéos du projet (optionnel)</label>
                    <p className={styles.imageHint}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                        </svg>
                        Formats acceptés : <strong>MP4, MOV, AVI</strong> — max 100MB par vidéo
                    </p>

                    {videoFiles.length > 0 && (
                        <div className={styles.videoList}>
                            {videoFiles.map((v, i) => (
                                <div key={i} className={styles.videoItem}>
                                    <video src={v.url} controls className={styles.videoPreview} />
                                    <button type="button" className={styles.removeBtn} onClick={() => removeVideo(i)}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <path d="M18 6 6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <span className={styles.videoName}>{v.file?.name || "Vidéo existante"}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div
                        className={styles.uploadZone}
                        onClick={() => videoFileRef.current.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const files = Array.from(e.dataTransfer.files);
                            const newVideos = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
                            setVideoFiles(prev => [...prev, ...newVideos]);
                        }}
                    >
                        <div className={styles.uploadPlaceholder}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="1.5">
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                            <p>{videoFiles.length > 0 ? `${videoFiles.length} vidéo(s) — Cliquez pour en ajouter` : "Déposez les vidéos ou cliquez pour parcourir"}</p>
                        </div>
                        <input
                            ref={videoFileRef}
                            type="file"
                            accept="video/mp4,video/mov,video/avi,video/*"
                            multiple
                            className={styles.hiddenInput}
                            onChange={handleVideoSelect}
                        />
                    </div>
                </div>

                {/* Titres */}
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

                {/* Descriptions */}
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

                {/* Meta données */}
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
                            <input type="number" className={styles.input} name="nb_beneficiaires" placeholder="0" value={formData.nb_beneficiaires} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Budget total (DH)</label>
                        <div className={styles.iconInput}>
                            {/* Icône budget identique à celle du create */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" >
                                <path d="M11.7255 17.1019C11.6265 16.8844 11.4215 16.7257 11.1734 16.6975C10.9633 16.6735 10.7576 16.6285 10.562 16.5636C10.4743 16.5341 10.392 16.5019 10.3158 16.4674L10.4424 16.1223C10.5318 16.1622 10.6239 16.1987 10.7182 16.2317L10.7221 16.2331L10.7261 16.2344C11.0287 16.3344 11.3265 16.3851 11.611 16.3851C11.8967 16.3851 12.1038 16.3468 12.2629 16.2647L12.2724 16.2598L12.2817 16.2544C12.5227 16.1161 12.661 15.8784 12.661 15.6021C12.661 15.2955 12.4956 15.041 12.2071 14.9035C12.062 14.8329 11.8559 14.7655 11.559 14.6917C11.2545 14.6147 10.9987 14.533 10.8003 14.4493C10.6553 14.3837 10.5295 14.279 10.4161 14.1293C10.3185 13.9957 10.2691 13.7948 10.2691 13.5319C10.2691 13.2147 10.3584 12.9529 10.5422 12.7315C10.7058 12.5375 10.9381 12.4057 11.2499 12.3318C11.4812 12.277 11.6616 12.1119 11.7427 11.8987C11.8344 12.1148 12.0295 12.2755 12.2723 12.3142C12.4751 12.3465 12.6613 12.398 12.8287 12.4677L12.7122 12.8059C12.3961 12.679 12.085 12.6149 11.7841 12.6149C10.7848 12.6149 10.7342 13.3043 10.7342 13.4425C10.7342 13.7421 10.896 13.9933 11.1781 14.1318L11.186 14.1357L11.194 14.1393C11.3365 14.2029 11.5387 14.2642 11.8305 14.3322C12.1322 14.4004 12.3838 14.4785 12.5815 14.5651L12.5856 14.5669L12.5897 14.5686C12.7365 14.6297 12.8624 14.7317 12.9746 14.8805L12.9764 14.8828L12.9782 14.8852C13.0763 15.012 13.1261 15.2081 13.1261 15.4681C13.1261 15.7682 13.0392 16.0222 12.8604 16.2447C12.7053 16.4377 12.4888 16.5713 12.1983 16.6531C11.974 16.7163 11.8 16.8878 11.7255 17.1019Z" fill="var(--accent)" />
                                <path d="M11.9785 18H11.497C11.3893 18 11.302 17.9105 11.302 17.8V17.3985C11.302 17.2929 11.2219 17.2061 11.1195 17.1944C10.8757 17.1667 10.6399 17.115 10.412 17.0394C10.1906 16.9648 9.99879 16.8764 9.83657 16.7739C9.76202 16.7268 9.7349 16.6312 9.76572 16.5472L10.096 15.6466C10.1405 15.5254 10.284 15.479 10.3945 15.5417C10.5437 15.6262 10.7041 15.6985 10.8755 15.7585C11.131 15.8429 11.3762 15.8851 11.611 15.8851C11.8129 15.8851 11.9572 15.8628 12.0437 15.8181C12.1302 15.7684 12.1735 15.6964 12.1735 15.6021C12.1735 15.4929 12.1158 15.411 12.0004 15.3564C11.8892 15.3018 11.7037 15.2422 11.4442 15.1777C11.1104 15.0933 10.8323 15.0039 10.6098 14.9096C10.3873 14.8103 10.1936 14.6514 10.0288 14.433C9.86396 14.2096 9.78156 13.9092 9.78156 13.5319C9.78156 13.095 9.91136 12.7202 10.1709 12.4074C10.4049 12.13 10.7279 11.9424 11.1401 11.8447C11.2329 11.8227 11.302 11.7401 11.302 11.6425V11.2C11.302 11.0895 11.3893 11 11.497 11H11.9785C12.0862 11 12.1735 11.0895 12.1735 11.2V11.6172C12.1735 11.7194 12.2487 11.8045 12.3471 11.8202C12.7082 11.8777 13.0255 11.9866 13.2989 12.1469C13.3765 12.1924 13.4073 12.2892 13.3775 12.3756L13.0684 13.2725C13.0275 13.3914 12.891 13.4417 12.7812 13.3849C12.433 13.2049 12.1007 13.1149 11.7841 13.1149C11.4091 13.1149 11.2216 13.2241 11.2216 13.4425C11.2216 13.5468 11.2773 13.6262 11.3885 13.6809C11.4998 13.7305 11.6831 13.7851 11.9386 13.8447C12.2682 13.9192 12.5464 14.006 12.773 14.1053C12.9996 14.1996 13.1953 14.356 13.3602 14.5745C13.5291 14.7929 13.6136 15.0908 13.6136 15.4681C13.6136 15.8851 13.4879 16.25 13.2365 16.5628C13.0176 16.8354 12.7145 17.0262 12.3274 17.1353C12.2384 17.1604 12.1735 17.2412 12.1735 17.3358V17.8C12.1735 17.9105 12.0862 18 11.9785 18Z" fill="var(--accent)" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M9.59235 5H13.8141C14.8954 5 14.3016 6.664 13.8638 7.679L13.3656 8.843L13.2983 9C13.7702 8.97651 14.2369 9.11054 14.6282 9.382C16.0921 10.7558 17.2802 12.4098 18.1256 14.251C18.455 14.9318 18.5857 15.6958 18.5019 16.451C18.4013 18.3759 16.8956 19.9098 15.0182 20H8.38823C6.51033 19.9125 5.0024 18.3802 4.89968 16.455C4.81587 15.6998 4.94656 14.9358 5.27603 14.255C6.12242 12.412 7.31216 10.7565 8.77823 9.382C9.1696 9.11054 9.63622 8.97651 10.1081 9L10.0301 8.819L9.54263 7.679C9.1068 6.664 8.5101 5 9.59235 5Z" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.2983 9.75C13.7125 9.75 14.0483 9.41421 14.0483 9C14.0483 8.58579 13.7125 8.25 13.2983 8.25V9.75ZM10.1081 8.25C9.69391 8.25 9.35812 8.58579 9.35812 9C9.35812 9.41421 9.69391 9.75 10.1081 9.75V8.25ZM15.9776 8.64988C16.3365 8.44312 16.4599 7.98455 16.2531 7.62563C16.0463 7.26671 15.5878 7.14336 15.2289 7.35012L15.9776 8.64988ZM13.3656 8.843L13.5103 9.57891L13.5125 9.57848L13.3656 8.843ZM10.0301 8.819L10.1854 8.08521L10.1786 8.08383L10.0301 8.819ZM8.166 7.34357C7.80346 7.14322 7.34715 7.27469 7.1468 7.63722C6.94644 7.99976 7.07791 8.45607 7.44045 8.65643L8.166 7.34357ZM13.2983 8.25H10.1081V9.75H13.2983V8.25ZM15.2289 7.35012C14.6019 7.71128 13.9233 7.96683 13.2187 8.10752L13.5125 9.57848C14.3778 9.40568 15.2101 9.09203 15.9776 8.64988L15.2289 7.35012ZM13.2209 8.10709C12.2175 8.30441 11.1861 8.29699 10.1854 8.08525L9.87486 9.55275C11.0732 9.80631 12.3086 9.81521 13.5103 9.57891L13.2209 8.10709ZM10.1786 8.08383C9.47587 7.94196 8.79745 7.69255 8.166 7.34357L7.44045 8.65643C8.20526 9.0791 9.02818 9.38184 9.88169 9.55417L10.1786 8.08383Z" fill="var(--accent)" />
                            </svg>
                            <input type="number" className={styles.input} name="budget" placeholder="Montant" value={formData.budget} onChange={handleChange} />
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

                {formError && (
                    <div style={{
                        color: "#d93025",
                        backgroundColor: "#fce8e6",
                        padding: "12px",
                        borderRadius: "6px",
                        marginBottom: "20px",
                        textAlign: "center",
                        fontWeight: "500"
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: "8px" }}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {formError}
                    </div>
                )}

                {/* Boutons */}
                <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                    <button type="submit" className={styles.submitBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                        Enregistrer les modifications
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className={styles.submitBtn} style={{ background: "transparent", color: "#c4a050", border: "1px solid #c4a050" }}>
                        Annuler
                    </button>
                </div>

            </form>
            <ConfirmPopup
                isOpen={savePopup}
                onClose={() => setSavePopup(false)}
                onConfirm={confirmSave}
                variant="success"
                title="Enregistrer les modifications ?"
                description="Les changements seront appliqués immédiatement sur le projet."
                detailLabel="Projet modifié"
                detailValue={formData.titre_fr || `Projet #${id}`}
                confirmLabel="Enregistrer"
                cancelLabel="Continuer l'édition"
            />
        </div>
    );
}