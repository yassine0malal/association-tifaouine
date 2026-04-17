/**
 * DTOs pour les événements — retourne uniquement les champs nécessaires au frontend
 */

/**
 * DTO liste événements — correspond à events.json
 */
const toEvenementListDTO = (eve, lang) => ({
    id:     eve.id,
    title:  eve[`titre_${lang}`],
    domain: eve.Domaine ? eve.Domaine[`nom_${lang}`] : null,
    date:   eve.date_debut,
    img:    null  // sera remplacé par la 1ère ressource photo liée
});

/**
 * DTO détail événement — correspond à event.json
 */
const toEvenementDetailDTO = (eve, lang, relatedEvents = [], commonEvents = [], images = []) => ({
    id:          eve.id,
    title:       eve[`titre_${lang}`],
    category:    eve.Domaine ? eve.Domaine[`nom_${lang}`] : null,
    description: eve[`description_${lang}`] || null,
    location:    eve.lieu,
    date_start:  eve.date_debut,
    date_end:    eve.date_fin,
    related_events: relatedEvents.map(r => ({
        id:         r.id,
        title:      r[`titre_${lang}`],
        date_start: r.date_debut,
        date_end:   r.date_fin,
        img:        null
    })),
    common_events: commonEvents.map(c => ({
        id:         c.id,
        title:      c[`titre_${lang}`],
        domain:     c.Domaine ? c.Domaine[`nom_${lang}`] : null,
        date_start: c.date_debut,
        date_end:   c.date_fin,
        img:        null
    })),
    images: images.map(img => ({
        id:  img.id,
        src: img.url,
        alt: img[`titre_${lang}`] || img.titre_fr || ''
    }))
});

module.exports = { toEvenementListDTO, toEvenementDetailDTO };
