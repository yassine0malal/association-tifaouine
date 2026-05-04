const { Abonne } = require('../models');
const { Op } = require('sequelize');

class AbonneRepository {
  /**
   * Trouve un abonné par email
   * @param {string} email 
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return await Abonne.findOne({
      where: { email: email.toLowerCase() }
    });
  }

  /**
   * Crée un nouvel abonné
   * @param {Object} abonneData 
   *k @returns {Promise<Object>}
   */
  async create(abonneData) {
    return await Abonne.create(abonneData);
  }

  /**
   * Récupère tous les abonnés avec pagintion et filtres
   * @param {Object} options - Options de requête
   * @param {number} options.page - Numéro de page
   * @param {number} options.limit - Nombre d'éléments par page
   * @param {Date} options.dateDebut - Date de début pour le filtre
   * @param {Date} options.dateFin - Date de fin pour le filtre
   * @returns {Promise<Object>} Résultat avec données et pagination
   */
  async findAllWithPagination(options) {
    const { page = 1, limit = 10, dateDebut, dateFin } = options;
    const offset = (page - 1) * limit;

    // Construction des conditions de filtre
    // const whereConditions = {};
    
    // if (dateDebut || dateFin) {
    //   whereConditions.created_at = {};
      
    //   if (dateDebut) {
    //     whereConditions.created_at[Op.gte] = new Date(dateDebut);
    //   }
      
    //   if (dateFin) {
    //     // Ajouter 23:59:59 à la date de fin pour inclure toute la journée
    //     const endDate = new Date(dateFin);
    //     endDate.setHours(23, 59, 59, 999);
    //     whereConditions.created_at[Op.lte] = endDate;
    //   }
    // }
    const { count, rows } = await Abonne.findAndCountAll({
      // where: whereConditions,
      order: [['created_at', 'DESC']], // Ordre décroissant par date
      // limit: parseInt(limit),
      // offset: parseInt(offset),
      distinct: true
    });
    
    return {
      abonnes: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Compte le nombre total d'abonnés
   * @returns {Promise<number>}
   */
  async count() {
    return await Abonne.count();
  }

  /**
   * Supprime un abonné par ID (pour usage admin)
   * @param {number} id 
   * @returns {Promise<boolean>}
   */
  async deleteById(id) {
    const result = await Abonne.destroy({
      where: { id }
    });
    return result > 0;
  }

  /**
   * Supprime un abonné par email (pour désabonnement)
   * @param {string} email 
   * @returns {Promise<boolean>}
   */
  async deleteByEmail(email) {
    const result = await Abonne.destroy({
      where: { email: email.toLowerCase() }
    });
    return result > 0;
  }
}

module.exports = new AbonneRepository();