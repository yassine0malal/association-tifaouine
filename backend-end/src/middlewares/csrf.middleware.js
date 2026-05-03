const crypto = require('crypto');

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.JWT_SECRET;
const COOKIE_NAME = 'csrf_token';
const HEADER_NAME = 'x-csrf-token';
const TOKEN_TTL   = 60 * 60 * 1000; // 1 heure

/**
 * Génère un token CSRF signé : payload.hmac
 * payload = base64(timestamp + random)
 */
const generateToken = () => {
    const payload = Buffer.from(`${Date.now()}.${crypto.randomBytes(16).toString('hex')}`).toString('base64');
    const hmac    = crypto.createHmac('sha256', CSRF_SECRET).update(payload).digest('hex');
    return `${payload}.${hmac}`;
};

/**
 * Vérifie la signature et l'expiration du token
 */
const verifyToken = (token) => {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [payload, hmac] = parts;
    const expected = crypto.createHmac('sha256', CSRF_SECRET).update(payload).digest('hex');

    // Comparaison en temps constant pour éviter timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))) return false;

    // Vérification expiration
    try {
        const decoded   = Buffer.from(payload, 'base64').toString();
        const timestamp = parseInt(decoded.split('.')[0], 10);
        if (Date.now() - timestamp > TOKEN_TTL) return false;
    } catch {
        return false;
    }

    return true;
};

/**
 * GET /api/csrf-token
 * Génère un token et le pose uniquement en cookie HttpOnly
 * Le token n'est PAS exposé dans le body pour plus de sécurité
 */
const getCsrfToken = (req, res) => {
    const token = generateToken();

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge:   TOKEN_TTL
    });

    return res.status(200).json({ 
        success: true, 
        message: 'Token CSRF généré et configuré avec succès. Vous pouvez maintenant soumettre le formulaire.',
        tokenExpiry: new Date(Date.now() + TOKEN_TTL).toISOString()
    });
};

/**
 * Middleware — Double Submit Cookie pattern
 * Compare le cookie csrf_token avec le header x-csrf-token
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
        return res.status(403).json({ success: false, message: 'Token CSRF expiré ou corrompu.' });
    }

    next();
};

/**
 * Fonction utilitaire pour extraire le token CSRF des cookies côté client
 * À utiliser dans le frontend JavaScript
 */
const extractCsrfTokenFromCookies = () => {
    // Cette fonction sera documentée pour usage côté client
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === COOKIE_NAME) {
            return decodeURIComponent(value);
        }
    }
    return null;
};

module.exports = { getCsrfToken, verifyCsrf, COOKIE_NAME };
