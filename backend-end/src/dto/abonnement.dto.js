/**
 * DTO pour transformer les données d'abonnement
 */

/**
 * Transforme les données de la requête d'abonnement
 * @param {Object} body - Corps de la requête
 * @returns {Object} DTO formaté
 */
const toAbonnementDTO = (body) => {
  return {
    email: body.email?.toLowerCase()?.trim()
  };
};

/**
 * Transforme les données pour la réponse publique
 * @param {Object} abonne - Instance du modèle Abonne
 * @returns {Object} Réponse formatée
 */
const toAbonnementResponseDTO = (abonne) => {
  return {
    id: abonne.id,
    email: abonne.email,
    dateAbonnement: abonne.created_at
  };
};

/**
 * Transforme les données pour la réponse admin avec pagination
 * @param {Array} abonnes - Liste des abonnés
 * @param {Object} pagination - Informations de pagination
 * @returns {Object} Réponse formatée avec pagination
 */
const toAbonnesListDTO = (abonnes, pagination) => {
  return {
    abonnes: abonnes.map(abonne => ({
      id: abonne.id,
      email: abonne.email,
      dateAbonnement: abonne.created_at,
      updatedAt: abonne.updated_at
    })),
    pagination: {
      currentPage: pagination.page,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      itemsPerPage: pagination.limit,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPrevPage: pagination.page > 1
    }
  };
};

module.exports = {
  toAbonnementDTO,
  toAbonnementResponseDTO,
  toAbonnesListDTO
};