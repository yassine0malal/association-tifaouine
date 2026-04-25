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
    id:          domaine.id,
    nom:         domaine[`nom_${lang}`],
    description: domaine[`desc_${lang}`],
    icone:       domaine.icone,
});

module.exports = { toDomaineListDTO, toDomaineFullDTO };
