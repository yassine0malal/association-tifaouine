/**
 * Middleware de pagination
 * Extrait et valide les paramètres page et limit depuis req.query
 * Injecte req.pagination = { page, limit, offset } pour les controllers
 *
 * Usage : GET /api/ressource?page=2&limit=10
 * Défaut : page=1, limit=10
 * Maximum : limit=100
 */
const paginate = (req, res, next) => {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

    req.pagination = {
        page,
        limit,
        offset: (page - 1) * limit
    };

    next();
};

module.exports = { paginate };
