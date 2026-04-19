const benevoleService = require('../services/benevole.service');
const { buildPaginatedResponse } = require('../utils/paginate');
const { toBenevoleListDTO } = require('../dto/benevole.dto');

class BenevoleController {
    async create(req, res) {
        try {
            if (req.file) req.body.photo_profile = `/data/benevoles/${req.file.filename}`;
            const result = await benevoleService.createBenevoles(req.body);
            return res.status(201).json({
                success: true,
                message: result.length > 1 ? "Bénévoles créés avec succès." : "Bénévole créé avec succès.",
                data: result
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const result = await benevoleService.getAllBenevoles({ limit, offset });
            return res.status(200).json({ success: true, ...buildPaginatedResponse(result, page, limit) });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Impossible de récupérer les bénévoles." });
        }
    }

    /**
     * @route   GET /api/:lang/benevoles
     */
    async getAllByLang(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const result = await benevoleService.getAllBenevolesWithProfile({ limit, offset });
            const rows = result.rows.map(b => toBenevoleListDTO(b));
            return res.status(200).json({ success: true, ...buildPaginatedResponse({ count: result.count, rows }, page, limit) });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const { name, email } = req.query;
            let b;
            if (name)       b = await benevoleService.getBenevoleByName(name);
            else if (email) b = await benevoleService.getBenevoleByEmail(email);
            else            b = await benevoleService.getBenevoleById(id);
            return res.status(200).json({ success: true, data: b });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            if (req.file) req.body.photo_profile = `/data/benevoles/${req.file.filename}`;
            const updated = await benevoleService.updateBenevole(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Bénévole mis à jour avec succès.", data: updated });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await benevoleService.deleteBenevole(req.params.id);
            return res.status(200).json({ success: true, message: "Bénévole supprimé avec succès." });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new BenevoleController();
