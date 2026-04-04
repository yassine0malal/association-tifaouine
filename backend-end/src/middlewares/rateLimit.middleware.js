const rateLimit = require('express-rate-limit');


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 min
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

module.exports = {
    apiLimiter,
    authLimiter
};
