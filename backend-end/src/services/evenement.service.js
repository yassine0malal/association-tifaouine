const { sequelize } = require('../config/database');
const evenementRepository = require('../repositories/evenement.repository');

class EvenementService {
    async getAllEvenements(filters = {}) {
        return await evenementRepository.findAll(filters);
    }

    async getAllEvenementsWithDomaine(filters = {}) {
        return await evenementRepository.findAllWithDomaine(filters);
    }

    async getEvenementById(id) {
        const eve = await evenementRepository.findById(id);
        if (!eve) throw new Error(`L'événement avec l'ID ${id} n'existe pas`);
        return eve;
    }

    /**
     * Récupère toutes les données nécessaires pour le détail frontend d'un événement
     */
    async getEvenementDetail(id) {
        const eve = await evenementRepository.findByIdWithDetails(id);
        if (!eve) throw new Error(`L'événement avec l'ID ${id} n'existe pas`);

        const [relatedEvents, lastedEvents, imagesResult] = await Promise.all([
            evenementRepository.findByDomaine(eve.domaine_id, eve.id),
            evenementRepository.findLasted(eve.id),
            evenementRepository.findImages(eve.id, {})
        ]);

        return { eve, relatedEvents, lastedEvents, images: imagesResult.rows };
    }

    /**
     * Création d'un événement avec gestion des partenaires (M2M)
     * @param {Object} data - inclut partenariat_ids?: number[]
     */
    async createEvenement(data) {
        let { partenariat_ids = [], ...evenementData } = data;
        if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
        partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));

        return await sequelize.transaction(async (t) => {
            const nvEve = await evenementRepository.create(evenementData, { transaction: t });
            if (partenariat_ids.length > 0) {
                await nvEve.setPartenariats(partenariat_ids, { transaction: t });
            }
            return nvEve;
        });
    }

    /**
     * Mise à jour d'un événement avec gestion des partenaires (M2M)
     * @param {Object} data - inclut partenariat_ids?: number[] (remplace toute la liste si fourni)
     */
    async updateEvenement(id, data) {
        const eve = await evenementRepository.findById(id);
        if (!eve) throw new Error("Événement introuvable pour la mise à jour");

        let { partenariat_ids, ...evenementData } = data;
        if (partenariat_ids !== undefined) {
            if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
            partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));
        }
        return await sequelize.transaction(async (t) => {
            const misAjour = await evenementRepository.update(id, evenementData, { transaction: t });
            if (partenariat_ids !== undefined) {
                await misAjour.setPartenariats(partenariat_ids, { transaction: t });
            }
            return misAjour;
        });
    }

    async deleteEvenement(id) {
        const eve = await evenementRepository.findById(id);
        if (!eve) throw new Error("Suppression impossible, cet événement n'existe pas");
        return await sequelize.transaction(async (t) => {
            await evenementRepository.delete(id, { transaction: t });
            return true;
        });
    }

    /**
     * Récupère un événement complet pour l'édition admin
     */
    async getEvenementByIdComplet(id) {
        const result = await evenementRepository.findByIdComplet(id);
        if (!result) throw new Error(`L'événement avec l'ID ${id} n'existe pas`);
        return result;
    }

    /**
     * Récupère les images d'un événement avec pagination
     */
    async getEvenementImages(id, filters = {}) {
        await this.getEvenementById(id); // vérifie existence
        return await evenementRepository.findImages(id, filters);
    }

    // ─── Helpers fichiers ────────────────────────────────────────────────────
    
    /** Convertit une URL relative (ex: /data/...) en chemin absolu Windows-safe */
    _toAbsPath(relUrl) {
        const path = require('path');
        return path.join(__dirname, '..', relUrl.replace(/^\//, ''));
    }

    /** Supprime les dossiers vides après unlinkSync (remonte jusqu'à 3 niveaux) */
    _removeEmptyDirs(filePath) {
        const fs = require('fs');
        const path = require('path');
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

    /**
     * Création complète d'un événement avec image principale + galerie d'images
     * 
     * @param {Object} evenementData    - champs de l'événement (validés)
     * @param {Object} principalFile    - req.files['imagePrincipale'][0] ou null
     * @param {string} principalRelUrl  - req._principalRelUrl
     * @param {Array}  extraFiles       - req.files['extraImages'] ou []
     * @param {string} galerieRelUrl    - req._galerieRelUrl
     */
    async createEvenementComplet(evenementData, principalFile, principalRelUrl, extraFiles, galerieRelUrl) {
        const fs = require('fs');
        const path = require('path');
        const ressourceRepository = require('../repositories/ressource.repository');

        // Construire l'URL de l'image principale
        if (principalFile && principalRelUrl) {
            evenementData.image_principale = `${principalRelUrl}/${principalFile.filename}`;
        }

        let { partenariat_ids = [], ...champEvenement } = evenementData;
        if (!Array.isArray(partenariat_ids)) partenariat_ids = [partenariat_ids];
        partenariat_ids = partenariat_ids.map(Number).filter(n => !isNaN(n));

        return await sequelize.transaction(async (t) => {
            // 1. Créer l'événement
            const nvEve = await evenementRepository.create(champEvenement, { transaction: t });

            // 2. Attacher les partenariats
            if (partenariat_ids.length > 0) {
                await nvEve.setPartenariats(partenariat_ids, { transaction: t });
            }

            // 3. Ressources photo (extraImages - galerie)
            if (extraFiles && extraFiles.length > 0) {
                const imagesData = extraFiles.map(file => {
                    const stat = fs.existsSync(file.path) ? fs.statSync(file.path) : null;
                    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
                    return {
                        evenement_id: nvEve.id,
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

            return nvEve;
        });
    }

    /**
     * Mise à jour complète d'un événement avec gestion des ressources existantes
     */
    async updateEvenementComplet(id, evenementData, principalFile, principalRelUrl, extraFiles, galerieRelUrl) {
        const fs = require('fs');
        const path = require('path');
        const { cleanFolderName } = require('../utils/fileHelpers');
        const ressourceRepository = require('../repositories/ressource.repository');

        console.log("=== [updateEvenementComplet] START ===");
        console.log("ID:", id);
        console.log("evenementData.titre_fr:", evenementData.titre_fr);

        const evenement = await evenementRepository.findById(id);
        if (!evenement) {
            console.error("Événement introuvable pour ID:", id);
            throw new Error("Événement introuvable pour la mise à jour");
        }

        const oldFolder = cleanFolderName(evenement.titre_fr);
        const newFolder = cleanFolderName(evenementData.titre_fr || evenement.titre_fr);

        console.log("Ancien dossier:", oldFolder);
        console.log("Nouveau dossier:", newFolder);

        // Extraire les données des ressources existantes
        // IMPORTANT: on garde undefined si le champ n'est pas envoyé par le frontend
        // pour distinguer "garder tout" (undefined) de "supprimer tout" ([])
        const {
            existingImagePrincipale,
            existingExtraImages,   // undefined = non envoyé → ne pas toucher la galerie
            partenariat_ids,
            ...champEvenement
        } = evenementData;

        // ── Renommage du dossier si le titre change ──────────────────────────
        let folderRenomme = false;

        if (oldFolder !== newFolder) {
            folderRenomme = true;
            const basePath = path.join(__dirname, '../data/ressources');
            const oldPath = path.join(basePath, `images/evenements/${oldFolder}`);
            const newPath = path.join(basePath, `images/evenements/${newFolder}`);

            if (fs.existsSync(oldPath)) {
                try {
                    // Copier d'abord, puis supprimer (contourne EPERM OneDrive/Windows)
                    fs.cpSync(oldPath, newPath, { recursive: true });
                    fs.rmSync(oldPath, { recursive: true, force: true });
                    console.log(`[Renommage] OK: ${oldPath} → ${newPath}`);
                } catch (err) {
                    console.error(`[Renommage] ECHEC: ${oldPath} → ${newPath}`, err.message);
                    throw err;
                }
            }

            // Mettre à jour l'image principale en mémoire (sera persistée dans la transaction)
            if (evenement.image_principale) {
                champEvenement.image_principale = evenement.image_principale.replace(oldFolder, newFolder);
            }
        }

        // ── Normaliser existingImagePrincipale après renommage ───────────────
        let existingImagePrincipaleNormalisee = existingImagePrincipale;
        if (folderRenomme && existingImagePrincipale && existingImagePrincipale.includes(oldFolder)) {
            existingImagePrincipaleNormalisee = existingImagePrincipale.replace(oldFolder, newFolder);
        }

        // ── Gestion de l'image principale ────────────────────────────────────
        const toAbsPath = (relUrl) => this._toAbsPath(relUrl);

        if (principalFile && principalRelUrl) {
            // Nouvelle image uploadée → supprimer l'ancienne si différente
            const currentPrincipal = champEvenement.image_principale || evenement.image_principale;
            if (currentPrincipal && currentPrincipal !== existingImagePrincipaleNormalisee) {
                try {
                    const oldPath = toAbsPath(currentPrincipal);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                } catch (_) { }
            }
            champEvenement.image_principale = `${principalRelUrl}/${principalFile.filename}`;
        } else if (existingImagePrincipaleNormalisee) {
            // Garder l'image principale existante (URL corrigée si renommage)
            champEvenement.image_principale = existingImagePrincipaleNormalisee;
        } else {
            // Pas d'image envoyée et pas d'existing → supprimer l'ancienne
            const currentPrincipal = champEvenement.image_principale || evenement.image_principale;
            if (currentPrincipal) {
                try {
                    const oldPath = toAbsPath(currentPrincipal);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                } catch (_) { }
            }
            champEvenement.image_principale = null;
        }

        // ── Normaliser partenariat_ids ────────────────────────────────────────
        let normalizedPartenariatIds = partenariat_ids;
        if (normalizedPartenariatIds !== undefined) {
            if (!Array.isArray(normalizedPartenariatIds)) normalizedPartenariatIds = [normalizedPartenariatIds];
            normalizedPartenariatIds = normalizedPartenariatIds.map(Number).filter(n => !isNaN(n));
        }

        return await sequelize.transaction(async (t) => {
            // 1. Mettre à jour l'événement
            const misAjour = await evenementRepository.update(id, champEvenement, { transaction: t });

            // 2. Mettre à jour les partenariats si fournis
            if (normalizedPartenariatIds !== undefined) {
                await misAjour.setPartenariats(normalizedPartenariatIds, { transaction: t });
            }

            // 3. Mettre à jour les URLs des ressources en DB si le folder a changé
            if (folderRenomme) {
                const { QueryTypes } = require('sequelize');
                const oldPattern = `/evenements/${oldFolder}/`;
                const newPattern = `/evenements/${newFolder}/`;
                console.log("SQL UPDATE - Ancien pattern:", oldPattern);
                console.log("SQL UPDATE - Nouveau pattern:", newPattern);
                await sequelize.query(
                    `UPDATE ressource SET url = REPLACE(url, :ancien, :nouveau) WHERE evenement_id = :id`,
                    {
                        replacements: { ancien: oldPattern, nouveau: newPattern, id },
                        type: QueryTypes.UPDATE,
                        transaction: t
                    }
                );
            }

            // 4. Gérer les ressources existantes (images galerie)
            // Seulement si le frontend a explicitement envoyé le champ existing
            // (undefined = non envoyé = ne pas toucher les ressources existantes)
            if (existingExtraImages !== undefined) {
                console.log("=== [Gestion ressources existantes] ===");
                console.log("existingExtraImages AVANT:", existingExtraImages);

                // Normaliser les URLs si le dossier a été renommé
                let normalizedExtraImages = existingExtraImages;
                if (folderRenomme) {
                    normalizedExtraImages = (existingExtraImages || []).map(url =>
                        url.replace(oldFolder, newFolder)
                    );
                    console.log("existingExtraImages APRÈS renommage:", normalizedExtraImages);
                }

                await this._manageExistingResources(
                    id,
                    normalizedExtraImages ?? [],
                    { transaction: t }
                );
            } else {
                console.log("=== [Ressources] Pas de gestion (undefined) ===");
            }

            // 5. Ajouter les nouvelles images
            if (extraFiles && extraFiles.length > 0) {
                const folder = cleanFolderName(evenementData.titre_fr || evenement.titre_fr);
                const relUrl = galerieRelUrl || `/data/ressources/images/evenements/${folder}/galerie`;
                const imagesData = extraFiles.map(file => {
                    const stat = fs.existsSync(file.path) ? fs.statSync(file.path) : null;
                    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
                    return {
                        evenement_id: id,
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

            console.log("=== [updateEvenementComplet] AVANT RETURN ===");
            console.log("misAjour.id:", misAjour.id);
            console.log("misAjour.image_principale:", misAjour.image_principale);

            return misAjour;
        });
    }

    /**
     * Suppression complète d'un événement avec toutes ses ressources (fichiers + DB)
     * Supprime le dossier entier de l'événement (images/evenements/{folder})
     */
    async deleteEvenementComplet(id) {
        const fs = require('fs');
        const path = require('path');
        const { cleanFolderName } = require('../utils/fileHelpers');

        const evenement = await evenementRepository.findById(id);
        if (!evenement) throw new Error("Suppression impossible, cet événement n'existe pas");

        return await sequelize.transaction(async (t) => {
            // Supprimer l'enregistrement en DB (cascade supprime les ressources en DB)
            await evenementRepository.delete(id, { transaction: t });

            // Supprimer le dossier entier de l'événement (images galerie + sous-dossiers)
            const folder = cleanFolderName(evenement.titre_fr);
            const folderPath = path.join(__dirname, '../data/ressources/images/evenements', folder);
            if (fs.existsSync(folderPath)) {
                try {
                    fs.rmSync(folderPath, { recursive: true, force: true });
                    console.log(`[Delete] Dossier supprimé: ${folderPath}`);
                } catch (err) {
                    console.error(`[Delete] Echec suppression dossier: ${folderPath}`, err.message);
                }
            }

            // Supprimer l'image principale si elle est hors du dossier galerie
            if (evenement.image_principale) {
                try {
                    const filePath = this._toAbsPath(evenement.image_principale);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        this._removeEmptyDirs(filePath);
                    }
                } catch (_) {}
            }

            return true;
        });
    }

    /**
     * Méthode privée pour gérer les ressources existantes
     */
    async _manageExistingResources(evenementId, existingImages = [], options = {}) {
        const fs = require('fs');
        const path = require('path');
        const ressourceRepository = require('../repositories/ressource.repository');

        const currentResources = await ressourceRepository.findAll({
            evenement_id: evenementId,
            limit: 9999,
            offset: 0
        });

        const normalizeUrl = (url) => url?.trim().replace(/\\/g, '/').replace(/\/+/g, '/') || '';
        const resourcesToKeepNormalized = existingImages.map(normalizeUrl);

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
            kept: validResourcesToKeep.length,
            deleted: resourcesToDelete.length
        };
    }
}

module.exports = new EvenementService();
