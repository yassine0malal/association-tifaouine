const { sequelize } = require('../config/database');
const partenariatRepository = require('../repositories/partenariat.repository');
const fs = require('fs');
const path = require('path');

class PartenariatService {
    /**
     * Créer un nouveau partenariat avec transaction et vérification de doublon
     */
    async createPartenariat(data) {
        // Vérifier si le même partenariat existe déjà 
        const exist = await partenariatRepository.findByName(data.nom_fr);
        if (exist) {
            throw new Error("Ce partenaire existe déjà dans la base de données");
        }

        return await sequelize.transaction(async (t) => {
            const nvPartenariat = await partenariatRepository.create(data, { transaction: t });
            return nvPartenariat;
        });
    }

    /**
     * Récupérer tous les partenariats
     */
    async getAllPartenariats(filters = {}) {
        return await partenariatRepository.findAll(filters);
    }

    async getAllPartenariatsByLang() {
        return await partenariatRepository.findAll();
    }

    async getAllPartenariatsForHomeByLang() {
        return await partenariatRepository.findAll();
    }

    /**
     * Récupérer un partenariat par ID
     */
    async getPartenariatById(id) {
        const p = await partenariatRepository.findById(id);
        if (!p) throw new Error("Ce partenaire n'existe pas");
        return p;
    }

    /**
     * Récupérer un partenariat par ID avec statistiques
     */
    async getPartenariatByIdWithStats(id) {
        const p = await partenariatRepository.findByIdWithStats(id);
        if (!p) throw new Error("Ce partenaire n'existe pas");
        return p;
    }

    /**
     * Récupérer tous les partenariats avec statistiques et pagination
     */
    async getAllPartenariatsWithStats(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        const result = await partenariatRepository.findAllWithStats({ 
            limit: parseInt(limit), 
            offset: parseInt(offset) 
        });
        
        return {
            partenariats: result.rows,
            pagination: {
                total: result.count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(result.count / limit)
            }
        };
    }

    /**
     * Mise à jour du partenariat avec gestion de l'ancien logo
     */
    async updatePartenariat(id, updateData) {
        const p = await partenariatRepository.findById(id);
        if (!p) throw new Error("Partenaire introuvable pour la mise à jour");

        return await sequelize.transaction(async (t) => {
            // Nettoyer les champs null ou vides
            const cleanedData = {};
            for (const [key, value] of Object.entries(updateData)) {
                if (value !== null && value !== undefined && value !== '') {
                    cleanedData[key] = value;
                }
            }

            // Gestion speciale du logo
            if (cleanedData.logo && p.logo && cleanedData.logo !== p.logo) {
                // Un nouveau logo est fourni, supprimer l'ancien
                try {
                    const ancienChemin = path.join(__dirname, '..', p.logo);
                    if (fs.existsSync(ancienChemin)) {
                        fs.unlinkSync(ancienChemin);
                        console.log("[UPDATE] Ancien logo supprimé:", ancienChemin);
                    }
                } catch (err) {
                    console.error("[UPDATE] Erreur suppression ancien logo:", err.message);
                }
            } else if (!cleanedData.logo) {
                // Pas de nouveau logo fourni, garder l'ancien
                delete cleanedData.logo;
            }

            const misAjour = await partenariatRepository.update(id, cleanedData, { transaction: t });
            return misAjour;
        });
    }

    /**
     * Suppression du partenariat et de son logo physique
     */
    async deletePartenariat(id) {
        const p = await partenariatRepository.findById(id);
        if (!p) throw new Error("Suppression impossible, ce partenaire n'existe pas");

        return await sequelize.transaction(async (t) => {
            // Supprimer physiquement le logo si il existe
            if (p.logo) {
                try {
                    const cheminLogo = path.join(__dirname, '..', p.logo);
                    if (fs.existsSync(cheminLogo)) {
                        fs.unlinkSync(cheminLogo);
                        console.log("[DELETE] Logo supprimé:", cheminLogo);
                    }
                } catch (err) {
                    console.error("[DELETE] Erreur suppression logo:", err.message);
                }
            }

            await partenariatRepository.delete(id, { transaction: t });
            return true;
        });
    }
}

module.exports = new PartenariatService();
