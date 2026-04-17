/**
 * Middleware de validation de langue
 * Vérifie que :lang est bien 'fr', 'ar' ou 'en'
 * Injecte req.lang pour les controllers
 */
const LANGS = ['fr', 'ar', 'en'];

const validateLang = (req, res, next) => {
    const { lang } = req.params;
    if (!LANGS.includes(lang)) {
        return res.status(400).json({
            success: false,
            message: `Langue invalide. Valeurs acceptées : ${LANGS.join(', ')}`
        });
    }
    req.lang = lang;
    next();
};

module.exports = { validateLang };
