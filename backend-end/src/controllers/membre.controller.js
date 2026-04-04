const membreService = require('../services/membre.service');

class MembreController {
    /**
     * @route   POST /api/membres
     * @desc    Créer un ou plusieurs membres
     * @access  Private (Admin)
     */
    async create(req, res) {
        try {
            // Si une photo est uploadée, on récupère son chemin relatif
            if (req.file) {
                req.body.photo_profile = `/data/membres/${req.file.filename}`;
            }

            const result = await membreService.createMembers(req.body);
            return res.status(201).json({
                success: true,
                message: result.length > 1 ? "Membres créés avec succès." : "Membre créé avec succès.",
                data: result
            });
        } catch (error) {
            console.error("Erreur creation membre controller : ", error.message);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/membres
     * @desc    Récupérer tous les membres
     * @access  Public 
    */
    async getAll(req, res) {
        try {
            const members = await membreService.getAllMembers();
            return res.status(200).json({
                success: true,
                count: members.length,
                data: members
            });
        } catch (error) {
            console.error("Erreur getAll membres controller : ", error.message);
            return res.status(500).json({
                success: false,
                message: "Impossible de récupérer les membres."
            });
        }
    }

    /**
     * @route   GET /api/membres/:id
     * @desc    Récupérer un membre par ID (ou par Nom/Email via query)
     * @access  Public
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const { name, email } = req.query;

            let member;
            if (name) {
                member = await membreService.getMemberByName(name);
            } else if (email) {
                member = await membreService.getMemberByEmail(email);
            } else {
                member = await membreService.getMemberById(id);
            }

            return res.status(200).json({
                success: true,
                data: member
            });
        } catch (error) {
            console.error("Erreur get membre controller : ", error.message);
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   PUT /api/membres/:id
     * @desc    Mettre à jour un membre
     * @access  Private (Admin)
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            
            // Nouveau fichier ?
            if (req.file) {
                req.body.photo_profile = `/data/membres/${req.file.filename}`;
            }

            const updated = await membreService.updateMember(id, req.body);
            return res.status(200).json({
                success: true,
                message: "Membre mis à jour avec succès.",
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
     * @route   DELETE /api/membres/:id
     * @desc    Supprimer un membre
     * @access  Private (Admin)
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            await membreService.deleteMember(id);
            return res.status(200).json({
                success: true,
                message: "Membre supprimé avec succès."
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new MembreController();
