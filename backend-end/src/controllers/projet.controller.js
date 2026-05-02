const projetService = require('../services/projet.service');
const { buildPaginatedResponse } = require('../utils/paginate');
const { toProjetListDTO, toProjetDetailDTO, toProjetForDonListDTO, toProjetAdminListDTO, toProjetCompletDTO } = require('../dto/projet.dto');
const fs = require('fs');

class ProjetController {

    async getAll(req, res) {
        try {
            const { domaine_id, annee } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await projetService.getAllProjets({ domaine_id, annee, limit, offset });
            return res.status(200).json({ success: true, count: result.count, ...buildPaginatedResponse(result, page, limit) });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Erreur lors de la récupération des projets", error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const projet = await projetService.getProjetById(req.params.id);
            return res.status(200).json({ success: true, data: projet });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    // ─── Méthodes avec langue (DTO frontend) ─────────────────────────────────

    /**
     * @route   GET /api/:lang/projets
     */
    async getAllByLang(req, res) {
        try {
            const { lang } = req;
            const { domaine_id, statut } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await projetService.getAllProjetsWithDomaine({ domaine_id, statut, limit, offset });
            const rows = result.rows.map(p => toProjetListDTO(p.toJSON(), lang));
            return res.status(200).json({ success: true, ...buildPaginatedResponse({ count: result.count, rows }, page, limit) });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/:lang/projet-admin
     * @desc    Récupérer tous les projets pour le tableau de bord admin (public, traduit)
     */
    async getAllByLangForAdmin(req, res) {
        try {
            const { lang } = req;
            const { domaine_id, statut } = req.query;
            const { page, limit, offset } = req.pagination;
            const result = await projetService.getAllProjetsForAdmin({ domaine_id, statut, limit, offset });
            const rows = result.rows.map(p => toProjetAdminListDTO(p.toJSON(), lang));
            return res.status(200).json({
                success:      true,
                total_budget: result.total_budget,
                ...buildPaginatedResponse({ count: result.count, rows }, page, limit)
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAllByLangForDon(req, res) {
        try {
            const { lang } = req;
            const result = await projetService.getAllProjetsWithDomaineForDon({});
            const rows = result.rows.map(p => toProjetForDonListDTO(p.toJSON(), lang));
            return res.status(200).json({ success: true, rows });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/:lang/projets/:id
     */
    async getByIdAndLang(req, res) {
        try {
            const { lang } = req;
            const projet = await projetService.getProjetByIdWithDetails(req.params.id);
            return res.status(200).json({ success: true, data: toProjetDetailDTO(projet.toJSON(), lang) });
        } catch (error) {
            const status = error.message.includes("n'existe pas") ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/:lang/projets/:id/images
     */
    async getImagesByLang(req, res) {
        try {
            const { lang } = req;
            const { page, limit, offset } = req.pagination;
            const result = await projetService.getProjetImages(req.params.id, { limit, offset });
            const totalPages = Math.ceil(result.count / limit);
            return res.status(200).json({
                success:      true,
                images:       result.rows.map(img => ({ id: img.id, src: img.url, alt: img[`titre_${lang}`] || img.titre_fr || '' })),
                currentPage:  page,
                totalPages,
                nextPage:     page < totalPages ? page + 1 : null,
                prevPage:     page > 1 ? page - 1 : 0,
                itemsPerPage: limit
            });
        } catch (error) {
            const status = error.message.includes("n'existe pas") ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    // ─── CRUD Admin ───────────────────────────────────────────────────────────

    /**
     * @route   GET /api/projets/complet/:id
     * @desc    Récupérer un projet complet avec images et vidéos (pour formulaire d'édition admin)
     * @access  Private (Admin)
     */
    async getByIdComplet(req, res) {
        try {
            const result = await projetService.getProjetByIdComplet(req.params.id);
            return res.status(200).json({ success: true, data: toProjetCompletDTO(result) });
        } catch (error) {
            const status = error.message.includes("n'existe pas") ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   POST /api/projets
     */
    async create(req, res) {
        try {
            if (req.file && req.uploadedUrl) {
                req.body.image_principale = `${req.uploadedUrl}/${req.file.filename}`;
            }
            const nvProjet = await projetService.createProjet(req.body);
            return res.status(201).json({ success: true, message: "Projet créé avec succès", data: nvProjet });
        } catch (error) {
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                try { fs.unlinkSync(req.file.path); } catch (_) {}
            }
            return res.status(400).json({ success: false, message: "Erreur lors de la création du projet", error: error.message });
        }
    }

    /**
     * @route   POST /api/projets/complet
     * @desc    Créer un projet avec image principale + galerie + vidéos en une seule requête
     * @access  Private (Admin)
     */
    async createComplet(req, res) {
        const principalFiles = req.files?.['imagePrincipale'] || [];
        const extraFiles     = req.files?.['extraImages']     || [];
        const videoFiles     = req.files?.['extraVideos']     || [];
        const principalFile  = principalFiles[0] || null;

        try {
            const nvProjet = await projetService.createProjetComplet(
                req.body,
                principalFile,
                req._principalRelUrl || null,
                extraFiles,
                req._galerieRelUrl   || null,
                videoFiles,
                req._videosRelUrl    || null
            );
            const nbFichiers = extraFiles.length + videoFiles.length;
            return res.status(201).json({
                success: true,
                message: `Projet créé avec succès${nbFichiers > 0 ? ` (${nbFichiers} fichier(s) ajouté(s))` : ''}`,
                data:    nvProjet
            });
        } catch (error) {
            const allFiles = [...principalFiles, ...extraFiles, ...videoFiles];
            for (const file of allFiles) {
                if (file.path && fs.existsSync(file.path)) {
                    try { fs.unlinkSync(file.path); } catch (_) {}
                }
            }
            return res.status(400).json({ success: false, message: "Erreur lors de la création du projet", error: error.message });
        }
    }

    /**
     * @route   PUT /api/projets/:id
     */
    async update(req, res) {
        try {
            if (req.file && req.uploadedUrl) {
                req.body.image_principale = `${req.uploadedUrl}/${req.file.filename}`;
            }
            const misAjour = await projetService.updateProjet(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Projet mis à jour avec succès", data: misAjour });
        } catch (error) {
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                try { fs.unlinkSync(req.file.path); } catch (_) {}
            }
            return res.status(error.message.includes('introuvable') ? 404 : 400).json({ success: false, message: "Erreur lors de la mise à jour du projet", error: error.message });
        }
    }

    /**
     * @route   PUT /api/projets/complet/:id
     * @desc    Mettre à jour un projet complet (champs + fichiers optionnels)
     * @access  Private (Admin)
     * 
     * @body_params:
     * - existingImagePrincipale: string - URL de l'image principale à conserver
     * - existingExtraImages: array|string - Tableau des URLs des images de galerie à conserver
     * - existingVideos: array|string - Tableau des URLs des vidéos à conserver
     * - imagePrincipale: file - Nouvelle image principale (optionnel)
     * - extraImages: files[] - Nouvelles images à ajouter (optionnel)
     * - extraVideos: files[] - Nouvelles vidéos à ajouter (optionnel)
     * 
     * @logic:
     * 1. Garde seulement les ressources présentes dans les tableaux "existing"
     * 2. Supprime physiquement et en DB les ressources non mentionnées
     * 3. Ajoute les nouveaux fichiers uploadés
     */
    async updateComplet(req, res) {
        const principalFiles = req.files?.['imagePrincipale'] || [];
        const extraFiles     = req.files?.['extraImages']     || [];
        const videoFiles     = req.files?.['extraVideos']     || [];
        const principalFile  = principalFiles[0] || null;

        try {
            // Traiter les données des ressources existantes
            const processedData = this._processExistingResourcesData(req.body);
            
            const misAjour = await projetService.updateProjetComplet(
                req.params.id,
                processedData,
                principalFile,
                req._principalRelUrl || null,
                extraFiles,
                req._galerieRelUrl   || null,
                videoFiles,
                req._videosRelUrl    || null
            );
            return res.status(200).json({ success: true, message: "Projet mis à jour avec succès", data: misAjour });
        } catch (error) {
            const allFiles = [...principalFiles, ...extraFiles, ...videoFiles];
            for (const file of allFiles) {
                if (file.path && fs.existsSync(file.path)) {
                    try { fs.unlinkSync(file.path); } catch (_) {}
                }
            }
            const status = error.message.includes('introuvable') ? 404 : 400;
            return res.status(status).json({ success: false, message: "Erreur lors de la mise à jour du projet", error: error.message });
        }
    }

    /**
     * Méthode utilitaire pour traiter les données des ressources existantes
     * Convertit les chaînes JSON en tableaux si nécessaire
     */
    _processExistingResourcesData(body) {
        const processedData = { ...body };

        // Traiter existingExtraImages
        if (processedData.existingExtraImages) {
            if (typeof processedData.existingExtraImages === 'string') {
                try {
                    processedData.existingExtraImages = JSON.parse(processedData.existingExtraImages);
                } catch (e) {
                    processedData.existingExtraImages = [];
                }
            }
            if (!Array.isArray(processedData.existingExtraImages)) {
                processedData.existingExtraImages = [];
            }
        } else {
            processedData.existingExtraImages = [];
        }

        // Traiter existingVideos
        if (processedData.existingVideos) {
            if (typeof processedData.existingVideos === 'string') {
                try {
                    processedData.existingVideos = JSON.parse(processedData.existingVideos);
                } catch (e) {
                    processedData.existingVideos = [];
                }
            }
            if (!Array.isArray(processedData.existingVideos)) {
                processedData.existingVideos = [];
            }
        } else {
            processedData.existingVideos = [];
        }

        return processedData;
    }

    /**
     * @route   DELETE /api/projets/:id
     */
    async delete(req, res) {
        try {
            await projetService.deleteProjet(req.params.id);
            return res.status(200).json({ success: true, message: "Projet supprimé avec succès" });
        } catch (error) {
            return res.status(404).json({ success: false, message: "Erreur lors de la suppression du projet", error: error.message });
        }
    }

    /**
     * @route   DELETE /api/projets/complet/:id
     * @desc    Supprimer un projet et toutes ses ressources (fichiers + DB)
     * @access  Private (Admin)
     */
    async deleteComplet(req, res) {
        try {
            await projetService.deleteProjetComplet(req.params.id);
            return res.status(200).json({ success: true, message: "Projet et toutes ses ressources supprimés avec succès" });
        } catch (error) {
            const status = error.message.includes("n'existe pas") ? 404 : 400;
            return res.status(status).json({ success: false, message: "Erreur lors de la suppression du projet", error: error.message });
        }
    }
}

module.exports = new ProjetController();
