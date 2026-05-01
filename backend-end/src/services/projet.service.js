const { sequelize } = require('../config/database');
const projetRepository = require('../repositories/projet.repository');
const ressourceRepository = require('../repositories/ressource.repository');
const { STATUT_MAP } = require('../validations/projet.validation');
const { cleanFolderName } = require('../utils/fileHelpers');
const fs = require('fs');
const path = require('path');

class ProjetService {
    async getAllProjetsForAdmin(filters = {}) {
        return await projetRepository.findAllForAdmin(filters);
    }

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
     * Suppression complète d'un projet : supprime les fichiers physiques de toutes
     * ses ressources (images + vidéos) puis supprime le projet en DB (cascade sur ressources)
     */
    async deleteProjetComplet(id) {
        const projet = await projetRepository.findById(id);
        if (!projet) throw new Error("Suppression impossible, ce projet n'existe pas");

        // Récupérer toutes les ressources liées pour supprimer les fichiers physiques
        const ressources = await ressourceRepository.findAll({ projet_id: id, limit: 9999, offset: 0 });

        return await sequelize.transaction(async (t) => {
            // Supprimer les fichiers physiques
            for (const ressource of ressources.rows) {
                if (ressource.url) {
                    try {
                        const filePath = path.join(__dirname, '..', ressource.url);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    } catch (_) {}
                }
            }
            // Supprimer l'image principale
            if (projet.image_principale) {
                try {
                    const filePath = path.join(__dirname, '..', projet.image_principale);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                } catch (_) {}
            }
            await projetRepository.delete(id, { transaction: t });
            return true;
        });
    }

    /**
     * Création complète d'un projet avec image principale + galerie d'images + vidéos
     * Tout se passe dans une seule transaction.
     *
     * @param {Object} projetData      - champs du projet (validés)
     * @param {Object} principalFile   - req.files['imagePrincipale'][0] ou null
     * @param {string} principalRelUrl - req._principalRelUrl
     * @param {Array}  extraFiles      - req.files['extraImages'] ou []
     * @param {string} galerieRelUrl   - req._galerieRelUrl
     * @param {Array}  videoFiles      - req.files['extraVideos'] ou []
     * @param {string} videosRelUrl    - req._videosRelUrl
     */
    async createProjetComplet(projetData, principalFile, principalRelUrl, extraFiles, galerieRelUrl, videoFiles, videosRelUrl) {
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

            // 3. Ressources photo (extraImages)
            if (extraFiles && extraFiles.length > 0) {
                const imagesData = extraFiles.map(file => {
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
                await ressourceRepository.bulkCreate(imagesData, { transaction: t });
            }

            // 4. Ressources vidéo (extraVideos)
            if (videoFiles && videoFiles.length > 0) {
                const videosData = videoFiles.map(file => {
                    const stat = fs.existsSync(file.path) ? fs.statSync(file.path) : null;
                    const ext  = path.extname(file.originalname).toLowerCase().replace('.', '');
                    return {
                        projet_id:    nvProjet.id,
                        type:         'video',
                        url:          `${videosRelUrl}/${file.filename}`,
                        nom_original: file.originalname,
                        file_size:    stat ? stat.size : null,
                        file_type:    ext || null,
                        is_featured:  false
                    };
                });
                await ressourceRepository.bulkCreate(videosData, { transaction: t });
            }

            return nvProjet;
        });
    }

    /**
     * Mise à jour complète d'un projet avec remplacement optionnel des fichiers
     * Les nouvelles images/vidéos sont ajoutées, l'image principale est remplacée si fournie.
     */
    async updateProjetComplet(id, projetData, principalFile, principalRelUrl, extraFiles, galerieRelUrl, videoFiles, videosRelUrl) {
        const projet = await projetRepository.findById(id);
        if (!projet) throw new Error("Projet introuvable pour la mise à jour");

        if (projetData.statut) {
            projetData.statut = STATUT_MAP[projetData.statut] || projetData.statut;
        }

        // Remplacer l'image principale si un nouveau fichier est fourni
        if (principalFile && principalRelUrl) {
            // Supprimer l'ancienne image principale du disque
            if (projet.image_principale) {
                try {
                    const oldPath = path.join(__dirname, '..', projet.image_principale);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                } catch (_) {}
            }
            projetData.image_principale = `${principalRelUrl}/${principalFile.filename}`;
        }

        let { partenariat_ids, ...champProjet } = projetData;
        if (partenariat_ids !== undefined) {
            if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
            partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));
        }

        return await sequelize.transaction(async (t) => {
            // 1. Mettre à jour le projet
            const misAjour = await projetRepository.update(id, champProjet, { transaction: t });

            // 2. Mettre à jour les partenariats si fournis
            if (partenariat_ids !== undefined) {
                await misAjour.setPartenariats(partenariat_ids, { transaction: t });
            }

            // 3. Ajouter les nouvelles images (s'ajoutent à la galerie existante)
            if (extraFiles && extraFiles.length > 0) {
                const folder = cleanFolderName(projet.titre_fr);
                const relUrl = galerieRelUrl || `/data/ressources/images/projets/${folder}/galerie`;
                const imagesData = extraFiles.map(file => {
                    const stat = fs.existsSync(file.path) ? fs.statSync(file.path) : null;
                    const ext  = path.extname(file.originalname).toLowerCase().replace('.', '');
                    return {
                        projet_id:    id,
                        type:         'photo',
                        url:          `${relUrl}/${file.filename}`,
                        nom_original: file.originalname,
                        file_size:    stat ? stat.size : null,
                        file_type:    ext || null,
                        is_featured:  false
                    };
                });
                await ressourceRepository.bulkCreate(imagesData, { transaction: t });
            }

            // 4. Ajouter les nouvelles vidéos
            if (videoFiles && videoFiles.length > 0) {
                const folder = cleanFolderName(projet.titre_fr);
                const relUrl = videosRelUrl || `/data/ressources/videos/projets/${folder}`;
                const videosData = videoFiles.map(file => {
                    const stat = fs.existsSync(file.path) ? fs.statSync(file.path) : null;
                    const ext  = path.extname(file.originalname).toLowerCase().replace('.', '');
                    return {
                        projet_id:    id,
                        type:         'video',
                        url:          `${relUrl}/${file.filename}`,
                        nom_original: file.originalname,
                        file_size:    stat ? stat.size : null,
                        file_type:    ext || null,
                        is_featured:  false
                    };
                });
                await ressourceRepository.bulkCreate(videosData, { transaction: t });
            }

            return misAjour;
        });
    }
}

module.exports = new ProjetService();
