const abonnementService = require('../services/abonnement.service');

class AbonnementController {
  /**
   * @route  POST /api/abonnement
   * @desc   Souscrire à la newsletter
   * @access Public (protégé par CSRF + Honeypot)
   */
  async souscrire(req, res) {
    try {
      const result = await abonnementService.souscrireAbonnement(req.body);
      
      return res.status(201).json({
        success: true,
        message: 'Votre abonnement à notre newsletter a été confirmé avec succès. Merci !',
        data: result
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * @route  GET /api/admin/abonnes
   * @desc   Récupérer tous les abonnés avec pagination et filtres
   * @access Private (Admin)
   */
  async getAllAbonnes(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        dateDebut: req.query.dateDebut,
        dateFin: req.query.dateFin
      };

      const result = await abonnementService.getAllAbonnes(filters);
      
      return res.status(200).json({
        success: true,
        message: 'Liste des abonnés récupérée avec succès',
        data: result
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération des abonnés',
        error: error.message 
      });
    }
  }

  /**
   * @route  GET /api/admin/abonnes/stats
   * @desc   Récupérer les statistiques des abonnements
   * @access Private (Admin)
   */
  async getStats(req, res) {
    try {
      const stats = await abonnementService.getAbonnementStats();
      
      return res.status(200).json({
        success: true,
        message: 'Statistiques récupérées avec succès',
        data: stats
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message 
      });
    }
  }

  /**
   * @route  DELETE /api/admin/abonnes/:id
   * @desc   Supprimer un abonné
   * @access Private (Admin)
   */
  async supprimerAbonne(req, res) {
    try {
      const { id } = req.params;
      await abonnementService.supprimerAbonne(parseInt(id));
      
      return res.status(200).json({
        success: true,
        message: 'Abonné supprimé avec succès'
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * @route  POST /api/abonnement/desabonner
   * @desc   Se désabonner de la newsletter
   * @access Public
   */
  async desabonner(req, res) {
    try {
      const { email } = req.body;
      await abonnementService.desabonner(email);
      
      return res.status(200).json({
        success: true,
        message: 'Vous avez été désabonné avec succès de notre newsletter.'
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new AbonnementController();