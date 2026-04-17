const statRepository = require('../repositories/stat.repository');
const { sequelize, benevole, membre, Projet, Don ,Evenement,MessageContact} = require('../models');

class StatService {
    
    // 1. Basic CRUD for generic/custom stats
    async createStat(data) {
        return await sequelize.transaction(async (t) => {
            const existingKey = await statRepository.findByKey(data.cle);
            if (existingKey) {
                throw new Error("Cette clé de statistique existe déjà.");
            }
            return await statRepository.create(data, t);
        });
    }

    async getAllStats() {
        return await statRepository.findAll();
    }

    async getStatById(id) {
        const stat = await statRepository.findById(id);
        if (!stat) throw new Error("Statistique introuvable.");
        return stat;
    }

    async updateStat(id, updateData) {
        return await sequelize.transaction(async (t) => {
            // Check key conflict if they update the key
            if (updateData.cle) {
                const statWithKey = await statRepository.findByKey(updateData.cle);
                if (statWithKey && statWithKey.id !== Number(id)) {
                    throw new Error("Cette clé existe déjà chez une autre statistique.");
                }
            }
            const updated = await statRepository.update(id, updateData, t);
            if (!updated) throw new Error("Erreur de mise à jour: Statistique introuvable.");
            return updated;
        });
    }

    async deleteStat(id) {
        return await sequelize.transaction(async (t) => {
            const deleted = await statRepository.delete(id, t);
            if (!deleted) throw new Error("Erreur de suppression: Stat introuvable.");
            return true;
        });
    }

    // 2. Service "Jocker" intelligent: Recalcul automatique des statistiques réelles (Analyse globale)
    async syncGlobalStats() {
        return await sequelize.transaction(async (t) => {
            // Comptes réels depuis les différentes tables
            const totalBenevoles = await benevole.count({ transaction: t });
            const totalMembres = await membre.count({ transaction: t });
            const totalProjets = await Projet.count({ transaction: t });
            const totalDons = await Don.count({ transaction: t });
            const totalEvenements = await Evenement.count({ transaction: t });
            const totalMessages = await MessageContact.count({ transaction: t });

            const statsToSync = [
                { 
                    cle: 'TOTAL_BENEVOLES', 
                    valeur: totalBenevoles, 
                    label_fr: 'Total des Bénévoles', 
                    label_ar: 'إجمالي المتطوعين', 
                    label_en: 'Total Volunteers',
                    icone: 'people' 
                },
                { 
                    cle: 'TOTAL_MEMBRES', 
                    valeur: totalMembres, 
                    label_fr: 'Membres Actifs', 
                    label_ar: 'الأعضاء النشطين', 
                    label_en: 'Active Members',
                    icone: 'badge' 
                },
                { 
                    cle: 'TOTAL_PROJETS', 
                    valeur: totalProjets, 
                    label_fr: 'Projets', 
                    label_ar: 'المشاريع', 
                    label_en: 'Projects',
                    icone: 'task' 
                },
                { 
                    cle: 'TOTAL_DONS', 
                    valeur: totalDons, 
                    label_fr: 'Dons Effectués', 
                    label_ar: 'التبرعات المقدمة', 
                    label_en: 'Donations Made',
                    icone: 'volunteer_activism' 
                },
                {
                    cle: 'TOTAL_EVENEMENTS',
                    valeur: totalEvenements,
                    label_fr: 'Événements',
                    label_ar: 'الفعاليات',
                    label_en: 'Events',
                    icone: 'event'
                },
                {
                    cle: 'TOTAL_MESSAGES',
                    valeur: totalMessages,
                    label_fr: 'Messages',
                    label_ar: 'الرسائل',
                    label_en: 'Messages',
                    icone: 'message'
                }
            ];

            const results = [];
            for (let statData of statsToSync) {
                let existingStat = await statRepository.findByKey(statData.cle);
                if (existingStat) {
                    await existingStat.update({ valeur: statData.valeur }, { transaction: t });
                    results.push(existingStat);
                } else {
                    const newStat = await statRepository.create(statData, t);
                    results.push(newStat);
                }
            }
            return results;
        });
    }
}

module.exports = new StatService();
