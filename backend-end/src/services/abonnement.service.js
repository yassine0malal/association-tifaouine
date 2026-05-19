const { sequelize, AdminNotification } = require('../models');
const abonneRepository = require('../repositories/abonne.repository');
const { toAbonnementDTO, toAbonnementResponseDTO, toAbonnesListDTO } = require('../dto/abonnement.dto');

class AbonnementService {
  /**
   * Traite une demande d'abonnement publique
   * @param {Object} body - Corps de la requête validé
   * @returns {Promise<Object>} Données de l'abonné créé
   */
  async souscrireAbonnement(body) {
    const dto = toAbonnementDTO(body);

    // Vérifier l'unicité de l'email
    const existingAbonne = await abonneRepository.findByEmail(dto.email);
    if (existingAbonne) {
      throw new Error(`L'adresse email ${dto.email} est déjà abonnée à notre newsletter.`);
    }

    return await sequelize.transaction(async (t) => {
      // 1. Créer l'abonné
      const abonne = await abonneRepository.create(dto);

      // 2. Notifier les admins (optionnel)
      await AdminNotification.create({
        type: 'NOUVEL_ABONNE',
        entity_id: abonne.id,
        message: `Nouvel abonnement newsletter : ${abonne.email}`
      }, { transaction: t });

      return toAbonnementResponseDTO(abonne);
    });
  }

  /**
   * Récupère tous les abonnés avec pagination et filtres (Admin)
   * @param {Object} filters - Filtres et pagination
   * @returns {Promise<Object>} Liste paginée des abonnés
   */
  async getAllAbonnes(filters) {
    const result = await abonneRepository.findAllWithPagination(filters);
    return toAbonnesListDTO(result.abonnes, result.pagination);
  }

  /**
   * Récupère les statistiques des abonnements (Admin)
   * @returns {Promise<Object>} Statistiques
   */
  async getAbonnementStats() {
    const totalAbonnes = await abonneRepository.count();
    
    // Abonnés du mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const { pagination: monthlyStats } = await abonneRepository.findAllWithPagination({
      dateDebut: startOfMonth,
      dateFin: endOfMonth,
      limit: 1 // On veut juste le count
    });

    return {
      totalAbonnes,
      abonnesCeMois: monthlyStats.totalItems,
      croissanceMensuelle: monthlyStats.totalItems
    };
  }

  /**
   * Désabonne un utilisateur par email
   * @param {string} email 
   * @returns {Promise<boolean>}
   */
  async desabonner(email) {
    const abonne = await abonneRepository.findByEmail(email);
    if (!abonne) {
      throw new Error('Aucun abonnement trouvé pour cette adresse email.');
    }

    return await abonneRepository.deleteByEmail(email);
  }

  /**
   * Supprime un abonné par ID (Admin)
   * @param {number} id 
   * @returns {Promise<boolean>}
   */
  async supprimerAbonne(id) {
    const result = await abonneRepository.deleteById(id);
    if (!result) {
      throw new Error('Abonné introuvable.');
    }
    return result;
  }
}

module.exports = new AbonnementService();