const { sequelize, Projet, Evenement, Domaine, Don, DonFinancier, Utilisateur } = require('../models');
const { Op } = require('sequelize');

class DashboardService {

    async getAdminDashboardStats() {
        const [
            totalProjets,
            totalEvenements,
            totalDomaines,
            totalDonsFinanciers,
            totalBeneficiaires,
            totalBudgetProjets,
            recentUsers
        ] = await Promise.all([
            // 1. Nombre total de projets
            Projet.count(),

            // 2. Nombre total d'événements
            Evenement.count(),

            // 3. Nombre total de domaines
            Domaine.count(),

            // 4. Total des dons financiers (montant) - uniquement les dons avec statut 'recu' ou 'traite'
            DonFinancier.findOne({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('DonFinancier.montant')), 'total']
                ],
                include: [{
                    model: Don,
                    attributes: [],
                    where: {
                        statut: { [Op.in]: ['recu', 'traite'] }
                    },
                    required: true
                }],
                raw: true
            }),

            // 5. Nombre total de bénéficiaires (somme de nb_beneficiaires sur tous les projets)
            Projet.findOne({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('nb_beneficiaires')), 'total']
                ],
                raw: true
            }),

            // 6. Total des budgets de projets
            Projet.findOne({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('budget')), 'total']
                ],
                raw: true
            }),

            // 7. Les 5 utilisateurs les plus récents (ordre décroissant par date de création)
            Utilisateur.findAll({
                attributes: ['id', 'nom', 'email', 'type', 'created_at'],
                order: [['created_at', 'DESC']],
                limit: 5
            })
        ]);

        return {
            total_projets: totalProjets,
            total_evenements: totalEvenements,
            total_domaines: totalDomaines,
            total_dons_financiers: parseFloat(totalDonsFinanciers?.total) || 0,
            total_beneficiaires: parseInt(totalBeneficiaires?.total) || 0,
            total_budget_projets: parseFloat(totalBudgetProjets?.total) || 0,
            recent_users: recentUsers
        };
    }
}

module.exports = new DashboardService();
