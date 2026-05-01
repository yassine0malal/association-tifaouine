import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProject } from "./projectSliceAdmin";
import { fetchDomains } from "../../../domains/domainsSlice";
import { fetchPartenaires } from "../../../public/about/partnerSlice";
import { protectedApi } from "../../Login/authService";
import styles from "../AdminProjetCreate.module.css";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function AdminProjetEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // --- Sélecteurs Redux ---
    const { data: projectData, loading, error } = useSelector((state) => state.singleProject);
    const { partenaires: partners } = useSelector((state) => state.partenaires);
    const { data: domains } = useSelector((state) => state.domains);

    // --- États du formulaire ---
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

    // Gestion des médias
    const [mainImage, setMainImage] = useState(null); // { file: File, url: string }
    const [extraImages, setExtraImages] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);

    // États de validation/UI
    const [isImageValid, setIsImageValid] = useState(true);
    const [sizeWarning, setSizeWarning] = useState(null);
    const [formError, setFormError] = useState("");

    // Références
    const mainFileRef = useRef();
    const extraFileRef = useRef();
    const videoFileRef = useRef();

    // 1. Charger les données initiales (Domaines, Partenaires et le Projet)
    useEffect(() => {
        dispatch(fetchDomains());
        dispatch(fetchPartenaires({ lang: "fr" }));
        if (id) {
            dispatch(fetchProject({ id, lang: "fr" }));
        }
    }, [dispatch, id]);

    // 2. Pré-remplir le formulaire quand les données du projet arrivent
    useEffect(() => {
        if (!projectData || Object.keys(projectData).length === 0) return;

        const p = projectData?.projet || projectData?.data || projectData;

        setFormData({
            domaine_id:       p.domaine_id       || p.domaine?.id || "",
            titre_fr:         p.titre_fr         || "",
            titre_ar:         p.titre_ar         || "",
            titre_en:         p.titre_en         || "",
            description_fr:   p.description_fr   || "",
            description_ar:   p.description_ar   || "",
            description_en:   p.description_en   || "",
            statut:           p.statut           || "Planifié",
            localisation:     p.localisation     || "",
            nb_beneficiaires: p.nb_beneficiaires || 0,
            budget:           p.budget           || "",
            date_debut:       p.date_debut       ? p.date_debut.slice(0, 10) : "",
            date_fin:         p.date_fin         ? p.date_fin.slice(0, 10)   : "",
            partenariat_ids:  p.partenariat_ids  || p.partenaires?.map(pt => pt.id) || [],
        });

        // Hydratation Image Principale
        const existingImage = p.image_principale || p.image;
        if (existingImage) {
            setMainImage({ file: null, url: `${BASE_BACK_END_URL}${existingImage}` });
        }

        // Hydratation Galerie
        const galerie = p.images_galerie || p.extraImages || [];
        setExtraImages(galerie.map(img => ({
            file: null,
            url: img.startsWith('http') ? img : `${BASE_BACK_END_URL}${img}`
        })));

        // Hydratation Vidéos
        const videos = p.videos || [];
        setVideoFiles(videos.map(v => ({
            file: null,
            url: v.startsWith('http') ? v : `${BASE_BACK_END_URL}${v}`
        })));

    }, [projectData]);

    // --- Gestionnaires d'événements (Handlers) ---

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
            partenariat_ids: prev.partenariat_ids.filter(id => id !== pId)
        }));
    };

    // Gestion Image Principale
    const processMainImage = (file) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            if (img.width < 300 || img.height < 200) {
                setSizeWarning(`Image trop petite (${img.width}×${img.height}px).`);
                setIsImageValid(false);
            } else {
                setSizeWarning(null);
                setIsImageValid(true);
            }
            setMainImage({ file, url });
        };
        img.src = url;
    };

    // Gestion Galerie & Vidéos
    const handleExtraImages = (e) => {
        const files = Array.from(e.target.files);
        setExtraImages(prev => [...prev, ...files.map(f => ({ file: f, url: URL.createObjectURL(f) }))]);
        e.target.value = '';
    };

    const handleVideoSelect = (e) => {
        const files = Array.from(e.target.files);
        setVideoFiles(prev => [...prev, ...files.map(f => ({ file: f, url: URL.createObjectURL(f) }))]);
        e.target.value = '';
    };

    const removeExtra = (index) => setExtraImages(prev => prev.filter((_, i) => i !== index));
    const removeVideo = (index) => setVideoFiles(prev => prev.filter((_, i) => i !== index));

    // --- Soumission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        try {
            const dataToSend = new FormData();

            // 1. Champs texte
            Object.keys(formData).forEach(key => {
                if (key === "partenariat_ids") {
                    formData.partenariat_ids.forEach(id => dataToSend.append("partenariat_ids[]", id));
                } else {
                    dataToSend.append(key, formData[key]);
                }
            });

            // 2. Image principale (seulement si changée)
            if (mainImage?.file) {
                dataToSend.append("imagePrincipale", mainImage.file);
            }

            // 3. Galerie (nouveaux fichiers seulement)
            extraImages.forEach(img => {
                if (img.file) dataToSend.append("extraImages", img.file);
            });

            // 4. Vidéos (nouveaux fichiers seulement)
            videoFiles.forEach(v => {
                if (v.file) dataToSend.append("videos", v.file);
            });

            // Note: Si votre backend doit savoir quelles images supprimer, 
            // il faudra envoyer aussi la liste des URLs conservées.

            await protectedApi.put(`/api/projets/${id}/complet`, dataToSend);
            alert("Projet mis à jour avec succès !");
            navigate("/admin/projets");

        } catch (error) {
            console.error("Erreur mise à jour:", error);
            setFormError(error.response?.data?.message || "Une erreur est survenue lors de la sauvegarde.");
        }
    };

    if (loading) return <p className={styles.loading}>Chargement du projet #{id}...</p>;
console.log(error)
    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Modifier le Projet</h1>
                <p className={styles.pageSub}>ID: {id} — {formData.titre_fr}</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                
                {/* Domaine */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Domaine d'intervention</label>
                    <div className={styles.selectWrap}>
                        <select className={styles.select} name="domaine_id" value={formData.domaine_id} onChange={handleChange} required>
                            <option value="">Sélectionner un domaine</option>
                            {domains?.map(dom => (
                                <option key={dom.id} value={dom.id}>{dom.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Partenaires */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Partenaires du projet</label>
                    <div className={styles.selectWrap}>
                        <select className={styles.select} onChange={handlePartnerChange} value="">
                            <option value="">Ajouter un partenaire...</option>
                            {partners?.filter(p => !formData.partenariat_ids.includes(p.id)).map(p => (
                                <option key={p.id} value={p.id}>{p.nom || p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.tagContainer}>
                        {formData.partenariat_ids.map(pId => {
                            const p = partners?.find(pt => pt.id === pId);
                            return (
                                <div key={pId} className={styles.tag}>
                                    <span>{p?.nom || p?.name || "Partenaire"}</span>
                                    <button type="button" onClick={() => removePartner(pId)}>×</button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Image Principale */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Image principale</label>
                    <div 
                        className={`${styles.uploadZone} ${!isImageValid ? styles.uploadZoneError : ""}`}
                        onClick={() => mainFileRef.current.click()}
                    >
                        {mainImage ? (
                            <img src={mainImage.url} alt="Aperçu" className={styles.mainPreviewInside} />
                        ) : (
                            <p>Cliquez pour ajouter une image</p>
                        )}
                        <input ref={mainFileRef} type="file" hidden onChange={(e) => processMainImage(e.target.files[0])} accept="image/*" />
                    </div>
                    {sizeWarning && <p className={styles.sizeWarning}>{sizeWarning}</p>}
                </div>

                {/* Galerie d'images */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Galerie Photos</label>
                    <div className={styles.galleryGrid}>
                        {extraImages.map((img, i) => (
                            <div key={i} className={styles.galleryItem}>
                                <img src={img.url} alt="Galerie" />
                                <button type="button" className={styles.removeBtn} onClick={() => removeExtra(i)}>×</button>
                            </div>
                        ))}
                        <div className={styles.addMoreBtn} onClick={() => extraFileRef.current.click()}>
                            <span>+ Photo</span>
                            <input ref={extraFileRef} type="file" hidden multiple onChange={handleExtraImages} accept="image/*" />
                        </div>
                    </div>
                </div>

                {/* Vidéos (Nouveau comme dans Create) */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Vidéos du projet</label>
                    <div className={styles.galleryGrid}>
                        {videoFiles.map((v, i) => (
                            <div key={i} className={styles.galleryItem}>
                                <video src={v.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button type="button" className={styles.removeBtn} onClick={() => removeVideo(i)}>×</button>
                            </div>
                        ))}
                        <div className={styles.addMoreBtn} onClick={() => videoFileRef.current.click()}>
                            <span>+ Vidéo</span>
                            <input ref={videoFileRef} type="file" hidden multiple onChange={handleVideoSelect} accept="video/*" />
                        </div>
                    </div>
                </div>

                {/* Titres et Descriptions (Sections FR/AR/EN) */}
                <div className={styles.section}>
                    <div className={styles.sectionBody}>
                        <input type="text" className={styles.input} name="titre_fr" placeholder="Titre (FR)" value={formData.titre_fr} onChange={handleChange} />
                        <input type="text" className={`${styles.input} ${styles.rtl}`} name="titre_ar" placeholder="العنوان (AR)" value={formData.titre_ar} onChange={handleChange} dir="rtl" />
                        <textarea className={styles.textarea} name="description_fr" placeholder="Description (FR)" value={formData.description_fr} onChange={handleChange} />
                        <textarea className={`${styles.textarea} ${styles.rtl}`} name="description_ar" placeholder="الوصف (AR)" value={formData.description_ar} onChange={handleChange} dir="rtl" />
                    </div>
                </div>

                {/* Meta Grid (Statut, Localisation, Budget, Dates) */}
                <div className={styles.metaGrid}>
                    <select className={styles.select} name="statut" value={formData.statut} onChange={handleChange}>
                        <option value="Planifié">Planifié</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                    </select>
                    <input type="text" className={styles.input} name="localisation" placeholder="Localisation" value={formData.localisation} onChange={handleChange} />
                    <input type="number" className={styles.input} name="budget" placeholder="Budget" value={formData.budget} onChange={handleChange} />
                    <input type="date" className={styles.input} name="date_debut" value={formData.date_debut} onChange={handleChange} />
                    <input type="date" className={styles.input} name="date_fin" value={formData.date_fin} onChange={handleChange} />
                </div>

                {formError && <div className={styles.errorBanner}>{formError}</div>}

                <div className={styles.actions}>
                    <button type="submit" className={styles.submitBtn}>Enregistrer les modifications</button>
                    <button type="button" onClick={() => navigate(-1)} className={styles.cancelBtn}>Annuler</button>
                </div>
            </form>
        </div>
    );
}