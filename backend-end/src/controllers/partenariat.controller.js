const partenariatService = require('../services/partenariat.service');
const { buildPaginatedResponse } = require('../utils/paginate');
const { toPartenariatListDTO } = require('../dto/partenariat.dto');
const { toPartenariathomeListDTO} = require('../dto/partenariat.dto-home');

class PartenariatController {
    async create(req, res) {
        try {
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
            console.error('[ERROR CREATE]:', error.message);
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    async getAll(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const result = await partenariatService.getAllPartenariats({ limit, offset });
            return res.status(200).json({ success: true, ...buildPaginatedResponse(result, page, limit) });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Erreur serveur lors de la récupération des partenariats" });
        }
    }

    /**
     * @route   GET /api/:lang/partenariats
     */
    async getAllByLang(req, res) {
        try {
            const { lang } = req;
            const result = await partenariatService.getAllPartenariatsByLang();
            const rows = result.rows.map(p => toPartenariatListDTO(p, lang));
            return res.status(200).json({ success: true, rows });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAllByLangForHome(req, res) {
        try {
            const { lang } = req;
            const result = await partenariatService.getAllPartenariatsByLang();
            const rows = result.rows.map(p => toPartenariathomeListDTO(p, lang));
            return res.status(200).json({ success: true, rows });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }


    }
    async getById(req, res) {
        try {
            const partenariat = await partenariatService.getPartenariatById(req.params.id);
            return res.status(200).json({ success: true, data: partenariat });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/partenariats/admin/all
     * @desc    Récupérer tous les partenariats avec stats et pagination (Admin)
     */
    async getAllWithStats(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            const result = await partenariatService.getAllPartenariatsWithStats(page, limit);
            
            return res.status(200).json({
                success: true,
                data: result.partenariats,
                pagination: result.pagination
            });
        } catch (error) {
            console.error('[ERROR] getAllWithStats:', error.message);
            return res.status(500).json({ 
                success: false, 
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/partenariats/admin/:id
     * @desc    Récupérer un partenariat par ID avec statistiques (Admin)
     */
    async getByIdWithStats(req, res) {
        try {
            const partenariat = await partenariatService.getPartenariatByIdWithStats(req.params.id);
            return res.status(200).json({ success: true, data: partenariat });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            if (req.file) {
                req.body.logo = '/data/partenariats/' + req.file.filename;
            }
            
            const updated = await partenariatService.updatePartenariat(req.params.id, req.body);
            
            return res.status(200).json({ 
                success: true, 
                message: "Le partenariat a bien été mis à jour", 
                data: updated 
            });
        } catch (error) {
            console.error('[ERROR UPDATE]:', error.message);
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    async delete(req, res) {
        try {
            await partenariatService.deletePartenariat(req.params.id);
            
            return res.status(200).json({ 
                success: true, 
                message: "Le partenariat a bien été supprimé" 
            });
        } catch (error) {
            console.error('[ERROR DELETE]:', error.message);
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
}

module.exports = new PartenariatController();
