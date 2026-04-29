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
        const exist = await partenariatRepository.findByName(data.nom);
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
     * Mise à jour du partenariat avec gestion de l'ancien logo
     */
    async updatePartenariat(id, updateData) {
        const p = await partenariatRepository.findById(id);
        if (!p) throw new Error("Partenaire introuvable pour la mise à jour");

        return await sequelize.transaction(async (t) => {
            // Si un nouveau logo est fourni, supprimer physiquement l'ancien du disque
            if (updateData.logo && p.logo && updateData.logo !== p.logo) {
                try {
                    const ancienChemin = path.join(__dirname, '..', p.logo);
                    if (fs.existsSync(ancienChemin)) {
                        fs.unlinkSync(ancienChemin);
                        console.log("Ancien logo supprimé : ", ancienChemin);
                    }
                } catch (err) {
                    console.error("Erreur lors de la suppression de l'ancien logo : ", err.message);
                }
            }

            const misAjour = await partenariatRepository.update(id, updateData, { transaction: t });
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
            // Supprimer physiquement l'image du logo si elle existe
            if (p.logo) {
                try {
                    const cheminLogo = path.join(__dirname, '..', p.logo);
                    if (fs.existsSync(cheminLogo)) {
                        fs.unlinkSync(cheminLogo);
                        console.log("Logo supprimé du disque : ", cheminLogo);
                    }
                } catch (err) {
                    console.error("Erreur lors de la suppression du logo : ", err.message);
                }
            }

            await partenariatRepository.delete(id, { transaction: t });
            return true;
        });
    }
}

module.exports = new PartenariatService();
