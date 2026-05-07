const ressourceService = require('../services/ressource.service');
const { buildPaginatedResponse } = require('../utils/paginate');
const fs = require('fs');
const path = require('path');

class RessourceController {
    /**
     * @route   GET /api/projets/:id/ressources
     * @desc    Récupérer les ressources d'un projet par son ID
     * @access  Public
     */
    async getByProjetId(req, res) {
        try {
            const { type } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await ressourceService.getRessourcesByProjetId(req.params.id, { type, limit, offset });
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            const status = error.message.includes('introuvable') ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/ressources
     * @desc    Récupérer toutes les ressources filtrables
     */
    async getAll(req, res) {
        try {
            const { type, projet_id, evenement_id } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await ressourceService.getAllRessources({ 
                type, 
                projet_id, 
                evenement_id, 
                limit, 
                offset 
            });
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Erreur lors de la récupération des ressources", error: error.message });
        }
    }

    /**
     * @route   GET /api/ressources/:id
     * @desc    Récupérer une ressource
     */
    async getById(req, res) {
        try {
            const ressource = await ressourceService.getRessourceById(req.params.id);
            return res.status(200).json({
                success: true,
                data: ressource
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   POST /api/ressources
     * @desc    Upload et création d'une ou plusieurs ressources (Admin)
     *          fields: 'files' (documents/images, max 20) + 'image_couverture' (optionnel, max 1)
     *          Pour les ressources de l'association: projet_id et evenement_id doivent être null
     */
    async create(req, res) {
        // Avec multer.fields(), req.files est un objet { files: [...], image_couverture: [...] }
        const mainFiles = (req.files && req.files['files']) ? req.files['files'] : [];
        const couvertureFile = (req.files && req.files['image_couverture'])
            ? req.files['image_couverture'][0]
            : null;

        try {
            if (mainFiles.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Aucun fichier n'a été fourni"
                });
            }

            // Validation: si c'est une ressource de l'association, projet_id et evenement_id doivent être null
            const projet_id = req.body.projet_id ? parseInt(req.body.projet_id) : null;
            const evenement_id = req.body.evenement_id ? parseInt(req.body.evenement_id) : null;

            // URL de la couverture si fournie
            const image_couverture = couvertureFile
                ? `${req._couvertureRelUrl}/${couvertureFile.filename}`
                : null;

            const created = [];
            for (const file of mainFiles) {
                const urlEntry = req.uploadedUrls[file._urlIndex];
                const ressourceData = {
                    ...req.body,
                    projet_id,
                    evenement_id,
                    url:              `${urlEntry.relUrl}/${file.filename}`,
                    nom_original:     file.originalname,
                    ...(image_couverture && { image_couverture })
                };

                const nvRessource = await ressourceService.createRessource(ressourceData, file.path);
                created.push(nvRessource);
            }

            return res.status(201).json({
                success: true,
                message: `${created.length} ressource(s) ajoutée(s) avec succès`,
                data:    created.length === 1 ? created[0] : created
            });
        } catch (error) {
            // Nettoyer tous les fichiers écrits sur disque en cas d'erreur
            const allFiles = [...mainFiles, ...(couvertureFile ? [couvertureFile] : [])];
            for (const file of allFiles) {
                if (file.path && fs.existsSync(file.path)) {
                    try { fs.unlinkSync(file.path); } catch (_) {}
                }
            }
            const status = error.status || 400;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   PUT /api/ressources/:id
     * @desc    Mettre à jour les métadonnées (Admin)
     *          Peut aussi mettre à jour les fichiers (url et/ou image_couverture)
     */
    async update(req, res) {
        try {
            const mainFile = (req.files && req.files['files']) ? req.files['files'][0] : null;
            const couvertureFile = (req.files && req.files['image_couverture'])
                ? req.files['image_couverture'][0]
                : null;

            // Récupérer la ressource actuelle
            const ressourceActuelle = await ressourceService.getRessourceById(req.params.id);

            // Préparer les données de mise à jour
            const updateData = { ...req.body };

            // Si un nouveau fichier principal est fourni
            if (mainFile) {
                const urlEntry = req.uploadedUrls ? req.uploadedUrls[mainFile._urlIndex] : null;
                if (urlEntry) {
                    updateData.url = `${urlEntry.relUrl}/${mainFile.filename}`;
                    updateData.nom_original = mainFile.originalname;
                    
                    // Marquer l'ancien fichier pour suppression
                    updateData._oldUrl = ressourceActuelle.url;
                }
            }

            // Si une nouvelle image de couverture est fournie
            if (couvertureFile) {
                updateData.image_couverture = `${req._couvertureRelUrl}/${couvertureFile.filename}`;
                
                // Marquer l'ancienne couverture pour suppression
                updateData._oldImageCouverture = ressourceActuelle.image_couverture;
            }

            // Mettre à jour la ressource
            const misAjour = await ressourceService.updateRessource(req.params.id, updateData);

            return res.status(200).json({
                success: true,
                message: "Ressource mise à jour avec succès",
                data: misAjour
            });
        } catch (error) {
            // Nettoyer les fichiers uploadés en cas d'erreur
            if (req.files) {
                const allFiles = [
                    ...(req.files['files'] || []),
                    ...(req.files['image_couverture'] || [])
                ];
                for (const file of allFiles) {
                    if (file.path && fs.existsSync(file.path)) {
                        try { fs.unlinkSync(file.path); } catch (_) {}
                    }
                }
            }
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   DELETE /api/ressources/:id
     * @desc    Supprimer une ressource (DB + Disque + Image de couverture)
     */
    async delete(req, res) {
        try {
            const ressource = await ressourceService.getRessourceById(req.params.id);

            await ressourceService.deleteRessource(req.params.id);
            
            return res.status(200).json({
                success: true,
                message: "Ressource et fichier(s) supprimés avec succès",
                data: {
                    id: ressource.id,
                    type: ressource.type,
                    nom_original: ressource.nom_original,
                    fichiers_supprimes: {
                        fichier_principal: ressource.url,
                        image_couverture: ressource.image_couverture || null
                    }
                }
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/ressources/association
     * @desc    Récupérer les ressources de l'association (projet_id IS NULL, evenement_id IS NULL)
     * @access  Admin
     */
    async getAssociationRessources(req, res) {
        try {
            const { type } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await ressourceService.getAssociationRessources({ type, limit, offset });
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/ressources/association/:associationId
     * @desc    Récupérer une ressource de l'association par ID
     * @access  Admin
     */
    async getAssociationRessourceById(req, res) {
        try {
            const ressource = await ressourceService.getAssociationRessourceById(req.params.associationId);
            return res.status(200).json({
                success: true,
                data: ressource
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/:lang/ressources/documents
     * @desc    Récupérer les documents de l'association (public, traduit)
     * @access  Public
     */
    async getDocumentsAssociation(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const result = await ressourceService.getDocumentsAssociation(req.lang, { limit, offset });
            const totalPages = Math.ceil(result.count / limit);
            return res.status(200).json({
                success:         true,
                featuredInsight: result.featuredInsight,
                resources:       result.rows,
                pagination: {
                    total:      result.count,
                    page,
                    limit,
                    totalPages,
                    hasNext:    page < totalPages,
                    hasPrev:    page > 1
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new RessourceController();
