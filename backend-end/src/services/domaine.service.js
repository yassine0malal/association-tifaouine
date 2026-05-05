const { sequelize } = require('../config/database');
const domaineRepository = require('../repositories/domaine.repository');
const fs = require('fs');
const path = require('path');

class DomaineService {

    /**
     * @desc    Creer un nouveau domaine avec transaction
     */
    async createDomaine(data) {
        // petites verifications de base 
        if (!data.nom_fr || !data.nom_ar || !data.nom_en) {
            throw new Error("les noms du domaine en fr, ar et en sont obligatoires");
        }

        // verifier si le meme domaine existe deja 
        const exsist = await domaineRepository.findByName(data.nom_fr);
        if (exsist) {
            throw new Error("ce domaine existe deja dans la base de donnees");
        }

        // enrobage dans une transaction pour garantir l'integrite des donnees
        return await sequelize.transaction(async (t) => {
            const nvDomaine = await domaineRepository.create(data, { transaction: t });
            return nvDomaine;
        });
    }

    /**
     * @desc    Recuperation de toutes les donnees 
     */
    async getAllDomaines(filters = {}) {
        return await domaineRepository.findAll(filters);
    }

    async getAllDomainesOrdered() {
        return await domaineRepository.findAllOrdered();
    }

    /**
     * @desc    Recuperer avec un identifiant 
     */
    async getDomaineById(id) {
        const d = await domaineRepository.findById(id);
        if (!d) throw new Error("ce domaine n'existe pas");
        return d;
    }

    /**
     * @desc    Recuperer un domaine par ID avec statistiques
     */
    async getDomaineByIdWithStats(id) {
        const d = await domaineRepository.findByIdWithStats(id);
        if (!d) throw new Error("ce domaine n'existe pas");
        return d;
    }

    /**
     * @desc    Mise a jour du domaine avec gestion de l'ancienne icone
     */
    async updateDomaine(id, updateData) {
        const d = await domaineRepository.findById(id);
        if (!d) throw new Error("domaine introuvable pour la mise a jour");

        return await sequelize.transaction(async (t) => {
            // Nettoyer les champs null ou vides (ne pas les mettre a jour)
            const cleanedData = {};
            for (const [key, value] of Object.entries(updateData)) {
                // Si la valeur n'est pas null, undefined ou chaine vide, on la garde
                if (value !== null && value !== undefined && value !== '') {
                    cleanedData[key] = value;
                }
            }

            // Gestion speciale de l'icone
            if (cleanedData.icone && d.icone && cleanedData.icone !== d.icone) {
                // Une nouvelle icone est fournie, supprimer l'ancienne
                try {
                    const ancienChemin = path.join(__dirname, '..', d.icone);
                    if (fs.existsSync(ancienChemin)) {
                        fs.unlinkSync(ancienChemin);
                        console.log("[UPDATE] Ancienne icone supprimee:", ancienChemin);
                    }
                } catch (err) {
                    console.error("[UPDATE] Erreur suppression ancienne icone:", err.message);
                }
            } else if (!cleanedData.icone) {
                // Pas de nouvelle icone fournie, garder l'ancienne
                delete cleanedData.icone;
            }

            const misAjour = await domaineRepository.update(id, cleanedData, { transaction: t });
            return misAjour;
        });
    }

    /**
     * @desc    Suppression du domaine et de son icone physique
     */
    async deleteDomaine(id) {
        const d = await domaineRepository.findById(id);
        if (!d) throw new Error("suppression impossible, ce domaine n'existe pas");

        return await sequelize.transaction(async (t) => {
            // Supprimer physiquement l'icone si elle existe
            if (d.icone) {
                try {
                    const cheminIcone = path.join(__dirname, '..', d.icone);
                    if (fs.existsSync(cheminIcone)) {
                        fs.unlinkSync(cheminIcone);
                        console.log("[DELETE] Icone supprimee:", cheminIcone);
                    }
                } catch (err) {
                    console.error("[DELETE] Erreur suppression icone:", err.message);
                }
            }

            await domaineRepository.delete(id, { transaction: t });
            return true;
        });
    }

    /**
     * @desc    Recuperer tous les domaines avec statistiques et pagination
     */
    async getAllDomainesWithStats(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        const result = await domaineRepository.findAllWithStats({ 
            limit: parseInt(limit), 
            offset: parseInt(offset) 
        });
        
        return {
            domaines: result.rows,
            pagination: {
                total: result.count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(result.count / limit)
            }
        };
    }
}

module.exports = new DomaineService();
