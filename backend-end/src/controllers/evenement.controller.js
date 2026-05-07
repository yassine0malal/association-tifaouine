const evenementService = require('../services/evenement.service');
const { buildPaginatedResponse } = require('../utils/paginate');
const { toEvenementListDTO, toEvenementDetailDTO, toEvenementCompletDTO } = require('../dto/evenement.dto');
const fs = require('fs');

class EvenementController {
    /**
     * @route   GET /api/evenements
     */
    async getAll(req, res) {
        try {
            const { domaine_id, projet_id, annee } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await evenementService.getAllEvenements({ domaine_id, projet_id, annee, limit, offset });
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse(result, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Erreur lors de la récupération des événements", error: error.message });
        }
    }

    /**
     * @route   GET /api/evenements/:id
     */
    async getById(req, res) {
        try {
            const eve = await evenementService.getEvenementById(req.params.id);
            return res.status(200).json({ success: true, data: eve });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    // ─── Méthodes avec langue (DTO frontend) ─────────────────────────────────

    /**
     * @route   GET /api/:lang/evenements
     * @desc    Liste paginée des événements avec DTO selon la langue
     * @query   domaine_id, projet_id, page, limit
     */
    async getAllByLang(req, res) {
        try {
            const { lang } = req;
            const { domaine_id, projet_id } = req.query;
            const { page, limit, offset } = req.pagination;

            const result = await evenementService.getAllEvenementsWithDomaine({ domaine_id, projet_id, limit, offset });
            const rows = result.rows.map(e => toEvenementListDTO(e, lang));
            return res.status(200).json({
                success: true,
                ...buildPaginatedResponse({ count: result.count, rows }, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/:lang/evenements/:id
     * @desc    Détail d'un événement avec événements liés, communs et images
     */
    async getByIdAndLang(req, res) {
        try {
            const { lang } = req;
            const { eve, relatedEvents, lastedEvents, images } =
                await evenementService.getEvenementDetail(req.params.id);

            return res.status(200).json({
                success: true,
                data: toEvenementDetailDTO(eve, lang, relatedEvents, lastedEvents, images)
            });
        } catch (error) {
            const status = error.message.includes("n'existe pas") ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    // // ─── CRUD Admin ───────────────────────────────────────────────────────────

    // /**
    //  * @route   POST /api/evenements
    //  */
    // async create(req, res) {
    //     try {
    //         const nvEve = await evenementService.createEvenement(req.body);
    //         return res.status(201).json({ success: true, message: "Événement créé avec succès", data: nvEve });
    //     } catch (error) {
    //         return res.status(400).json({ success: false, message: "Erreur lors de la création de l'événement", error: error.message });
    //     }
    // }

    // /**
    //  * @route   PUT /api/evenements/:id
    //  */
    // async update(req, res) {
    //     try {
    //         const misAjour = await evenementService.updateEvenement(req.params.id, req.body);
    //         return res.status(200).json({ success: true, message: "Événement mis à jour avec succès", data: misAjour });
    //     } catch (error) {
    //         const status = error.message.includes('introuvable') ? 404 : 400;
    //         return res.status(status).json({ success: false, message: "Erreur lors de la mise à jour de l'événement", error: error.message });
    //     }
    // }

    // /**
    //  * @route   DELETE /api/evenements/:id
    //  */
    // async delete(req, res) {
    //     try {
    //         await evenementService.deleteEvenement(req.params.id);
    //         return res.status(200).json({ success: true, message: "Événement supprimé avec succès" });
    //     } catch (error) {
    //         return res.status(404).json({ success: false, message: "Erreur lors de la suppression de l'événement", error: error.message });
    //     }
    // }

    // ─── Méthodes complètes pour gestion admin ───────────────────────────────

    /**
     * @route   GET /api/evenements/complet/:id
     * @desc    Récupérer un événement complet avec images (pour formulaire d'édition admin)
     * @access  Private (Admin)
     */
    async getByIdComplet(req, res) {
        try {
            const result = await evenementService.getEvenementByIdComplet(req.params.id);
            return res.status(200).json({ success: true, data: toEvenementCompletDTO(result) });
        } catch (error) {
            const status = error.message.includes("n'existe pas") ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/:lang/evenements/:id/images
     * @desc    Récupérer les images d'un événement avec pagination
     * @access  Public
     */
    async getImagesByLang(req, res) {
        try {
            const { lang } = req;
            const { page, limit, offset } = req.pagination;
            const result = await evenementService.getEvenementImages(req.params.id, { limit, offset });
            const totalPages = Math.ceil(result.count / limit);
            return res.status(200).json({
                success: true,
                images: result.rows.map(img => ({ 
                    id: img.id, 
                    src: img.url, 
                    alt: img[`titre_${lang}`] || img.titre_fr || '' 
                })),
                currentPage: page,
                totalPages,
                nextPage: page < totalPages ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : 0,
                itemsPerPage: limit
            });
        } catch (error) {
            const status = error.message.includes("n'existe pas") ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   POST /api/evenements/complet
     * @desc    Créer un événement avec image principale + galerie en une seule requête
     * @access  Private (Admin)
     */
    async createComplet(req, res) {
        const principalFiles = req.files?.['imagePrincipale'] || [];
        const extraFiles = req.files?.['extraImages'] || [];
        const principalFile = principalFiles[0] || null;

        try {
            const nvEvenement = await evenementService.createEvenementComplet(
                req.body,
                principalFile,
                req._principalRelUrl || null,
                extraFiles,
                req._galerieRelUrl || null
            );
            const nbFichiers = extraFiles.length;
            return res.status(201).json({
                success: true,
                message: `Événement créé avec succès${nbFichiers > 0 ? ` (${nbFichiers} image(s) ajoutée(s))` : ''}`,
                data: nvEvenement
            });
        } catch (error) {
            const allFiles = [...principalFiles, ...extraFiles];
            for (const file of allFiles) {
                if (file.path && fs.existsSync(file.path)) {
                    try { fs.unlinkSync(file.path); } catch (_) { }
                }
            }
            return res.status(400).json({ 
                success: false, 
                message: "Erreur lors de la création de l'événement", 
                error: error.message 
            });
        }
    }

    /**
     * @route   PUT /api/evenements/complet/:id
     * @desc    Mettre à jour un événement complet (champs + fichiers optionnels)
     * @access  Private (Admin)
     */
    async updateComplet(req, res) {
        const principalFiles = req.files?.['imagePrincipale'] || [];
        const extraFiles = req.files?.['extraImages'] || [];
        const principalFile = principalFiles[0] || null;

        try {
            const dataToUpdate = { ...req.body };

            // Normaliser les tableaux depuis FormData
            if (req.body['partenariat_ids[]']) {
                dataToUpdate.partenariat_ids = Array.isArray(req.body['partenariat_ids[]'])
                    ? req.body['partenariat_ids[]']
                    : [req.body['partenariat_ids[]']];
                delete dataToUpdate['partenariat_ids[]'];
            }

            const rawExtraImages = req.body['existingExtraImages[]'] ?? req.body['existingExtraImages'];
            if (rawExtraImages !== undefined) {
                dataToUpdate.existingExtraImages = Array.isArray(rawExtraImages) ? rawExtraImages : [rawExtraImages];
            } else {
                dataToUpdate.existingExtraImages = [];
            }
            delete dataToUpdate['existingExtraImages[]'];

            const processedData = this._processExistingResourcesData 
                ? this._processExistingResourcesData(dataToUpdate) 
                : dataToUpdate;

            const misAjour = await evenementService.updateEvenementComplet(
                req.params.id,
                processedData,
                principalFile,
                req._principalRelUrl || null,
                extraFiles,
                req._galerieRelUrl || null
            );

            return res.status(200).json({ 
                success: true, 
                message: "Événement mis à jour avec succès", 
                data: misAjour 
            });

        } catch (error) {
            const allFiles = [...principalFiles, ...extraFiles];
            for (const file of allFiles) {
                if (file.path && fs.existsSync(file.path)) {
                    try { fs.unlinkSync(file.path); } catch (_) { }
                }
            }
            console.error("=== [updateComplet] ERROR ===");
            console.error("Message:", error.message);
            console.error("Stack:", error.stack);
            const status = error.message.includes('introuvable') ? 404 : 400;
            return res.status(status).json({ 
                success: false, 
                message: "Erreur lors de la mise à jour de l'événement", 
                error: error.message 
            });
        }
    }

    /**
     * Méthode utilitaire pour traiter les données des ressources existantes
     */
    _processExistingResourcesData(body) {
        const processedData = { ...body };

        // Traiter existingImagePrincipale
        if (processedData.existingImagePrincipale) {
            if (typeof processedData.existingImagePrincipale === 'string' && processedData.existingImagePrincipale.trim() !== '') {
                processedData.existingImagePrincipale = processedData.existingImagePrincipale.trim();
            } else {
                processedData.existingImagePrincipale = null;
            }
        } else {
            processedData.existingImagePrincipale = null;
        }

        // Traiter existingExtraImages
        if (processedData.existingExtraImages !== undefined) {
            if (processedData.existingExtraImages === null || processedData.existingExtraImages === '') {
                processedData.existingExtraImages = [];
            } else if (typeof processedData.existingExtraImages === 'string') {
                try {
                    processedData.existingExtraImages = JSON.parse(processedData.existingExtraImages);
                } catch (e) {
                    processedData.existingExtraImages = [];
                }
                if (!Array.isArray(processedData.existingExtraImages)) {
                    processedData.existingExtraImages = [];
                }
            } else if (!Array.isArray(processedData.existingExtraImages)) {
                processedData.existingExtraImages = [];
            }
        }

        return processedData;
    }

    /**
     * @route   DELETE /api/evenements/complet/:id
     * @desc    Supprimer un événement et toutes ses ressources (fichiers + DB)
     * @access  Private (Admin)
     */
    async deleteComplet(req, res) {
        try {
            await evenementService.deleteEvenementComplet(req.params.id);
            return res.status(200).json({ 
                success: true, 
                message: "Événement et toutes ses ressources supprimés avec succès" 
            });
        } catch (error) {
            const status = error.message.includes("n'existe pas") ? 404 : 400;
            return res.status(status).json({ 
                success: false, 
                message: "Erreur lors de la suppression de l'événement", 
                error: error.message 
            });
        }
    }
}

module.exports = new EvenementController();
