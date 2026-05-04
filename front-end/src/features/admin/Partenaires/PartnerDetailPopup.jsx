import React from "react";
import styles from "./PartnerDetailPopup.module.css";
import { X, Globe, Languages, Info } from "lucide-react";

export default function PartnerDetailPopup({ isOpen, onClose, partner }) {
    if (!isOpen || !partner) return null;

    const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button className={styles.btnClose} onClick={onClose}>
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <div className={styles.logoWrapper}>
                        {partner.logo ? (
                            <img 
                                src={`${VITE_BASE_BACK_END_URL}${partner.logo}`} 
                                alt={partner.nom_fr} 
                                className={styles.logo}
                            />
                        ) : (
                            <div className={styles.logoPlaceholder}>No Logo</div>
                        )}
                    </div>
                    <div className={styles.headerTitle}>
                        <h2>Détails du Partenaire</h2>
                        <p>ID: #{partner.id}</p>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Section des Noms */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Languages size={18} />
                            <h3>Dénominations</h3>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.infoItem}>
                                <label>Français</label>
                                <p>{partner.nom_fr || "—"}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>English</label>
                                <p>{partner.nom_en || "—"}</p>
                            </div>
                            <div className={`${styles.infoItem} ${styles.rtl}`}>
                                <label>العربية</label>
                                <p>{partner.nom_ar || "—"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section des Descriptions */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Info size={18} />
                            <h3>Descriptions</h3>
                        </div>
                        <div className={styles.descriptions}>
                            <div className={styles.descBlock}>
                                <span className={styles.langTag}>FR</span>
                                <p>{partner.description_fr || "Aucune description"}</p>
                            </div>
                            <div className={styles.descBlock}>
                                <span className={styles.langTag}>EN</span>
                                <p>{partner.description_en || "No description"}</p>
                            </div>
                            <div className={`${styles.descBlock} ${styles.rtl}`}>
                                <span className={styles.langTag}>AR</span>
                                <p>{partner.description_ar || "لا يوجد وصف"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Lien Web */}
                    {partner.site_web && (
                        <div className={styles.footerLink}>
                            <Globe size={18} />
                            <a href={partner.site_web} target="_blank" rel="noopener noreferrer">
                                Visiter le site officiel
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}