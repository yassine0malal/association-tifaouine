const domaineService = require('../services/domaine.service');
const { buildPaginatedResponse } = require('../utils/paginate');
const { toDomaineListDTO, toDomaineFullDTO } = require('../dto/domaine.dto');

class DomaineController {
    async create(req, res) {
        try {
            if (req.file) req.body.icone = '/data/domaines/' + req.file.filename;
            const result = await domaineService.createDomaine(req.body);
            return res.status(201).json({ success: true, message: "domaine cree avec succes", data: result });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            // const { page, limit, offset } = req.pagination;
            const result = await domaineService.getAllDomaines();
            return res.status(200).json({ success: true,result });
        } catch (error) {
            return res.status(500).json({ success: false, message: "erreur serveur" });
        }
    }

    async getById(req, res) {
        try {
            const unDomaine = await domaineService.getDomaineById(req.params.id);
            return res.status(200).json({ success: true, data: unDomaine });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/:lang/domaines-navbar
     */
    async getAllByLang(req, res) {
        try {
            const { lang } = req;
            const domaines = await domaineService.getAllDomainesOrdered();
            return res.status(200).json({ success: true, domains: domaines.map(d => toDomaineListDTO(d, lang)) });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * @route   GET /api/:lang/domaines
     */
    async getAllFullByLang(req, res) {
        try {
            const { lang } = req;
            const domaines = await domaineService.getAllDomainesOrdered();
            return res.status(200).json({ success: true, domaines: domaines.map(d => toDomaineFullDTO(d, lang)) });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            if (req.file) req.body.icone = '/data/domaines/' + req.file.filename;
            const theUpdate = await domaineService.updateDomaine(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "le domaine a bien ete mis a jour", data: theUpdate });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await domaineService.deleteDomaine(req.params.id);
            return res.status(200).json({ success: true, message: "le domaine a bien ete supprime" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new DomaineController();
