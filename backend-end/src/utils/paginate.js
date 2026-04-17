/**
 * Construit la réponse paginée standard à partir du résultat findAndCountAll
 * @param {Object} result   - { count, rows } retourné par Sequelize
 * @param {number} page     - page courante
 * @param {number} limit    - nombre d'éléments par page
 * @returns {Object}        - métadonnées de pagination + données
 */
const buildPaginatedResponse = (result, page, limit) => {
    const totalPages = Math.ceil(result.count / limit);
    return {
        data:        result.rows,
        pagination: {
            total:       result.count,
            page:        page,
            limit:       limit,
            totalPages:  totalPages,
            hasNext:     page < totalPages,
            hasPrev:     page > 1
        }
    };
};

module.exports = { buildPaginatedResponse };
