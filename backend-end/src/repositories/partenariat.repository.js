const { Partenariat, ProjetPartenariat, EvenementPartenariat } = require('../models');

class PartenariatRepository {
    /**
     * Récupérer tous les partenariats
     */
    async findAll(filters = {}) {
        const { limit, offset } = filters;
        return await Partenariat.findAndCountAll({
            order:  [['created_at', 'DESC']]
            
        });
    }

    /**
     * Trouver un partenariat par son ID
     * @param {number} id 
     */
    async findById(id) {
        return await Partenariat.findByPk(id);
    }

    /**
     * Chercher un partenariat par son nom (pour éviter les doublons)
     * @param {string} nom 
     */
    async findByName(nom) {
        const { Op } = require('sequelize');
        return await Partenariat.findOne({
            where: {
                nom_fr: { [Op.like]: `%${nom}%` }
            }
        });
    }

    /**
     * Création d'un partenariat
     * @param {Object} data 
     * @param {Object} options 
     */
    async create(data, options = {}) {
        return await Partenariat.create(data, options);
    }

    /**
     * Mise à jour d'un partenariat
     * @param {number} id 
     * @param {Object} data 
     * @param {Object} options 
     */
    async update(id, data, options = {}) {
        const partenariat = await Partenariat.findByPk(id);
        if (!partenariat) return null;
        return await partenariat.update(data, options);
    }

    /**
     * Suppression d'un partenariat
     * @param {number} id 
     * @param {Object} options 
     */
    async delete(id, options = {}) {
        const partenariat = await Partenariat.findByPk(id);
        if (!partenariat) return false;
        await partenariat.destroy(options);
        return true;
    }

    /**
     * Recuperer tous les partenariats avec statistiques et pagination
     */
    async findAllWithStats(filters = {}) {
        const { limit, offset } = filters;
        
        const partenariats = await Partenariat.findAndCountAll({
            order: [['created_at', 'DESC']],
            limit: limit || 10,
            offset: offset || 0
        });

        const partenariatsAvecStats = await Promise.all(
            partenariats.rows.map(async (partenariat) => {
                const [totalProjets, totalEvenements] = await Promise.all([
                    ProjetPartenariat.count({
                        where: { partenariat_id: partenariat.id }
                    }),
                    EvenementPartenariat.count({
                        where: { partenariat_id: partenariat.id }
                    })
                ]);

                return {
                    ...partenariat.toJSON(),
                    nombre_projets: totalProjets,
                    nombre_evenements: totalEvenements
                };
            })
        );

        return {
            count: partenariats.count,
            rows: partenariatsAvecStats
        };
    }

    /**
     * Trouver un partenariat par ID avec statistiques
     */
    async findByIdWithStats(id) {
        const partenariat = await Partenariat.findByPk(id);
        if (!partenariat) return null;

        const [totalProjets, totalEvenements] = await Promise.all([
            ProjetPartenariat.count({ where: { partenariat_id: id } }),
            EvenementPartenariat.count({ where: { partenariat_id: id } })
        ]);

        const result = {
            ...partenariat.toJSON(),
            nombre_projets: totalProjets,
            nombre_evenements: totalEvenements
        };

        return result;
    }
}

module.exports = new PartenariatRepository();
