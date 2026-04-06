const partenariatService = require('../services/partenariat.service');

class PartenariatController {
    /**
     * Créer un nouveau partenariat (Admin seulement)
     */
    async create(req, res) {
        try {
            // Si une image a été uploadée par Multer, on construit le chemin public
            if (req.file) {
                req.body.logo = '/data/partenariats/' + req.file.filename;
            }

            const result = await partenariatService.createPartenariat(req.body);
            return res.status(201).json({
                success: true,
                message: "Partenariat créé avec succès",
                data: result
            });
        } catch (error) {
            console.error("Erreur lors de la création du partenariat : ", error.message);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Récupérer tous les partenariats
     */
    async getAll(req, res) {
        try {
            const list = await partenariatService.getAllPartenariats();
            return res.status(200).json({
                success: true,
                count: list.length,
                data: list
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des partenariats : ", error.message);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur lors de la récupération des partenariats"
            });
        }
    }

    /**
     * Récupérer un partenariat par son ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const partenariat = await partenariatService.getPartenariatById(id);
            return res.status(200).json({
                success: true,
                data: partenariat
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Mettre à jour un partenariat (Admin seulement)
     */
    async update(req, res) {
        try {
            const { id } = req.params;

            // Si un nouveau logo est uploadé, on construit le chemin public
            if (req.file) {
                req.body.logo = '/data/partenariats/' + req.file.filename;
            }

            const updated = await partenariatService.updatePartenariat(id, req.body);
            return res.status(200).json({
                success: true,
                message: "Le partenariat a bien été mis à jour",
                data: updated
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Supprimer un partenariat (Admin seulement)
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            await partenariatService.deletePartenariat(id);
            return res.status(200).json({
                success: true,
                message: "Le partenariat a bien été supprimé"
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new PartenariatController();
