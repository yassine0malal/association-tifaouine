const domaineService = require('../services/domaine.service');

class DomaineController {
    
    // fonction pour creer un domaine depuis l'api
    async create(req, res) {
        try {
            // donnees venant du frontend ou postman via req.body   
            const result = await domaineService.createDomaine(req.body);
            return res.status(201).json({
                success: true,
                message: "domaine cree avec succes",
                data: result
            });
        } catch (error) {
            console.error("erreur lors de la creation du domaine : ", error.message);
            // renvoie 400 bad request 
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // recuperer tous les domaines pour affichage dans la navigation 
    async getAll(req, res) {
        try {
            const malist = await domaineService.getAllDomaines();
            return res.status(200).json({
                success: true,
                count: malist.length,
                data: malist
            });
        } catch (error) {
            console.error("probleme pour lister les domaines : ", error.message);
            return res.status(500).json({
                success: false,
                message: "erreur serveur"
            });
        }
    }

    // recuperer un seul domaine
    async getById(req, res) {
        try {
            // recuperation de l'id depuis les parametres de l'url
            const { id } = req.params;
            const unDomaine = await domaineService.getDomaineById(id);
            return res.status(200).json({
                success: true,
                data: unDomaine
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // mise a jour via la methode put 
    async update(req, res) {
        try {
            const { id } = req.params;
            const theUpdate = await domaineService.updateDomaine(id, req.body);
            return res.status(200).json({
                success: true,
                message: "le domaine a bien ete mis a jour",
                data: theUpdate
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // suppression declenchee par le frontend
    async delete(req, res) {
        try {
            const { id } = req.params;
            await domaineService.deleteDomaine(id);
            return res.status(200).json({
                success: true,
                message: "le domaine a bien ete supprime"
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new DomaineController();
