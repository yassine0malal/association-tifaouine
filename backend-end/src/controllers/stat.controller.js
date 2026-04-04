const statService = require('../services/stat.service');

class StatController {
    /**
     * @desc    Créer une statistique manuelle (Admin)
     */
    async create(req, res) {
        try {
            const { cle, valeur, label_fr, label_ar, label_en, icone } = req.body;
            
            if (!cle || valeur === undefined || !label_fr || !label_ar || !label_en) {
                return res.status(400).json({
                    success: false,
                    message: "cle, valeur, label_fr, label_ar, et label_en sont obligatoires."
                });
            }

            const newStat = await statService.createStat({ cle, valeur, label_fr, label_ar, label_en, icone });
            
            return res.status(201).json({
                success: true,
                message: "Statistique créée avec succès.",
                data: newStat
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * @desc    Récupérer toutes les statistiques (Public/Admin)
     */
    async getAll(req, res) {
        try {
            const stats = await statService.getAllStats();
            return res.status(200).json({ success: true, data: stats });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    

    /**
     * @desc    Synchroniser les statistiques globales dynamiquement depuis les autres tables (Jocker Service) (Admin)
     */
    async sync(req, res) {
        try {
            const syncedStats = await statService.syncGlobalStats();
            return res.status(200).json({
                success: true,
                message: "Statistiques synchronisées avec succès.",
                data: syncedStats
            });
        } catch (error) {
            console.error("Erreur sync stats:", error);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la synchronisation des statistiques.",
                error: error.message
            });
        }
    }

    /**
     * @desc    Mettre à jour une statistique (Admin)
     */
    async update(req, res) {
        try {
            const updated = await statService.updateStat(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Statistique mise à jour.", data: updated });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * @desc    Supprimer une statistique (Admin)
     */
    async delete(req, res) {
        try {
            await statService.deleteStat(req.params.id);
            return res.status(200).json({ success: true, message: "Statistique supprimée." });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new StatController();
