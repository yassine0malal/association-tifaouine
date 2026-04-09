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

    /**
     * @desc    Recuperer avec un identifiant 
     */
    async getDomaineById(id) {
        const d = await domaineRepository.findById(id);
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
            // si une nouvelle icone est fournie, supprimer physiquement l'ancienne du disque
            if (updateData.icone && d.icone && updateData.icone !== d.icone) {
                try {
                    const ancienChemin = path.join(__dirname, '..', d.icone);
                    if (fs.existsSync(ancienChemin)) {
                        fs.unlinkSync(ancienChemin);
                        console.log("ancienne icone supprimee : ", ancienChemin);
                    }
                } catch (err) {
                    // on logue l'erreur mais on ne bloque pas la mise a jour
                    console.error("erreur lors de la suppression de l'ancienne icone : ", err.message);
                }
            }

            const misAjour = await domaineRepository.update(id, updateData, { transaction: t });
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
            // supprimer physiquement l'image de l'icone si elle existe
            if (d.icone) {
                try {
                    const cheminIcone = path.join(__dirname, '..', d.icone);
                    if (fs.existsSync(cheminIcone)) {
                        fs.unlinkSync(cheminIcone);
                        console.log("icone supprimee du disque : ", cheminIcone);
                    }
                } catch (err) {
                    console.error("erreur lors de la suppression de l'icone : ", err.message);
                }
            }

            await domaineRepository.delete(id, { transaction: t });
            return true;
        });
    }
}

module.exports = new DomaineService();
