

const crypto = require('crypto');

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.JWT_SECRET;
const COOKIE_NAME = 'csrf_token';
const HEADER_NAME = 'x-csrf-token';
const TOKEN_TTL = 60 * 60 * 1000; // Utilisé seulement pour le message JSON si besoin

/**
 * Génère un token CSRF signé : payload.hmac
 */
const generateToken = () => {
    const payload = Buffer.from(`${Date.now()}.${crypto.randomBytes(16).toString('hex')}`).toString('base64');
    const hmac = crypto.createHmac('sha256', CSRF_SECRET).update(payload).digest('hex');
    return `${payload}.${hmac}`;
};

/**
 * Vérifie la signature cryptographique du token (Version sans expiration)
 */
const verifyToken = (token) => {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [payload, hmac] = parts;
    const expected = crypto.createHmac('sha256', CSRF_SECRET).update(payload).digest('hex');

    // Vérification de la signature en temps constant
    if (hmac.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
};

/**
 * GET /api/csrf-token
 */
const getCsrfToken = (req, res) => {
    const token = generateToken();

    res.cookie(COOKIE_NAME, token, {
        httpOnly: false, // Permet au JS (React) de lire le cookie
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });

    return res.status(200).json({
        success: true,
        csrfToken: token,
        message: 'Token CSRF généré avec succès.'
    });
};

/**
 * Middleware — Double Submit Cookie pattern
 * C'est cette fonction qui manquait de nom !
 */
const verifyCsrf = (req, res, next) => {
    const cookieToken = req.cookies?.[COOKIE_NAME];
    const headerToken = req.headers?.[HEADER_NAME];

    if (!cookieToken || !headerToken) {
        return res.status(403).json({ success: false, message: 'Token CSRF manquant.' });
    }

    if (cookieToken !== headerToken) {
        return res.status(403).json({ success: false, message: 'Token CSRF invalide.' });
    }

    if (!verifyToken(cookieToken)) {
        return res.status(403).json({ success: false, message: 'Token CSRF corrompu.' });
    }

    next();
};

/**
 * Extraction côté client (Documentaire)
 */
const extractCsrfTokenFromCookies = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === COOKIE_NAME) {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// Exportation correcte
module.exports = { getCsrfToken, verifyCsrf, COOKIE_NAME };