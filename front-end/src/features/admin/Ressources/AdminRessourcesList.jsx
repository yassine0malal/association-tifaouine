import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./AdminRessourcesList.module.css";
import {
    Plus,
    Search,
    Image as ImageIcon,
    FileText,
    Pencil,
    Trash2,
    Loader2,
    Eye
} from "lucide-react";

import { fetchResources, deleteResource } from "./adminResourceSlice";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";

export default function AdminResourcesList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { resources, loading, error } = useSelector((state) => state.adminResources);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedResource, setSelectedResource] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, id: null, titre: "" });

    useEffect(() => {
        dispatch(fetchResources());
    }, [dispatch]);

    const handleOpenDetail = (resource) => {
        setSelectedResource(resource);
        setIsDetailOpen(true);
    };

    const askDelete = (e, id, titre) => {
        e.stopPropagation();
        setDeleteConfig({ isOpen: true, id, titre });
    };

    const confirmDelete = () => {
        if (deleteConfig.id) {
            dispatch(deleteResource(deleteConfig.id));
        }
        setDeleteConfig({ isOpen: false, id: null, titre: "" });
    };

    const cancelDelete = () => {
        setDeleteConfig({ isOpen: false, id: null, titre: "" });
    };

    const handleEdit = (e, id) => {
        e.stopPropagation();
        navigate(`/admin/ressources/edit/${id}`);
    };

    const filteredResources = resources?.filter(res => {
        const searchLower = searchTerm.toLowerCase();
        return (
            res.titre_fr?.toLowerCase().includes(searchLower) ||
            res.titre_ar?.toLowerCase().includes(searchLower) ||
            res.titre_en?.toLowerCase().includes(searchLower)
        );
    }) || [];

    const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

    return (
        <div className={styles.container}>
            
            <ConfirmPopup
                isOpen={deleteConfig.isOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Supprimer la ressource"
                description={`Êtes-vous sûr de vouloir supprimer "${deleteConfig.titre}" ?`}
                variant="danger"
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
            />

            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <span className={styles.surtitle}>ARCHIVES VISUELLES</span>
                    <h1>Gestion des Ressources</h1>
                    <p>Gérez la photothèque et les documents officiels de l'association Tifaouine.</p>
                </div>
                <button
                    className={styles.btnAdd}
                    onClick={() => navigate("/admin/ressources/create")}
                >
                    <Plus size={20} /> Ajouter une Ressource
                </button>
            </header>

            <div className={styles.searchBarContainer}>
                <div className={styles.searchInputWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher une archive..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {loading && (
                <div className={styles.loaderContainer}>
                    <Loader2 className={styles.spinner} size={40} />
                    <p>Chargement des archives...</p>
                </div>
            )}
            
            {error && <div className={styles.errorBanner}>{error}</div>}

            {!loading && !error && (
                <div className={styles.grid}>
                    {filteredResources.map((resource) => (
                        <div
                            key={resource.id}
                            className={styles.card}
                            onClick={() => handleOpenDetail(resource)}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.previewWrapper}>
                                    {/* Using image_couverture or url depending on type */}
                                    <img
                                        src={`${VITE_BASE_BACK_END_URL}${resource.type === 'photo' ? resource.url : resource.image_couverture}`}
                                        alt={resource.titre_fr}
                                        className={styles.preview}
                                        onError={(e) => { e.target.src = '/placeholder-image.png' }}
                                    />
                                </div>

                                <span className={resource.type === 'photo' ? styles.badgePhoto : styles.badgeDoc}>
                                    {resource.type === 'photo' ? <ImageIcon size={14} /> : <FileText size={14} />}
                                    {resource.type.toUpperCase()}
                                </span>
                            </div>

                            <div className={styles.cardInfo}>
                                <h3 className={styles.resourceTitle}>{resource.titre_fr}</h3>
                                <p className={styles.arabicTitle}>{resource.titre_ar}</p>
                            </div>

                            <div className={styles.cardActions}>
                                <button
                                    className={styles.btnEdit}
                                    onClick={(e) => handleEdit(e, resource.id)}
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    className={styles.btnDelete}
                                    onClick={(e) => askDelete(e, resource.id, resource.titre_fr)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredResources.length === 0 && !loading && (
                        <div className={styles.emptyState}>
                            Aucune ressource trouvée.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}