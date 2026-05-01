const dashboardRepository = require('../repositories/dashboard.repository');
const { toDashboardStatsDTO } = require('../dto/dashboard.dto');

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
            dashboardRepository.countProjets(),
            dashboardRepository.countEvenements(),
            dashboardRepository.countDomaines(),
            dashboardRepository.sumDonsFinanciers(),
            dashboardRepository.sumBeneficiaires(),
            dashboardRepository.sumBudgetProjets(),
            dashboardRepository.findRecentUsers(5)
        ]);

        return toDashboardStatsDTO({
            totalProjets,
            totalEvenements,
            totalDomaines,
            totalDonsFinanciers,
            totalBeneficiaires,
            totalBudgetProjets,
            recentUsers
        });
    }
}

module.exports = new DashboardService();
