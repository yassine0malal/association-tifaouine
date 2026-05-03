import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPartnerList.module.css";
import {
    Plus,
    Search,
    Globe,
    Link2Off,
    Pencil,
    Trash2,
    Loader2
} from "lucide-react";

// Import des actions et du composant Popup
import { fetchPartners, deletePartner } from "./adminPartnerSlice";
import PartnerDetailPopup from "./PartnerDetailPopup";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";

export default function AdminPartnerList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // États Redux
    const { partners, loading, error } = useSelector((state) => state.adminPartner);

    // États locaux pour la recherche et le popup
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Charger les partenaires au montage
    useEffect(() => {
        dispatch(fetchPartners());
    }, [dispatch]);

    // Gérer l'ouverture du détail
    const handleOpenDetail = (partner) => {
        setSelectedPartner(partner);
        setIsDetailOpen(true);
    };
    const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, id: null, nom: "" });

    // 1. Déclenche l'ouverture du popup de confirmation
    const askDelete = (e, id, nom) => {
        e.stopPropagation(); // Empêche l'ouverture du popup de détails
        setDeleteConfig({ isOpen: true, id, nom });
    };
    const confirmDelete = () => {
        if (deleteConfig.id) {
            dispatch(deletePartner(deleteConfig.id));
        }
        setDeleteConfig({ isOpen: false, id: null, nom: "" });
    };

    // 3. Annule la procédure
    const cancelDelete = () => {
        setDeleteConfig({ isOpen: false, id: null, nom: "" });
    };
    // Gérer la suppression (avec stopPropagation pour ne pas ouvrir le popup)
    const handleDelete = (e, id, nom) => {
        e.stopPropagation();
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le partenaire "${nom}" ?`)) {
            dispatch(deletePartner(id));
        }
    };

    // Gérer la modification (avec stopPropagation pour ne pas ouvrir le popup)
    const handleEdit = (e, id) => {
        e.stopPropagation();
        navigate(`/admin/partenaires/edit/${id}`);
    };

    // Filtrage des partenaires
    const filteredPartners = partners?.filter(partner => {
        const searchLower = searchTerm.toLowerCase();
        return (
            partner.nom_fr?.toLowerCase().includes(searchLower) ||
            partner.nom_en?.toLowerCase().includes(searchLower) ||
            partner.nom_ar?.toLowerCase().includes(searchLower)
        );
    }) || [];

    const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

    return (
        <div className={styles.container}>
            {/* POPUP DE DÉTAILS */}
            <PartnerDetailPopup
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                partner={selectedPartner}
            />
            <ConfirmPopup
                isOpen={deleteConfig.isOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Supprimer le partenaire"
                description={`Êtes-vous sûr de vouloir supprimer "${deleteConfig.nom}" ? Cette action est irréversible.`}
                variant="danger" // Pour afficher le bouton en rouge
                confirmLabel="Supprimer définitivement"
                cancelLabel="Annuler"
            />
            {/* EN-TÊTE */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <span className={styles.surtitle}>NOS PARTENAIRES</span>
                    <h1>Gestion des Partenaires</h1>
                    <p>Centralisez et gérez les collaborations stratégiques de la fondation Tifaouine à travers le monde.</p>
                </div>
                <button
                    className={styles.btnAdd}
                    onClick={() => navigate("/admin/partenaires/create")}
                >
                    <Plus size={20} /> Ajouter un Partenaire
                </button>
            </header>

            {/* BARRE DE RECHERCHE */}
            <div className={styles.searchBarContainer}>
                <div className={styles.searchInputWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* CHARGEMENT / ERREUR */}
            {loading && (
                <div className={styles.loaderContainer}>
                    <Loader2 className={styles.spinner} size={40} />
                    <p>Chargement des partenaires...</p>
                </div>
            )}
            {error && <div className={styles.errorBanner}>{error}</div>}

            {/* GRILLE DES PARTENAIRES */}
            {!loading && !error && (
                <div className={styles.grid}>
                    {filteredPartners.map((partner) => (
                        <div
                            key={partner.id}
                            className={styles.card}
                            onClick={() => handleOpenDetail(partner)} // Clic sur la carte pour voir les détails
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.logoWrapper}>
                                    {partner.logo ? (
                                        <img
                                            src={`${VITE_BASE_BACK_END_URL}${partner.logo}`}
                                            alt={`Logo ${partner.nom_fr}`}
                                            className={styles.logo}
                                            onError={(e) => { e.target.src = '/placeholder-logo.png' }}
                                        />
                                    ) : (
                                        <div className={styles.logoPlaceholder}>No Logo</div>
                                    )}
                                </div>

                                {partner.site_web ? (
                                    <span className={styles.badgeActive}>
                                        <Globe size={14} /> Site Web
                                    </span>
                                ) : (
                                    <span className={styles.badgeInactive}>
                                        <Link2Off size={14} /> Non dispo.
                                    </span>
                                )}
                            </div>

                            <h3 className={styles.partnerName}>{partner.nom_fr}</h3>

                            <div className={styles.cardActions}>
                                <button
                                    className={styles.btnEdit}
                                    onClick={(e) => handleEdit(e, partner.id)}
                                >
                                    <Pencil size={16} /> Modifier
                                </button>
                                <button
                                    className={styles.btnDelete}
                                    onClick={(e) => askDelete(e, partner.id, partner.nom_fr)}
                                >
                                    <Trash2 size={16} /> Supprimer
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredPartners.length === 0 && !loading && (
                        <div className={styles.emptyState}>
                            Aucun partenaire trouvé.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}