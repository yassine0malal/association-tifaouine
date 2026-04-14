/**
 * DTO domaines — correspond à domains.json
 */
const toDomaineListDTO = (domaine, lang) => ({
    id:    domaine.id,
    label: domaine[`nom_${lang}`],
    icone: domaine.icone || null
});

module.exports = { toDomaineListDTO };
