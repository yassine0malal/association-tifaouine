/**
 * Transforme les données brutes du formulaire public "Être membre"
 * en structures prêtes pour Utilisateur.create + membre.create
 */
const toDemandeMembreDTO = (body, files = {}) => {
    const photo         = files.photo?.[0];
    const identityCard  = files.identity_card?.[0];
    const cvDoc         = files.cv_doc?.[0];

    return {
        utilisateur: {
            nom:   body.fullname,
            email: body.email,
            type:  'membre'
        },
        membre: {
            telephone:      body.phone_number,
            competences:    body.skills,
            adresse:        body.address,
            motivation:     body.motivation,
            photo_profile:  photo         ? `/data/membres/photos/${photo.filename}`         : null,
            carte_identite: identityCard  ? `/data/membres/identites/${identityCard.filename}` : null,
            cv:             cvDoc         ? `/data/membres/cvs/${cvDoc.filename}`             : null,
            status:         'en_attente',
            poste:          'membre'
        }
    };
};

module.exports = { toDemandeMembreDTO };
