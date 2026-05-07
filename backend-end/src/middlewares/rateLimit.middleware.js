const rateLimit = require('express-rate-limit');


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000,  // l'augmentation de nombre de requete dans la partie de navigation
    message: {
        success: false,
        message: "Trop de requêtes effectuées depuis cette adresse IP, veuillez réessayer plus tard."
    },
    standardHeaders: true, // Renvoie les headers RateLimit-*
    legacyHeaders: false, // Désactive les headers X-RateLimit-*
});


const authLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 5, // Limite à 5 tentatives de login échouées (ou non) par IP par 30 min
    message: {
        success: false,
        message: "Trop de tentatives de connexion échouées. Votre accès est temporairement bloqué pendant 30 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 refresh max par IP par 15 min
    message: {
        success: false,
        message: "Trop de tentatives de rafraîchissement. Veuillez réessayer dans 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const etreMembre = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 5,
    message: {
        success: false,
        message: "Trop de demandes d'adhésion depuis cette adresse IP. Veuillez réessayer dans 1 heure."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const etreBenevole = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Trop de demandes de bénévolat depuis cette adresse IP. Veuillez réessayer dans 1 heure."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    refreshLimiter,
    etreMembre,
    etreBenevole
};
