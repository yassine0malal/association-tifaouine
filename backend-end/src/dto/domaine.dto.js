/**
 * DTO domaines — navbar (id + label uniquement)
 */
const toDomaineListDTO = (domaine, lang) => ({
    id:    domaine.id,
    label: domaine[`nom_${lang}`],
});

/**
 * DTO domaines — page complète (toutes les données sauf timestamps)
 */
const toDomaineFullDTO = (domaine, lang) => ({
    id:               domaine.id,
    nom:              domaine[`nom_${lang}`],
    description:      domaine[`desc_${lang}`],
    icone:            domaine.icone,
    total_projets:    domaine.total_projets    ?? 0,
    total_evenements: domaine.total_evenements ?? 0,
});

module.exports = { toDomaineListDTO, toDomaineFullDTO };
