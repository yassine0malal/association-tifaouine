const dashboardService = require('../services/dashboard.service');

class DashboardController {

    /**
     * @route   GET /api/admin/dashboard
     * @desc    Récupérer les statistiques du tableau de bord admin
     * @access  Private (Admin)
     */
    async getStats(req, res) {
        try {
            const stats = await dashboardService.getAdminDashboardStats();
            return res.status(200).json({ success: true, data: stats });
        } catch (error) {
            console.error('Erreur dashboard admin:', error.message);
            return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des statistiques.' });
        }
    }
}

module.exports = new DashboardController();
