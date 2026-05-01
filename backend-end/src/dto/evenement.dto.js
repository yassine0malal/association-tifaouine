/**
 * DTOs pour les événements — retourne uniquement les champs nécessaires au frontend
 */

const toEvenementListDTO = (eve, lang) => ({
    id:     eve.id,
    title:  eve[`titre_${lang}`],
    domain: eve.Domaine ? eve.Domaine[`nom_${lang}`] : null,
    date:   eve.date_debut,
    img:    null
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
    date_start:  eve.date_debut,
    date_end:    eve.date_fin,

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
        img:    null
    })),

    // Derniers événements ajoutés (triés par created_at DESC)
    lasted_events: lastedEvents.map(l => ({
        id:     l.id,
        title:  l[`titre_${lang}`],
        domain: l.Domaine ? l.Domaine[`nom_${lang}`] : null,
        date:   l.date_debut,
        img:    null
    })),

    // Photos liées à cet événement
    images: images.map(img => ({
        id:  img.id,
        src: img.url,
        alt: img[`titre_${lang}`] || img.titre_fr || ''
    }))
});

module.exports = { toEvenementListDTO, toEvenementDetailDTO };
