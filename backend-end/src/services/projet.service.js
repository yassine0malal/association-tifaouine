const { sequelize } = require('../config/database');
const projetRepository = require('../repositories/projet.repository');
const ressourceRepository = require('../repositories/ressource.repository');
const { STATUT_MAP } = require('../validations/projet.validation');
const fs = require('fs');
const path = require('path');

class ProjetService {
    async getAllProjets(filters = {}) {
        return await projetRepository.findAll(filters);
    }

    async getAllProjetsWithDomaine(filters = {}) {
        return await projetRepository.findAllWithDomaine(filters);
    }

    async getAllProjetsWithDomaineForDon(filters={}){
        return await projetRepository.findAllWithDomaineForDon(filters);
    }
    async getProjetById(id) {
        const projet = await projetRepository.findById(id);
        if (!projet) throw new Error(`Le projet avec l'ID ${id} n'existe pas`);
        return projet;
    }

    async getProjetByIdWithDetails(id) {
        const projet = await projetRepository.findByIdWithDetails(id);
        if (!projet) throw new Error(`Le projet avec l'ID ${id} n'existe pas`);
        return projet;
    }

    async getProjetImages(id, filters = {}) {
        await this.getProjetById(id); // vérifie existence
        return await projetRepository.findImages(id, filters);
    }

    /**
     * Création d'un projet avec gestion des partenaires (M2M)
     * @param {Object} data - inclut partenariat_ids?: number[]
     */
    async createProjet(data) {
        let { partenariat_ids = [], ...projetData } = data;
        // Normaliser : string "1" ou nombre 1 → tableau [1]
        if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
        partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));

        return await sequelize.transaction(async (t) => {
            const nvProjet = await projetRepository.create(projetData, { transaction: t });
            if (partenariat_ids.length > 0) {
                await nvProjet.setPartenariats(partenariat_ids, { transaction: t });
            }
            return nvProjet;
        });
    }

    /**
     * Mise à jour d'un projet avec gestion des partenaires (M2M)
     * @param {Object} data - inclut partenariat_ids?: number[] (remplace toute la liste si fourni)
     */
    async updateProjet(id, data) {
        const projet = await projetRepository.findById(id);
        if (!projet) throw new Error("Projet introuvable pour la mise à jour");

        let { partenariat_ids, ...projetData } = data;
        if (partenariat_ids !== undefined) {
            if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
            partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));
        }
        return await sequelize.transaction(async (t) => {
            const misAjour = await projetRepository.update(id, projetData, { transaction: t });
            // Si partenariat_ids est fourni (même vide []), on remplace la liste
            if (partenariat_ids !== undefined) {
                await misAjour.setPartenariats(partenariat_ids, { transaction: t });
            }
            return misAjour;
        });
    }

    async deleteProjet(id) {
        const projet = await projetRepository.findById(id);
        if (!projet) throw new Error("Suppression impossible, ce projet n'existe pas");
        return await sequelize.transaction(async (t) => {
            await projetRepository.delete(id, { transaction: t });
            return true;
        });
    }

    /**
     * Création complète d'un projet avec image principale + galerie d'images extra
     * Tout se passe dans une seule transaction.
     *
     * @param {Object} projetData        - champs du projet (validés)
     * @param {Object} principalFile     - req.files['imagePrincipale'][0] ou null
     * @param {string} principalRelUrl   - req._principalRelUrl
     * @param {Array}  extraFiles        - req.files['extraImages'] ou []
     * @param {string} galerieRelUrl     - req._galerieRelUrl
     */
    async createProjetComplet(projetData, principalFile, principalRelUrl, extraFiles, galerieRelUrl) {
        // Normaliser le statut (ex: "En cours" → "en_cours")
        if (projetData.statut) {
            projetData.statut = STATUT_MAP[projetData.statut] || projetData.statut;
        }

        // Construire l'URL de l'image principale
        if (principalFile && principalRelUrl) {
            projetData.image_principale = `${principalRelUrl}/${principalFile.filename}`;
        }

        let { partenariat_ids = [], ...champProjet } = projetData;
        if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
        partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));

        return await sequelize.transaction(async (t) => {
            // 1. Créer le projet
            const nvProjet = await projetRepository.create(champProjet, { transaction: t });

            // 2. Attacher les partenariats
            if (partenariat_ids.length > 0) {
                await nvProjet.setPartenariats(partenariat_ids, { transaction: t });
            }

            // 3. Créer les ressources photo pour chaque image extra
            if (extraFiles && extraFiles.length > 0) {
                const ressourcesData = extraFiles.map(file => {
                    const stat = fs.existsSync(file.path) ? fs.statSync(file.path) : null;
                    const ext  = path.extname(file.originalname).toLowerCase().replace('.', '');
                    return {
                        projet_id:    nvProjet.id,
                        type:         'photo',
                        url:          `${galerieRelUrl}/${file.filename}`,
                        nom_original: file.originalname,
                        file_size:    stat ? stat.size : null,
                        file_type:    ext || null,
                        is_featured:  false
                    };
                });
                await ressourceRepository.bulkCreate(ressourcesData, { transaction: t });
            }

            return nvProjet;
        });
    }
}

module.exports = new ProjetService();
