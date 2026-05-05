/**
 * DTOs pour les dons — formate les données pour l'administration
 */

/**
 * DTO pour la liste des dons (format simplifié et aplati)
 */
const toDonListDTO = (don) => {
    const d = don.toJSON ? don.toJSON() : don;
    
    let detail = '';
    if (d.type_don === 'financier' && d.DonFinancier) {
        detail = `${d.DonFinancier.montant} ${d.DonFinancier.devise}`;
    } else if (d.type_don === 'materiel' && d.DonMateriel) {
        detail = `${d.DonMateriel.quantite}x ${d.DonMateriel.description}`;
    }

    return {
        id:               d.id,
        nom_complet:      d.nom_complet,
        email:            d.email,
        type_don:         d.type_don,
        detail:           detail,
        statut:           d.statut,
        date_reception:   d.date_reception,
        type_destination: d.type_destination,
        projet:           d.Projet ? (d.Projet.titre_fr || d.Projet.titre_ar) : 'Général'
    };
};

/**
 * DTO pour le détail complet d'un don
 */
const toDonDetailDTO = (don) => {
    const d = don.toJSON ? don.toJSON() : don;
    
    return {
        id:               d.id,
        nom_complet:      d.nom_complet,
        email:            d.email,
        telephone:        d.telephone,
        type_don:         d.type_don,
        type_destination: d.type_destination,
        statut:           d.statut,
        date_reception:   d.date_reception,
        created_at:       d.created_at,
        projet: d.Projet ? {
            id:    d.Projet.id,
            titre: d.Projet.titre_fr || d.Projet.titre_ar || d.Projet.titre_en
        } : null,
        info_financiere: d.DonFinancier ? {
            montant:         d.DonFinancier.montant,
            devise:          d.DonFinancier.devise,
            ref_transaction: d.DonFinancier.ref_transaction
        } : null,
        info_materielle: d.DonMateriel ? {
            description:   d.DonMateriel.description,
            quantite:      d.DonMateriel.quantite,
            date_decision: d.DonMateriel.date_decision
        } : null
    };
};

module.exports = { toDonListDTO, toDonDetailDTO };
