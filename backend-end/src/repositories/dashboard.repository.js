const { sequelize, Projet, Evenement, Domaine, Don, DonFinancier, Utilisateur } = require('../models');
const { Op } = require('sequelize');

class DashboardRepository {

    async countProjets() {
        return await Projet.count();
    }

    async countEvenements() {
        return await Evenement.count();
    }

    async countDomaines() {
        return await Domaine.count();
    }

    /**
     * Somme des montants des dons financiers confirmés (statut: recu | traite)
     */
    async sumDonsFinanciers() {
        const result = await DonFinancier.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('DonFinancier.montant')), 'total']
            ],
            include: [{
                model: Don,
                attributes: [],
                where: { statut: { [Op.in]: ['recu', 'traite'] } },
                required: true
            }],
            raw: true
        });
        return parseFloat(result?.total) || 0;
    }

    /**
     * Somme de nb_beneficiaires sur tous les projets
     */
    async sumBeneficiaires() {
        const result = await Projet.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('nb_beneficiaires')), 'total']
            ],
            raw: true
        });
        return parseInt(result?.total) || 0;
    }

    /**
     * Somme des budgets de tous les projets
     */
    async sumBudgetProjets() {
        const result = await Projet.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('budget')), 'total']
            ],
            raw: true
        });
        return parseFloat(result?.total) || 0;
    }

    /**
     * Les 5 derniers utilisateurs inscrits (ordre décroissant par created_at)
     */
    async findRecentUsers(limit = 5) {
        return await Utilisateur.findAll({
            attributes: ['id', 'nom', 'email', 'type', 'created_at'],
            order: [['created_at', 'DESC']],
            limit
        });
    }
}

module.exports = new DashboardRepository();
