/**
 * Middleware Honeypot anti-bot
 *
 * Le frontend doit inclure un champ caché (display:none / visibility:hidden)
 * nommé `website` dans le formulaire. Un vrai utilisateur ne le remplit jamais.
 * Un bot qui scanne et remplit tous les champs le remplira — ce qui trahit sa nature.
 */
const verifyHoneypot = (req, res, next) => {
    const trap = req.body?.website;

    // Si le champ honeypot est rempli → c'est un bot
    if (trap !== undefined && trap !== '') {
        // On répond 200 pour ne pas alerter le bot qu'il a été détecté
        return res.status(200).json({
            success: true,
            message: "Votre demande d'adhésion a été soumise avec succès."
        });
    }

    next();
};

module.exports = { verifyHoneypot };
