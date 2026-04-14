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
    image:       projet.DonMateriel ? null : null, // sera remplacé par la 1ère photo du projet
    localisation: projet.localisation
});

/**
 * DTO détail projet — correspond à project.json
 */
const toProjetDetailDTO = (projet, lang, domaine) => ({
    id:          projet.id,
    title:       projet[`titre_${lang}`],
    description: projet[`description_${lang}`] || null,
    status: {
        peopleHelped:  projet.nb_beneficiaires ? `${projet.nb_beneficiaires}+ bénéficiaires` : null,
        targetRegion:  projet.localisation,
        projectStatus: STATUT_LABELS[lang][projet.statut] || projet.statut
    },
    meta: {
        completion: projet.date_fin ? new Date(projet.date_fin).getFullYear() : null,
        domain:     domaine ? domaine[`nom_${lang}`] : null,
        budget:     projet.budget || null
    }
});

module.exports = { toProjetListDTO, toProjetDetailDTO };
