/**
 * DTO membre — retourne les champs nécessaires au frontend selon la langue
 */
const toMembreListDTO = (m, lang) => ({
    id:           m.id,
    nom:          m.nom,
    poste:        m.membre.poste,
    description:  m.membre[`description_poste_${lang}`] || m.membre.description_poste_fr || null,
    photo:        m.membre.photo_profile || null
});

module.exports = { toMembreListDTO };
