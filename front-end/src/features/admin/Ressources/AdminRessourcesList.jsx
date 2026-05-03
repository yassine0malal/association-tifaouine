import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./AdminResourcesList.module.css";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";
import {
    Plus,
    Search,
    FileText,
    Pencil,
    Trash2,
    Loader2,
    LayoutGrid,
    FileSearch,
    ExternalLink,
    BookOpen,
    ClipboardList
} from "lucide-react";

import { fetchResources, deleteResource } from "./adminResourceSlice";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";

export default function AdminResourcesList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Accessing resources and pagination metadata from Redux
    const { resources, pagination, loading, error } = useSelector((state) => state.adminResources);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, id: null, titre: "" });

    // 1. MODIFIED: Fetch resources ONLY when the page changes. Removed searchTerm dependency.
    useEffect(() => {
        dispatch(fetchResources({ page: currentPage }));
    }, [dispatch, currentPage]);

    // 2. ADDED: Local filter logic. This only searches through the data currently on the page.
    const filteredResources = useMemo(() => {
        if (!searchTerm) return resources;
        
        const lowerSearch = searchTerm.toLowerCase();
        return resources?.filter((resource) => 
            resource.titre_fr?.toLowerCase().includes(lowerSearch) ||
            resource.titre_ar?.toLowerCase().includes(lowerSearch) ||
            resource.type?.toLowerCase().includes(lowerSearch)
        );
    }, [resources, searchTerm]);

    const confirmDelete = () => {
        if (deleteConfig.id) dispatch(deleteResource(deleteConfig.id));
        setDeleteConfig({ isOpen: false, id: null, titre: "" });
    };
    
    const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewFile = (url) => {
        window.open(`${VITE_BASE_BACK_END_URL}${url}`, '_blank', 'noopener,noreferrer');
    };

    const getBadgeStyle = (type) => {
        switch (type?.toLowerCase()) {
            case 'rapport': return styles.badgeRapport;
            case 'guide': return styles.badgeGuide;
            case 'photo': return styles.badgePhoto;
            default: return styles.badgeDocument;
        }
    };

    const getTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'rapport': return <ClipboardList size={12} />;
            case 'guide': return <BookOpen size={12} />;
            default: return <FileText size={12} />;
        }
    };

    return (
        <div className={styles.container}>
            <ConfirmPopup
                isOpen={deleteConfig.isOpen}
                onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
                onConfirm={confirmDelete}
                title="Supprimer l'archive"
                description={`Voulez-vous vraiment supprimer "${deleteConfig.titre}" ?`}
                variant="danger"
            />
    
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.ibdaaa}>
                        <h1  >Gestion des Archives</h1>
                    </div>
                </div>
                <button className={styles.btnAdd} onClick={() => navigate("/admin/ressources/create")}>
                    <Plus size={18} /> <span>Ajouter une Ressource</span>
                </button>
            </header>

            <div className={styles.topActions}>
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Filtrer les documents sur cette page..."
                        value={searchTerm}
                        // 3. MODIFIED: Removed setCurrentPage(1) so it doesn't trigger a new fetch
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {loading ? (
                <div className={styles.loaderContainer}>
                    <Loader2 className={styles.spinner} size={40} />
                    <Loader/>
                </div>
            ) : error ? (
                <div className={styles.errorBanner}>{error}</div>
            ) : (
                <>
                    <div className={styles.grid}>
                        {/* 4. MODIFIED: Map over filteredResources instead of resources */}
                        {filteredResources?.map((resource) => (
                            <div key={resource.id} className={styles.card} onClick={() => handleViewFile(resource.url)}>
                                <div className={styles.imageSection}>
                                    <img
                                        src={`${VITE_BASE_BACK_END_URL}${resource.image_couverture || resource.url}`}
                                        alt={resource.titre_fr}
                                        className={styles.preview}
                                        onError={(e) => { e.target.src = '/placeholder-doc.png' }}
                                    />
                                    <div className={styles.overlay}>
                                        <div className={styles.actionGroup}>
                                            <button
                                                className={styles.overlayBtn}
                                                onClick={(e) => { e.stopPropagation(); navigate(`/admin/ressources/edit/${resource.id}`) }}
                                                title="Modifier"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className={`${styles.overlayBtn} ${styles.btnDanger}`}
                                                onClick={(e) => { e.stopPropagation(); setDeleteConfig({ isOpen: true, id: resource.id, titre: resource.titre_fr }) }}
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className={styles.viewFileLabel}>
                                            <ExternalLink size={18} />
                                            <span>Ouvrir le fichier</span>
                                        </div>
                                    </div>
                                    <span className={`${styles.badgeBase} ${getBadgeStyle(resource.type)}`}>
                                        {getTypeIcon(resource.type)}
                                        {resource.type?.toUpperCase()}
                                    </span>
                                </div>

                                <div className={styles.cardContent}>
                                    <h3 className={styles.resourceTitle}>{resource.titre_fr}</h3>
                                    <p className={styles.arabicTitle}>{resource.titre_ar}</p>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.fileSize}>
                                            {resource.file_size ? (resource.file_size / 1024 / 1024).toFixed(2) + " MB" : "N/A"}
                                        </span>
                                        <span className={styles.fileType}>
                                            {resource.file_type ? `.${resource.file_type}` : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className={styles.paginationWrapper}>
                            <Pagination 
                                currentPage={pagination.page} 
                                totalPages={pagination.totalPages} 
                                onPageChange={handlePageChange} 
                            />
                        </div>
                    )}
                </>
            )}

            {/* 5. MODIFIED: Use filteredResources.length to trigger the empty state */}
            {(!filteredResources || filteredResources.length === 0) && !loading && (
                <div className={styles.emptyState}>
                    <FileSearch size={48} />
                    <p>Aucun document trouvé sur cette page.</p>
                </div>
            )}
        </div>
    );
}