/**
 * DTOs pour les événements — retourne uniquement les champs nécessaires au frontend
 */

const toEvenementListDTO = (eve, lang) => ({
    id:     eve.id,
    title:  eve[`titre_${lang}`],
    domain: eve.Domaine ? eve.Domaine[`nom_${lang}`] : null,
    date:   eve.date_debut,
    image_principale:    eve.image_principale || null
});

/**
 * DTO détail événement
 * @param {Object}   eve           - instance Evenement avec Domaine et Partenariats
 * @param {string}   lang          - fr | ar | en
 * @param {Array}    relatedEvents - événements du même domaine
 * @param {Array}    lastedEvents  - derniers événements ajoutés en DB
 * @param {Array}    images        - ressources photo liées à cet événement
 */
const toEvenementDetailDTO = (eve, lang, relatedEvents = [], lastedEvents = [], images = []) => ({
    id:          eve.id,
    title:       eve[`titre_${lang}`],
    category:    eve.Domaine ? eve.Domaine[`nom_${lang}`] : null,
    description: eve[`description_${lang}`] || null,
    location:    eve.lieu,
    date_debut:  eve.date_debut,
    date_fin:    eve.date_fin,
    image_principale: eve.image_principale || null,

    // Noms des partenaires uniquement
    partners: eve.Partenariats && eve.Partenariats.length > 0
        ? eve.Partenariats.map(p => p[`nom_${lang}`] || p.nom_fr || null)
        : null,

    // Événements du même domaine
    related_events: relatedEvents.map(r => ({
        id:     r.id,
        title:  r[`titre_${lang}`],
        domain: r.Domaine ? r.Domaine[`nom_${lang}`] : null,
        date:   r.date_debut,
        img:    r.image_principale || null
    })),

    // Derniers événements ajoutés (triés par created_at DESC)
    lasted_events: lastedEvents.map(l => ({
        id:     l.id,
        title:  l[`titre_${lang}`],
        domain: l.Domaine ? l.Domaine[`nom_${lang}`] : null,
        date:   l.date_debut,
        img:    l.image_principale || null
    })),

    // Photos liées à cet événement (galerie uniquement)
    images: images.map(img => ({
        id:  img.id,
        src: img.url,
        alt: img[`titre_${lang}`] || img.titre_fr || ''
    }))
});

/**
 * DTO événement complet pour l'édition admin — retourne les valeurs brutes (3 langues)
 * + partenariat_ids + image principale + images galerie
 */
const toEvenementCompletDTO = ({ evenement, images }) => {
    const e = evenement.toJSON();
    return {
        id:               e.id,
        domaine_id:       e.domaine_id,
        projet_id:        e.projet_id || null,
        titre_fr:         e.titre_fr,
        titre_ar:         e.titre_ar,
        titre_en:         e.titre_en,
        date_debut:       e.date_debut,
        date_fin:         e.date_fin || null,
        lieu:             e.lieu || null,
        description_fr:   e.description_fr || null,
        description_ar:   e.description_ar || null,
        description_en:   e.description_en || null,
        image_principale: e.image_principale || null,
        partenariat_ids:  e.Partenariats ? e.Partenariats.map(pt => pt.id) : [],
        images: images.map(img => ({
            id:           img.id,
            url:          img.url,
            nom_original: img.nom_original || null
        }))
    };
};

module.exports = { toEvenementListDTO, toEvenementDetailDTO, toEvenementCompletDTO };
