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

    async getAllProjetsWithDomaineForDon(filters = {}) {
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

    async getProjetByIdComplet(id) {
        const result = await projetRepository.findByIdComplet(id);
        if (!result) throw new Error(`Le projet avec l'ID ${id} n'existe pas`);
        return result;
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
    // ─── Helpers fichiers ────────────────────────────────────────────────────

    /** Convertit une URL relative (ex: /data/...) en chemin absolu Windows-safe */
    _toAbsPath(relUrl) {
        return path.join(__dirname, '..', relUrl.replace(/^\//, ''));
    }

    /** Supprime les dossiers vides après unlinkSync (remonte jusqu'à 3 niveaux) */
    _removeEmptyDirs(filePath) {
        try {
            let dir = path.dirname(filePath);
            for (let i = 0; i < 3; i++) {
                const entries = fs.readdirSync(dir);
                if (entries.length === 0) {
                    fs.rmdirSync(dir);
                    dir = path.dirname(dir);
                } else break;
            }
        } catch (_) {}
    }

    // ─────────────────────────────────────────────────────────────────────────

    async deleteProjetComplet(id) {
        const projet = await projetRepository.findById(id);
        if (!projet) throw new Error("Suppression impossible, ce projet n'existe pas");

        // Récupérer toutes les ressources liées pour supprimer les fichiers physiques
        const ressources = await ressourceRepository.findAll({ projet_id: id, limit: 9999, offset: 0 });

        return await sequelize.transaction(async (t) => {
            // Supprimer les fichiers physiques des ressources
            for (const ressource of ressources.rows) {
                if (ressource.url) {
                    try {
                        const filePath = this._toAbsPath(ressource.url);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                            this._removeEmptyDirs(filePath);
                        }
                    } catch (_) {}
                }
            }
            // Supprimer l'image principale
            if (projet.image_principale) {
                try {
                    const filePath = this._toAbsPath(projet.image_principale);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        this._removeEmptyDirs(filePath);
                    }
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
                    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
                    return {
                        projet_id: nvProjet.id,
                        type: 'photo',
                        url: `${galerieRelUrl}/${file.filename}`,
                        nom_original: file.originalname,
                        file_size: stat ? stat.size : null,
                        file_type: ext || null,
                        is_featured: false
                    };
                });
                await ressourceRepository.bulkCreate(imagesData, { transaction: t });
            }

            // 4. Ressources vidéo (extraVideos)
            if (videoFiles && videoFiles.length > 0) {
                const videosData = videoFiles.map(file => {
                    const stat = fs.existsSync(file.path) ? fs.statSync(file.path) : null;
                    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
                    return {
                        projet_id: nvProjet.id,
                        type: 'video',
                        url: `${videosRelUrl}/${file.filename}`,
                        nom_original: file.originalname,
                        file_size: stat ? stat.size : null,
                        file_type: ext || null,
                        is_featured: false
                    };
                });
                await ressourceRepository.bulkCreate(videosData, { transaction: t });
            }

            return nvProjet;
        });
    }

    /**
     * Mise à jour complète d'un projet avec gestion des ressources existantes
     * Garde seulement les ressources présentes dans les tableaux "existing" et ajoute les nouvelles
     */
    async updateProjetComplet(id, projetData, principalFile, principalRelUrl, extraFiles, galerieRelUrl, videoFiles, videosRelUrl) {
        const projet = await projetRepository.findById(id);
        const oldFolder = cleanFolderName(projet.titre_fr);
        const newFolder = cleanFolderName(projetData.titre_fr || projet.titre_fr);



        if (oldFolder !== newFolder) {
            const basePath = path.join(__dirname, '../data/ressources');
            const foldersToRename = [
                `images/projets/${oldFolder}`,
                `videos/projets/${oldFolder}`,
            ];

            for (const folder of foldersToRename) {
                const oldPath = path.join(basePath, folder);
                const newPath = path.join(basePath, folder.replace(oldFolder, newFolder));
                if (fs.existsSync(oldPath)) {
                    fs.renameSync(oldPath, newPath);
                }
            }

            // ✅ Mettre à jour les URLs en DB pour refléter le nouveau dossier
            const resources = await ressourceRepository.findAll({ projet_id: id, limit: 9999, offset: 0 });
            for (const resource of resources.rows) {
                if (resource.url) {
                    const newUrl = resource.url.replace(oldFolder, newFolder);
                    await ressourceRepository.update(resource.id, { url: newUrl });
                }
            }

            // Mettre à jour l'image principale aussi
            if (projet.image_principale) {
                champProjet.image_principale = projet.image_principale.replace(oldFolder, newFolder);
            }
        }


        if (!projet) throw new Error("Projet introuvable pour la mise à jour");

        if (projetData.statut) {
            projetData.statut = STATUT_MAP[projetData.statut] || projetData.statut;
        }

        // Extraire les données des ressources existantes
        const {
            existingImagePrincipale,
            existingExtraImages = [],
            existingVideos = [],
            partenariat_ids,
            ...champProjet
        } = projetData;
        console.warn("proj------------>", projetData)

        // --- Bug #3 : Gestion du renommage de dossier si titre_fr change ---
        const ancienFolder  = cleanFolderName(projet.titre_fr);
        const nouveauFolder = cleanFolderName(champProjet.titre_fr || projet.titre_fr);
        let folderRenomme   = false;

        if (champProjet.titre_fr && ancienFolder !== nouveauFolder) {
            const baseDir = path.join(__dirname, '../data/ressources');
            const pairesRenommage = [
                [
                    path.join(baseDir, 'images', 'projets', ancienFolder),
                    path.join(baseDir, 'images', 'projets', nouveauFolder)
                ],
                [
                    path.join(baseDir, 'videos', 'projets', ancienFolder),
                    path.join(baseDir, 'videos', 'projets', nouveauFolder)
                ]
            ];
            for (const [oldPath, newPath] of pairesRenommage) {
                if (fs.existsSync(oldPath)) {
                    try {
                        // Copier d'abord, puis supprimer (contourne EPERM OneDrive/Windows)
                        fs.cpSync(oldPath, newPath, { recursive: true });
                        fs.rmSync(oldPath, { recursive: true, force: true });
                        console.log(`[Renommage] OK: ${oldPath} → ${newPath}`);
                    } catch (err) {
                        console.error(`[Renommage] ECHEC: ${oldPath} → ${newPath}`, err.message);
                    }
                } else {
                    console.warn(`[Renommage] Dossier source introuvable: ${oldPath}`);
                }
            }
            // Mettre à jour image_principale si elle référence l'ancien folder
            if (champProjet.image_principale && champProjet.image_principale.includes(ancienFolder)) {
                champProjet.image_principale = champProjet.image_principale.replace(ancienFolder, nouveauFolder);
            } else if (projet.image_principale && projet.image_principale.includes(ancienFolder)) {
                champProjet.image_principale = projet.image_principale.replace(ancienFolder, nouveauFolder);
            }
            folderRenomme = true;
        }

        // Si le folder a été renommé, mettre à jour existingImagePrincipale aussi
        // pour éviter qu'elle écrase la valeur déjà corrigée
        let existingImagePrincipaleNormalisee = existingImagePrincipale;
        if (folderRenomme && existingImagePrincipale && existingImagePrincipale.includes(ancienFolder)) {
            existingImagePrincipaleNormalisee = existingImagePrincipale.replace(ancienFolder, nouveauFolder);
        }

        // Helper local: strip leading slash for correct path resolution on Windows
        const toAbsPath = (relUrl) => this._toAbsPath(relUrl);

        // Gestion de l'image principale
        if (principalFile && principalRelUrl) {
            // Nouvelle image principale uploadée
            if (projet.image_principale && projet.image_principale !== existingImagePrincipaleNormalisee) {
                try {
                    const oldPath = toAbsPath(projet.image_principale);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                } catch (_) { }
            }
            champProjet.image_principale = `${principalRelUrl}/${principalFile.filename}`;
        } else if (existingImagePrincipaleNormalisee) {
            // Garder l'image principale existante (avec URL corrigée si renommage)
            champProjet.image_principale = existingImagePrincipaleNormalisee;
        } else {
            // Supprimer l'image principale si elle n'est pas dans existing
            if (projet.image_principale) {
                try {
                    const oldPath = toAbsPath(projet.image_principale);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                } catch (_) { }
            }
            champProjet.image_principale = null;
        }

        // Normaliser partenariat_ids
        let normalizedPartenariatIds = partenariat_ids;
        if (normalizedPartenariatIds !== undefined) {
            if (!Array.isArray(normalizedPartenariatIds)) normalizedPartenariatIds = [normalizedPartenariatIds];
            normalizedPartenariatIds = normalizedPartenariatIds.map(Number).filter(n => !isNaN(n));
        }

        return await sequelize.transaction(async (t) => {
            // 1. Mettre à jour le projet
            const misAjour = await projetRepository.update(id, champProjet, { transaction: t });

            // 2. Mettre à jour les partenariats si fournis
            if (normalizedPartenariatIds !== undefined) {
                await misAjour.setPartenariats(normalizedPartenariatIds, { transaction: t });
            }

            // 3. Mettre à jour les URLs des ressources en DB si le folder a changé (Bug #3)
            if (folderRenomme) {
                const { QueryTypes } = require('sequelize');
                await sequelize.query(
                    `UPDATE ressource SET url = REPLACE(url, :ancien, :nouveau) WHERE projet_id = :id`,
                    {
                        replacements: { ancien: ancienFolder, nouveau: nouveauFolder, id },
                        type: QueryTypes.UPDATE,
                        transaction: t
                    }
                );
            }

            // 4. Gérer les ressources existantes (images et vidéos)
            await this._manageExistingResources(id, existingExtraImages, existingVideos, { transaction: t });

            // 5. Ajouter les nouvelles images
            if (extraFiles && extraFiles.length > 0) {
                const folder = cleanFolderName(projet.titre_fr);
                const relUrl = galerieRelUrl || `/data/ressources/images/projets/${folder}/galerie`;
                const imagesData = extraFiles.map(file => {
                    const stat = fs.existsSync(file.path) ? fs.statSync(file.path) : null;
                    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
                    return {
                        projet_id: id,
                        type: 'photo',
                        url: `${relUrl}/${file.filename}`,
                        nom_original: file.originalname,
                        file_size: stat ? stat.size : null,
                        file_type: ext || null,
                        is_featured: false
                    };
                });
                await ressourceRepository.bulkCreate(imagesData, { transaction: t });
            }

            // 5. Ajouter les nouvelles vidéos
            if (videoFiles && videoFiles.length > 0) {
                const folder = cleanFolderName(projet.titre_fr);
                const relUrl = videosRelUrl || `/data/ressources/videos/projets/${folder}`;
                const videosData = videoFiles.map(file => {
                    const stat = fs.existsSync(file.path) ? fs.statSync(file.path) : null;
                    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
                    return {
                        projet_id: id,
                        type: 'video',
                        url: `${relUrl}/${file.filename}`,
                        nom_original: file.originalname,
                        file_size: stat ? stat.size : null,
                        file_type: ext || null,
                        is_featured: false
                    };
                });
                await ressourceRepository.bulkCreate(videosData, { transaction: t });
            }

            return misAjour;
        });
    }

    /**
     * Méthode privée pour gérer les ressources existantes
     * Supprime les ressources qui ne sont pas dans les tableaux "existing"
     */
    async _manageExistingResources(projetId, existingImages = [], existingVideos = [], options = {}) {
        // Récupérer toutes les ressources actuelles du projet
        const currentResources = await ressourceRepository.findAll({
            projet_id: projetId,
            limit: 9999,
            offset: 0
        });

        const resourcesToKeep = [...existingImages, ...existingVideos];

        // Bug #4 : normaliser les URLs avant comparaison (slashes, espaces, encodage)
        const normalizeUrl = (url) => url?.trim().replace(/\\/g, '/').replace(/\/+/g, '/') || '';
        const resourcesToKeepNormalized = resourcesToKeep.map(normalizeUrl);

        const validResourcesToKeep = currentResources.rows.filter(resource =>
            resourcesToKeepNormalized.includes(normalizeUrl(resource.url))
        );

        const resourcesToDelete = currentResources.rows.filter(resource =>
            !resourcesToKeepNormalized.includes(normalizeUrl(resource.url))
        );

        // Supprimer les fichiers physiques et les entrées DB
        for (const resource of resourcesToDelete) {
            if (resource.url) {
                try {
                    const filePath = path.join(__dirname, '..', resource.url.replace(/^\//, ''));
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        this._removeEmptyDirs(filePath);
                    }
                } catch (_) {}
            }
            await ressourceRepository.delete(resource.id, options);
        }

        return {
            kept:    validResourcesToKeep.length,
            deleted: resourcesToDelete.length
        };
    }
}

module.exports = new ProjetService();
