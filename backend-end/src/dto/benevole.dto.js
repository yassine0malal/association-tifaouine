/**
 * DTO bénévole — retourne les champs nécessaires au frontend selon la langue
 */
const toBenevoleListDTO = (b) => ({
    id:           b.id,
    nom:          b.nom,
    mession:      b.benevole.mession,
    disponibilite: b.benevole.disponibilite || null,
    photo:        b.benevole.photo_profile || null,
    telephone:    b.benevole.telephone || null,
    adresse:      b.benevole.adresse || null,
    competences:  b.benevole.competences || null,
    motivation:   b.benevole.motivation || null,
    status:       b.benevole.status,
    date_adhesion: b.benevole.date_adhesion
});

module.exports = { toBenevoleListDTO };
