const jwt = require('jsonwebtoken');
const { Utilisateur, admin, TokenBlacklist } = require('../models');

/**
 * Middleware de vérification du JWT
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Accès non autorisé : Token manquant'
            });
        }

        // Vérification de la blacklist
        const isBlacklisted = await TokenBlacklist.findOne({ where: { token } });
        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                message: 'Token révoqué (déconnecté)'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attacher les données décodées à la requête (id, email, type)
        req.token = token; // On garde le token pour le logout si besoin
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Token invalide'
        });
    }
};

/**
 * Middleware de vérification du rôle Admin
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.type === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Accès interdit : Réservé aux administrateurs'
        });
    }
};

module.exports = {
    verifyToken,
    isAdmin
};
