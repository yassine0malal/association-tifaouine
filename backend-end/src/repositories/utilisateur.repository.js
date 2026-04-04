const { Utilisateur, admin } = require('../models');

class UtilisateurRepository {
    /**
     * Trouver un utilisateur par son email avec son profil admin associé
     * @param {string} email 
     * @returns {Promise<Utilisateur|null>}
     */
    async findAdminByEmail(email) {
        return await Utilisateur.findOne({
            where: { email },
            include: [{
                model: admin,
                required: true // On veut seulement si c'est un admin
            }]
        });
    }

    /**
     * Trouver un utilisateur par son ID avec ses infos admin
     * @param {number} id 
     * @returns {Promise<Utilisateur|null>}
     */
    async findAdminById(id) {
        return await Utilisateur.findByPk(id, {
            include: [{
                model: admin,
                required: true
            }]
        });
    }
}

module.exports = new UtilisateurRepository();
