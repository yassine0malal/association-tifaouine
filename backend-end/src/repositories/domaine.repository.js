const { Domaine, Projet } = require('../models');

class DomaineRepository {
    // recupere tout les domaines 
    async findAll() {
        return await Domaine.findAll({
            // on inclut les projets lies a ce domaine selon le cdc
            include: [{
                model: Projet,
                required: false // car on peut avoir des domaines sans projets au debut
            }]
        });
    }

    // trouve un domaine par id
    async findById(id) {
        return await Domaine.findByPk(id, {
            include: [{ model: Projet, required: false }]
        });
    }

    // cherche un domaine par son nom (pour eviter les doublons dans la bd)
    async findByName(nom) {
        const { Op } = require('sequelize');
        return await Domaine.findOne({
            where: {
                nom_fr: { [Op.like]: `%${nom}%` }
            }
        });
    }

    // requete de creation 
    async create(data) {
        return await Domaine.create(data);
    }
    
    // modifier le domaine
    async update(id, data) {
        const domaine = await Domaine.findByPk(id);
        // verifier si il existe
        if (!domaine) return null;
        return await domaine.update(data);
    }

    // supprimer le domaine
    async delete(id) {
        const domaine = await Domaine.findByPk(id);
        if (!domaine) return false;
        await domaine.destroy();
        return true;
    }
}

// export de l'instance
module.exports = new DomaineRepository();
