const membreService = require('../services/membre.service');
const { buildPaginatedResponse } = require('../utils/paginate');
const { toMembreListDTO } = require('../dto/membre.dto');

class MembreController {
    async create(req, res) {
        try {
            if (req.files) {
                if (req.files.photo) req.body.photo_profile = `/data/membres/photos/${req.files.photo[0].filename}`;
                if (req.files.identity_card) req.body.carte_identite = `/data/membres/identites/${req.files.identity_card[0].filename}`;
                if (req.files.cv_doc) req.body.cv = `/data/membres/cvs/${req.files.cv_doc[0].filename}`;
            }
            const result = await membreService.createMembers(req.body);
            return res.status(201).json({
                success: true,
                message: result.length > 1 ? "Membres créés avec succès." : "Membre créé avec succès.",
                data: result
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const { status } = req.query;
            const result = await membreService.getAllMembers({ limit, offset, status });
            return res.status(200).json({ success: true, ...buildPaginatedResponse(result, page, limit) });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Impossible de récupérer les membres." });
        }
    }

    /**
     * @route   GET /api/:lang/membres
     */
    async getAllByLang(req, res) {
        try {
            const { lang } = req;
            const { status } = req.query;
            const result = await membreService.getAllMembresWithProfile({ status });
            const data = result.rows.map(m => toMembreListDTO(m, lang));
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const { name, email } = req.query;
            let member;
            if (name)       member = await membreService.getMemberByName(name);
            else if (email) member = await membreService.getMemberByEmail(email);
            else            member = await membreService.getMemberById(id);
            return res.status(200).json({ success: true, data: member });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            if (req.files) {
                if (req.files.photo) req.body.photo_profile = `/data/membres/photos/${req.files.photo[0].filename}`;
                if (req.files.identity_card) req.body.carte_identite = `/data/membres/identites/${req.files.identity_card[0].filename}`;
                if (req.files.cv_doc) req.body.cv = `/data/membres/cvs/${req.files.cv_doc[0].filename}`;
            }
            const updated = await membreService.updateMember(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Membre mis à jour avec succès.", data: updated });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await membreService.deleteMember(req.params.id);
            return res.status(200).json({ success: true, message: "Membre supprimé avec succès." });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new MembreController();
