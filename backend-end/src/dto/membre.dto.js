/**
 * DTO membre — retourne les champs nécessaires au frontend selon la langue
 */
const toMembreListDTO = (m, lang) => ({
    id:           m.id,
    nom:          m.nom,
    poste:        m.membre.poste,
    description:  m.membre[`description_poste_${lang}`] || m.membre.description_poste_fr || null,
    photo:        m.membre.photo_profile || null,
    telephone:    m.membre.telephone || null,
    adresse:      m.membre.adresse || null,
    competences:  m.membre.competences || null,
    motivation:   m.membre.motivation || null,
    status:       m.membre.status,
    date_adhesion: m.membre.date_adhesion
});

module.exports = { toMembreListDTO };
