/**
 * Transforme les données brutes du formulaire public "Être bénévole"
 * en structures prêtes pour Utilisateur.create + benevole.create
 */
const toDemandeBenevoleDTO = (body, files = {}) => {
    const photo        = files.photo?.[0];
    const identityCard = files.identity_card?.[0];

    return {
        utilisateur: {
            nom:  body.fullname,
            email: body.email,
            type: 'benevole'
        },
        benevole: {
            telephone:      body.phone_number,
            competences:    body.skills,
            adresse:        body.address,
            motivation:     body.motivation,
            disponibilite:  body.availability,
            photo_profile:  photo        ? `/data/benevoles/photos/${photo.filename}`           : null,
            carte_identite: identityCard ? `/data/benevoles/identites/${identityCard.filename}` : null,
            status:         'en_attente',
            mession:        'benevole'
        }
    };
};

module.exports = { toDemandeBenevoleDTO };
