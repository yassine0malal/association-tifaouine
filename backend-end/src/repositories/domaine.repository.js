const { Domaine, Projet, Evenement } = require('../models');

class DomaineRepository {
    async findAll(filters = {}) {
        // const { limit, offset } = filters;
        return await Domaine.findAndCountAll({
            order:  [['created_at', 'ASC']],
            // limit:  limit  || 9,
            // offset: offset || 0
        });
    }

    async findAllOrdered() {
        return await Domaine.findAll({ order: [['created_at', 'ASC']] });
    }

    async findAllOrderedWithCounts() {
        const domaines = await Domaine.findAll({ order: [['created_at', 'ASC']] });

        return await Promise.all(
            domaines.map(async (domaine) => {
                const [totalProjets, totalEvenements] = await Promise.all([
                    Projet.count({ where: { domaine_id: domaine.id } }),
                    Evenement.count({ where: { domaine_id: domaine.id } })
                ]);
                return { ...domaine.toJSON(), total_projets: totalProjets, total_evenements: totalEvenements };
            })
        );
    }

    // trouve un domaine par id
    async findById(id) {
        return await Domaine.findByPk(id);
    }

    // trouve un domaine par id avec statistiques
    async findByIdWithStats(id) {
        const domaine = await Domaine.findByPk(id);
        if (!domaine) return null;

        const [totalProjets, totalEvenement, projetsTermines] = await Promise.all([
            Projet.count({ where: { domaine_id: id } }),
            Evenement.count({ where: { domaine_id: id } }),
            Projet.count({ where: { domaine_id: id, statut: 'termine' } })
        ]);

        const result = {
            ...domaine.toJSON(),
            nombre_projets_total: totalProjets,
            nombre_total_evenement: totalEvenement,
            nombre_projets_effectues: projetsTermines
        };

        return result;
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
    async create(data, options = {}) {
        return await Domaine.create(data, options);
    }
    
    // modifier le domaine
    async update(id, data, options = {}) {
        const domaine = await Domaine.findByPk(id);
        // verifier si il existe
        if (!domaine) return null;
        return await domaine.update(data, options);
    }

    // supprimer le domaine
    async delete(id, options = {}) {
        const domaine = await Domaine.findByPk(id);
        if (!domaine) return false;
        await domaine.destroy(options);
        return true;
    }

    /**
     * Recuperer tous les domaines avec statistiques des projets et pagination
     * Utilise des requetes separees pour calculer les stats (pattern du backend)
     */
    async findAllWithStats(filters = {}) {
        const { limit, offset } = filters;
        
        // Requete principale pour recuperer les domaines avec pagination
        const domaines = await Domaine.findAndCountAll({
            order: [['created_at', 'ASC']],
            limit: limit || 10,
            offset: offset || 0
        });

        // Pour chaque domaine, calculer les statistiques
        const domainesAvecStats = await Promise.all(
            domaines.rows.map(async (domaine) => {
                const [totalProjets, totalEvenement, projetsTermines] = await Promise.all([
                    // Compter tous les projets du domaine
                    Projet.count({
                        where: { domaine_id: domaine.id }
                    }),
                    // Compter tous les evenements du domaine
                    Evenement.count({
                        where: { domaine_id: domaine.id }
                    }),
                    // Compter les projets termines
                    Projet.count({
                        where: { 
                            domaine_id: domaine.id,
                            statut: 'termine'
                        }
                    })
                ]);

                // Retourner le domaine avec les stats
                return {
                    ...domaine.toJSON(),
                    nombre_projets_total: totalProjets,
                    nombre_total_evenement: totalEvenement,
                    nombre_projets_effectues: projetsTermines
                };
            })
        );

        return {
            count: domaines.count,
            rows: domainesAvecStats
        };
    }
}

// export de l'instance
module.exports = new DomaineRepository();
