/**
 * DTO domaines — correspond à domains.json
 */
const toDomaineListDTO = (domaine, lang) => ({
    id:    domaine.id,
    label: domaine[`nom_${lang}`],
});

module.exports = { toDomaineListDTO };
