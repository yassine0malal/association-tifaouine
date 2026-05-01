/**
 * DTOs pour les projets — retourne uniquement les champs nécessaires au frontend
 * selon la langue demandée
 */

const STATUT_LABELS = {
    fr: { planifie: 'Planifié', en_cours: 'En cours', termine: 'Terminé', suspendu: 'Suspendu' },
    ar: { planifie: 'مخطط', en_cours: 'جارٍ', termine: 'منجز', suspendu: 'موقوف' },
    en: { planifie: 'Planned', en_cours: 'In progress', termine: 'Completed', suspendu: 'Suspended' }
};

/**
 * DTO liste projets — correspond à projects.json
 */
const toProjetListDTO = (projet, lang) => ({
    id:          projet.id,
    title:       projet[`titre_${lang}`],
    description: projet[`description_${lang}`] || null,
    state:       STATUT_LABELS[lang][projet.statut] || projet.statut,
    date:        projet.date_debut,
    image:       projet.image_principale || null
});


const toProjetForDonListDTO = (project, lang)=> ({
    id : project.id,
    titre : project[`titre_${lang}`] || null
});


/**
 * 
 */
const toProjetDetailDTO = (projet, lang) => ({
    id:          projet.id,
    title:       projet[`titre_${lang}`],
    img:         projet.image_principale || null,
    description: projet[`description_${lang}`] || null,
    status: {
        peopleHelped:  projet.nb_beneficiaires ? `${projet.nb_beneficiaires}+` : null,
        targetRegion:  projet.localisation,
        projectStatus: STATUT_LABELS[lang][projet.statut] || projet.statut
    },
    meta: {
        completion: projet.date_fin ? new Date(projet.date_fin).getFullYear() : null,
        domain:     projet.Domaine ? projet.Domaine[`nom_${lang}`] : null,
        partners:   projet.Partenariats && projet.Partenariats.length > 0
            ? projet.Partenariats.map(p => p[`nom_${lang}`] || p.nom_fr || null)
            : null
    },
    
});

const toProjetAdminListDTO = (projet, lang) => ({
    id:              projet.id,
    titre:           projet[`titre_${lang}`] || projet.titre_fr,
    image_principal: projet.image_principale || null,
    statut:          (STATUT_LABELS[lang]?.[projet.statut] || projet.statut).toUpperCase(),
    budget:          projet.budget,
    localisation:    projet.localisation || null
});

/**
 * DTO projet complet pour l'édition admin — retourne les valeurs brutes (3 langues)
 * + partenariat_ids + images + vidéos
 */
const toProjetCompletDTO = ({ projet, images, videos }) => {
    const p = projet.toJSON();
    return {
        id:               p.id,
        domaine_id:       p.domaine_id,
        titre_fr:         p.titre_fr,
        titre_ar:         p.titre_ar,
        titre_en:         p.titre_en,
        description_fr:   p.description_fr   || null,
        description_ar:   p.description_ar   || null,
        description_en:   p.description_en   || null,
        statut:           p.statut,
        localisation:     p.localisation     || null,
        nb_beneficiaires: p.nb_beneficiaires || 0,
        date_debut:       p.date_debut       || null,
        date_fin:         p.date_fin         || null,
        budget:           p.budget,
        image_principale: p.image_principale || null,
        partenariat_ids:  p.Partenariats ? p.Partenariats.map(pt => pt.id) : [],
        images: images.map(img => ({
            id:           img.id,
            url:          img.url,
            nom_original: img.nom_original || null

        })),
        videos: videos.map(vid => ({
            id:           vid.id,
            url:          vid.url,
            nom_original: vid.nom_original || null

        }))
    };
};

module.exports = { toProjetListDTO, toProjetDetailDTO, toProjetForDonListDTO, toProjetAdminListDTO, toProjetCompletDTO };
