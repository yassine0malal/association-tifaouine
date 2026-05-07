/**
 * DTOs pour le tableau de bord admin
 */

/**
 * DTO pour un utilisateur récent
 */
const toRecentUserDTO = (user) => ({
    id:         user.id,
    nom:        user.nom,
    email:      user.email,
    type:       user.type,
    created_at: user.created_at
});

/**
 * DTO global du dashboard admin
 */
const toDashboardStatsDTO = (stats) => ({
    total_projets:         stats.totalProjets,
    total_evenements:      stats.totalEvenements,
    total_domaines:        stats.totalDomaines,
    total_dons_financiers: stats.totalDonsFinanciers,
    total_beneficiaires:   stats.totalBeneficiaires,
    total_budget_projets:  stats.totalBudgetProjets,
    recent_users:          stats.recentUsers.map(toRecentUserDTO)
});

module.exports = { toDashboardStatsDTO, toRecentUserDTO };
